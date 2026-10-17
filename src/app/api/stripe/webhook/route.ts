import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import type Stripe from "stripe";
import { db, type Transaction } from "@/db";
import { customers, orderLines, orders, productVariants, promoCodes } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import { readSessionMetadata } from "@/lib/checkout/details";
import { sendOrderConfirmation } from "@/lib/email/send-order-confirmation";
import { serverEnv } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { variantPriceCents } from "@/lib/products/variants";

/**
 * Webhook Stripe : c'est **ici**, et nulle part ailleurs, qu'une commande naît.
 *
 * Le retour du client sur la page de remerciement ne prouve rien : il peut
 * fermer l'onglet avant, ou forger l'adresse. Seul Stripe sait si l'argent a
 * bougé, et il le dit par cet appel — signé, vérifiable, réémis en cas
 * d'échec.
 *
 * Trois exigences, dans l'ordre :
 *
 * 1. **Vérifier la signature** avant de lire quoi que ce soit. Sans elle,
 *    n'importe qui peut faire expédier une commande jamais payée.
 * 2. **Être idempotent.** Stripe réémet un événement tant qu'il n'a pas reçu
 *    de 2xx ; sans garde, un réessai crée une seconde commande et décrémente
 *    le stock deux fois. La référence de session, unique, sert de garde.
 * 3. **Répondre vite.** Un traitement long fait expirer l'appel côté Stripe,
 *    qui réessaie — et la lenteur devient une duplication.
 *
 * Un quatrième point, appris à nos dépens : **l'objet porté par l'événement
 * n'est pas lu**, seul son identifiant l'est. Stripe rend ses événements dans
 * la version d'API par défaut du compte — ici `2020-03-02` — où les frais de
 * port ne sont pas au même endroit que dans la version du SDK. Les types
 * TypeScript décrivaient alors une forme que le JSON reçu n'avait pas, et les
 * frais de port arrivaient à zéro. Relire la session avec notre client donne
 * une forme qui correspond aux types, quelle que soit la version du compte.
 */

/** Lignes rangées dans les métadonnées de la session au moment du paiement. */
const metadataLinesSchema = z.array(
  z.object({ v: z.string().uuid(), q: z.number().int().min(1) }),
);

export async function POST(request: Request) {
  if (!serverEnv.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET absente : webhook refusé.");
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente." }, { status: 400 });
  }

  // Le corps brut est indispensable : la signature porte sur les octets reçus,
  // pas sur l'objet reconstruit par `request.json()`.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    // Signature invalide : on refuse sans détailler pourquoi, et on le trace.
    console.error("Signature Stripe invalide :", (error as Error).message);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  // Deux événements peuvent porter un paiement abouti : `completed` pour une
  // carte, `async_payment_succeeded` pour un moyen qui se confirme plus tard
  // (Klarna, virement). Un `completed` encore impayé ne crée rien — c'est
  // `recordOrder` qui filtre sur `payment_status`, et l'idempotence évite le
  // doublon si les deux arrivent pour une session déjà payée.
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = await stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    await recordOrder(session);
  }

  // Tout autre type reçoit un 2xx : un événement non traité n'est pas une
  // erreur, et répondre en échec ferait réessayer Stripe indéfiniment.
  return NextResponse.json({ received: true });
}

/** Crée la commande et décrémente le stock, une seule fois par session. */
async function recordOrder(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const already = await db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, session.id),
    columns: { id: true },
  });
  if (already) return;

  const parsed = metadataLinesSchema.safeParse(
    JSON.parse(session.metadata?.lignes ?? "[]"),
  );
  if (!parsed.success || parsed.data.length === 0) {
    console.error(`Session ${session.id} sans lignes exploitables.`);
    return;
  }

  const variants = await db.query.productVariants.findMany({
    where: (variant, { inArray }) =>
      inArray(
        variant.id,
        parsed.data.map((line) => line.v),
      ),
    with: { color: true, product: { with: { brand: true } } },
  });
  const byId = new Map(variants.map((variant) => [variant.id, variant]));

  // Deux champs disent la même chose selon la version d'API ; on prend le
  // premier qui répond, et zéro seulement si aucun ne le fait.
  const shipping =
    session.total_details?.amount_shipping ??
    session.shipping_cost?.amount_total ??
    0;
  // L'adresse est saisie dans notre tunnel et voyage dans les métadonnées.
  // Les sessions de l'ancien parcours (page Stripe hébergée) la portaient
  // dans `shipping_details` : on les lit encore, le temps qu'elles expirent.
  const delivery = readSessionMetadata(session.metadata);
  const address = session.collected_information?.shipping_details?.address;
  const shippingName =
    delivery?.name ?? session.collected_information?.shipping_details?.name;
  const shippingAddress =
    delivery?.addressLines ??
    [
      address?.line1,
      address?.line2,
      [address?.postal_code, address?.city].filter(Boolean).join(" "),
      address?.country,
    ].filter((line): line is string => Boolean(line));

  const customerId = await resolveCustomerId(session.client_reference_id);

  // Code promo : le code vient de nos métadonnées, le montant de Stripe — c'est
  // ce qui a réellement été déduit du paiement, il fait foi sur la commande.
  const promoCode = session.metadata?.promo || null;
  const discountCents = session.total_details?.amount_discount ?? 0;

  const orderId = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        reference: await nextReference(tx),
        status: "a-preparer",
        customerId,
        customerName: shippingName ?? session.customer_details?.name ?? "Client",
        customerEmail: session.customer_details?.email ?? "",
        customerPhone: delivery?.phone ?? session.customer_details?.phone ?? null,
        deliveryMethod: delivery?.method ?? "domicile",
        // De quoi créer l'étiquette Sendcloud depuis l'admin, sans redemander
        // à la cliente ce qu'elle a choisi.
        shippingService: delivery?.service || null,
        shippingMethodId: delivery?.methodId ?? null,
        servicePointId: delivery?.servicePointId ?? null,
        shippingAddress,
        shippingCents: shipping,
        promoCode: discountCents > 0 ? promoCode : null,
        discountCents,
        payment: "Carte bancaire (Stripe)",
        stripeSessionId: session.id,
      })
      .returning({ id: orders.id });

    for (const line of parsed.data) {
      const variant = byId.get(line.v);
      if (!variant) continue;

      await tx.insert(orderLines).values({
        orderId: order.id,
        productId: variant.productId,
        variantId: variant.id,
        productName: variant.product.name,
        brand: variant.product.brand.name,
        // Le nom et non l'identifiant : la couleur peut être renommée ou
        // retirée de la fiche, la commande doit dire ce qui a été acheté.
        color: variant.color?.name ?? null,
        size: variant.size,
        quantity: line.q,
        // Le prix payé est figé ici : le catalogue peut changer demain, la
        // commande d'aujourd'hui ne changera pas avec lui. Même calcul qu'au
        // tunnel, pour que la commande dise ce que Stripe a débité.
        unitPriceCents: variantPriceCents(variant, variant.product.priceCents),
      });

      // Décrément borné à zéro : deux paiements simultanés sur la dernière
      // pièce ne doivent pas produire un stock négatif.
      await tx
        .update(productVariants)
        .set({
          quantity: sql`greatest(0, ${productVariants.quantity} - ${line.q})`,
        })
        .where(
          and(
            eq(productVariants.id, variant.id),
            eq(productVariants.productId, variant.productId),
          ),
        );
    }

    // Une utilisation de plus, dans la même transaction que la commande : un
    // code compté sans commande, ou l'inverse, fausserait son plafond.
    if (promoCode && discountCents > 0) {
      await tx
        .update(promoCodes)
        .set({ uses: sql`${promoCodes.uses} + 1` })
        .where(eq(promoCodes.code, promoCode));
    }

    return order.id;
  });

  // Le stock a bougé : les pages du catalogue affichent des disponibilités.
  revalidateTag(CACHE_TAGS.catalog, "max");

  // Après la transaction, jamais dedans : un envoi d'e-mail ne doit ni
  // retarder ni pouvoir annuler l'enregistrement d'une commande payée.
  await sendOrderConfirmation(orderId);
}

/**
 * Compte à rattacher, d'après `client_reference_id` posé par `startCheckout`.
 *
 * Vérifié plutôt que cru : la valeur traverse Stripe, et un compte supprimé
 * entre le paiement et l'événement ferait échouer la clé étrangère — donc
 * l'enregistrement de la commande. Une commande payée sans compte reste une
 * commande ; elle sera retrouvée par l'e-mail.
 */
async function resolveCustomerId(reference: string | null): Promise<string | null> {
  const id = z.string().uuid().safeParse(reference);
  if (!id.success) return null;
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, id.data),
    columns: { id: true },
  });
  return customer?.id ?? null;
}

/**
 * Numéro lisible, celui que le client cite : DR-2026-0001.
 *
 * Il se déduit du compte de commandes de l'année. La transaction sérialise
 * les insertions, donc deux paiements simultanés ne peuvent pas obtenir le
 * même numéro — la contrainte d'unicité sur `reference` est là pour le dire
 * bruyamment si jamais cela arrivait.
 */
async function nextReference(tx: Transaction): Promise<string> {
  const year = new Date().getFullYear();
  const [row] = await tx
    .select({ total: sql<number>`count(*)::int` })
    .from(orders)
    .where(sql`${orders.reference} like ${`DR-${year}-%`}`);

  return `DR-${year}-${String(row.total + 1).padStart(4, "0")}`;
}
