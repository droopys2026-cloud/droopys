"use server";

import { getCartForCheckout } from "@/lib/queries/cart";
import { getShopSettings } from "@/lib/queries/settings";
import { issueMessages } from "@/lib/account/schema";
import {
  addressLines,
  checkoutDetailsSchema,
  shippingCentsFor,
  toSessionMetadata,
} from "@/lib/checkout/details";
import { getServicePoint } from "@/lib/shipping/sendcloud";
import { parcelWeightKg, quoteParcel } from "@/lib/shipping/quote";
import { SERVICES } from "@/lib/shipping/services";
import { variantLabel } from "@/lib/products/variants";
import { readPromoCode } from "@/lib/promo/cookie";
import { evaluateCode } from "@/lib/queries/promo";
import { publicEnv } from "@/lib/env";
import { CURRENCY, stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Ouvre la session de paiement de l'étape 3 du tunnel.
 *
 * **Aucun montant ne vient du navigateur.** Le formulaire n'envoie que des
 * coordonnées et un mode de livraison ; les prix, le stock et le port sont
 * relus ici, en base, juste avant de créer la session. C'est la seule façon
 * de garantir que ce qui est débité est ce que la boutique affiche.
 *
 * La session est en `ui_mode: "elements"` : la carte se saisit dans notre
 * page (Payment Element), mais c'est toujours une Checkout Session — Stripe
 * calcule les totaux et choisit les moyens de paiement à proposer.
 *
 * La commande n'est **pas** créée maintenant : elle le sera par le webhook,
 * quand Stripe confirmera le paiement. La créer avant, c'est se retrouver avec
 * une commande fantôme pour chaque tunnel abandonné.
 */
export type PaymentSessionResult =
  | { status: "ready"; clientSecret: string; totalCents: number }
  | { status: "error"; errors: string[] };

/**
 * Libellé de suivi des sessions dans le tableau de bord Stripe, avec le
 * suffixe aléatoire de huit lettres que Stripe demande.
 */
const INTEGRATION_ID = "droopys-tunnel-qkzrwmta";

export async function createPaymentSession(
  input: unknown,
): Promise<PaymentSessionResult> {
  const parsed = checkoutDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", errors: issueMessages(parsed.error) };
  }
  const details = parsed.data;

  const [lines, { livraison }, user] = await Promise.all([
    getCartForCheckout(),
    getShopSettings(),
    getCurrentUser(),
  ]);
  if (lines.length === 0) {
    return { status: "error", errors: ["Votre panier est vide."] };
  }

  const itemsCents = lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  // Code promo : revérifié ici avec l'e-mail saisi — c'est la seule étape où
  // « une fois par cliente » peut l'être pour une visiteuse sans compte, et un
  // code a pu expirer depuis le panier. Refusé, le paiement ne s'ouvre pas :
  // débiter sans la remise annoncée serait pire.
  const promoCode = await readPromoCode();
  let discountCents = 0;
  if (promoCode) {
    const promo = await evaluateCode(
      promoCode,
      lines.map(({ variant, quantity, unitPriceCents }) => ({
        productId: variant.product.id,
        unitPriceCents,
        quantity,
        // Soldé : même règle que l'affichage du prix barré (`getCart`).
        onSale:
          variant.priceCents === null &&
          variant.product.compareAtPriceCents !== null &&
          variant.product.compareAtPriceCents > unitPriceCents,
      })),
      {
        customerId: user?.id,
        email: details.contact.email,
        phone: details.contact.phone,
        deliveryMethod: details.delivery.method,
        addressLines:
          details.delivery.method === "domicile" ? addressLines(details.delivery.address) : null,
      },
    );
    if (!promo.ok) {
      return {
        status: "error",
        errors: [`Code ${promo.code} : ${promo.message} Retirez-le depuis le panier pour continuer.`],
      };
    }
    discountCents = promo.discountCents;
  }
  const weightKg = parcelWeightKg(
    lines.map(({ variant, quantity }) => ({
      categorySlug: variant.product.category?.slug ?? null,
      subcategorySlug: variant.product.subcategory?.slug ?? null,
      quantity,
    })),
    livraison.weights,
  );
  const { delivery } = details;

  // Où part le colis, et à quelle adresse — relue chez Sendcloud pour un
  // relais : le navigateur n'envoie que l'identifiant du point.
  let country = "FR";
  let shippingAddress: string[] = [];
  if (delivery.method === "domicile") {
    country = delivery.address.country;
    shippingAddress = addressLines(delivery.address);
  } else if (delivery.method === "relais") {
    const service = SERVICES.find((entry) => entry.key === delivery.service);
    const point = await getServicePoint(delivery.servicePointId).catch(() => null);
    if (!point || !point.is_active || point.carrier !== service?.carrier) {
      return {
        status: "error",
        errors: ["Ce point relais n'est plus disponible. Choisissez-en un autre."],
      };
    }
    country = point.country;
    shippingAddress = [
      point.name,
      [point.house_number, point.street].filter(Boolean).join(" "),
      `${point.postal_code} ${point.city}`,
      point.country,
    ];
  }

  const options =
    delivery.method === "retrait" ? [] : await quoteParcel(country, weightKg);
  const shippingCents =
    // Franchise de port sur le montant des articles après remise.
    options === null
      ? null
      : shippingCentsFor(delivery, options, itemsCents - discountCents, livraison.freeFromCents);
  if (shippingCents === null) {
    return {
      status: "error",
      errors: [
        "Ce mode de livraison n'est pas disponible pour le moment. Choisissez-en un autre, ou le retrait en boutique.",
      ],
    };
  }
  const option =
    delivery.method === "retrait"
      ? null
      : (options ?? []).find((entry) => entry.key === delivery.service) ?? null;

  // La remise part chez Stripe en coupon à usage unique, du montant exact
  // calculé ici : Stripe l'affiche (« BLACK20 −35,00 € ») et ne l'applique
  // qu'aux articles, jamais au port. Voir la spec des codes promo.
  const coupon =
    promoCode && discountCents > 0
      ? await stripe.coupons.create({
          amount_off: discountCents,
          currency: CURRENCY,
          duration: "once",
          max_redemptions: 1,
          name: promoCode,
          metadata: { promo: promoCode },
        })
      : null;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "elements",
    mode: "payment",
    integration_identifier: INTEGRATION_ID,
    customer_email: details.contact.email,
    line_items: lines.map(({ variant, quantity, unitPriceCents }) => ({
      quantity,
      price_data: {
        currency: CURRENCY,
        unit_amount: unitPriceCents,
        product_data: {
          name: `${variant.product.brand.name} — ${variant.product.name}`,
          description: variantLabel({ color: variant.color?.name, size: variant.size }),
          images: variant.product.images
            .slice(0, 1)
            .map((image) => image.url)
            .filter((url) => url.startsWith("https://")),
        },
      },
    })),

    ...(coupon ? { discounts: [{ coupon: coupon.id }] } : {}),

    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingCents, currency: CURRENCY },
          display_name: option?.label ?? "Retrait en boutique",
        },
      },
    ],

    // Client connecté : son identifiant suit le paiement jusqu'au webhook,
    // qui rattache la commande au compte.
    ...(user ? { client_reference_id: user.id } : {}),

    metadata: {
      // Les variantes voyagent dans les métadonnées : le webhook en a besoin
      // pour décrémenter le stock, et l'objet de session ne les porte pas.
      lignes: JSON.stringify(
        lines.map(({ variant, quantity }) => ({ v: variant.id, q: quantity })),
      ),
      // Le code voyage jusqu'au webhook, qui l'inscrit sur la commande et
      // compte l'utilisation. Le montant, lui, est relu chez Stripe.
      ...(coupon && promoCode ? { promo: promoCode } : {}),
      ...toSessionMetadata(details, {
        addressLines: shippingAddress,
        methodId: option?.methodId ?? null,
      }),
    },

    return_url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/commande/merci?session_id={CHECKOUT_SESSION_ID}`,
    locale: "fr",
  });

  if (!session.client_secret) {
    console.error(`Session ${session.id} sans client_secret.`);
    return {
      status: "error",
      errors: ["Le paiement est indisponible pour le moment. Réessayez dans un instant."],
    };
  }

  return {
    status: "ready",
    clientSecret: session.client_secret,
    // Relu chez Stripe : ce qui s'affiche sur « Payer » est ce qui sera débité.
    totalCents: session.amount_total ?? itemsCents - discountCents + shippingCents,
  };
}
