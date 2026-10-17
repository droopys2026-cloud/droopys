import "server-only";

import { asc, eq, inArray } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { orderLines, orders, productImages, productVariants } from "@/db/schema";
import { renderOrderConfirmation } from "@/lib/email/order-confirmation";
import { publicEnv, serverEnv } from "@/lib/env";
import { SERVICES } from "@/lib/shipping/services";
import { SHOPS } from "@/lib/shops";

/**
 * Envoie la confirmation d'une commande à la cliente.
 *
 * Appelée par le webhook, après l'enregistrement. Elle ne lève jamais : un
 * e-mail raté ne doit pas faire répondre le webhook en erreur — Stripe
 * réessaierait, la commande existerait déjà, et rien de plus ne partirait.
 * L'échec est donc journalisé, avec la référence, pour un renvoi à la main.
 *
 * La clé d'idempotence porte la référence : un double appel n'envoie qu'un
 * e-mail.
 */
export async function sendOrderConfirmation(orderId: string): Promise<void> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { lines: { orderBy: [asc(orderLines.productName)] } },
  });
  if (!order) {
    console.error(`Confirmation non envoyée : commande ${orderId} introuvable.`);
    return;
  }

  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM) {
    // Bruyant exprès : une boutique qui vend sans écrire à ses clientes doit
    // le voir à chaque commande, pas le découvrir par une réclamation.
    console.warn(
      `Confirmation de ${order.reference} NON envoyée : RESEND_API_KEY ou EMAIL_FROM absente.`,
    );
    return;
  }

  // Une photo par ligne, en adresse absolue : l'e-mail est lu hors du site,
  // un chemin « /imgdress/… » n'y mène nulle part. Pour une pièce en
  // couleurs, c'est la photo de la couleur achetée qui compte.
  const productIds = order.lines
    .map((line) => line.productId)
    .filter((id): id is string => id !== null);
  const variantIds = order.lines
    .map((line) => line.variantId)
    .filter((id): id is string => id !== null);
  const [images, variants] = await Promise.all([
    productIds.length
      ? db.query.productImages.findMany({
          where: inArray(productImages.productId, productIds),
          orderBy: [asc(productImages.position)],
          columns: { productId: true, colorId: true, url: true },
        })
      : [],
    variantIds.length
      ? db.query.productVariants.findMany({
          where: inArray(productVariants.id, variantIds),
          columns: { id: true, colorId: true },
        })
      : [],
  ]);
  const colorByVariant = new Map(variants.map((variant) => [variant.id, variant.colorId]));

  function lineImage(line: { productId: string | null; variantId: string | null }) {
    if (!line.productId) return null;
    const own = images.filter((image) => image.productId === line.productId);
    const colorId = line.variantId ? colorByVariant.get(line.variantId) : null;
    const image =
      own.find((entry) => colorId && entry.colorId === colorId) ??
      own.find((entry) => entry.colorId === null) ??
      own[0];
    if (!image) return null;
    return image.url.startsWith("http") ? image.url : `${publicEnv.NEXT_PUBLIC_SITE_URL}${image.url}`;
  }

  const shop = SHOPS[0];
  const email = renderOrderConfirmation({
    reference: order.reference,
    customerName: order.customerName,
    deliveryMethod: order.deliveryMethod,
    serviceLabel: SERVICES.find((service) => service.key === order.shippingService)?.label ?? "",
    shippingAddress: order.shippingAddress,
    shippingCents: order.shippingCents,
    promoCode: order.promoCode,
    discountCents: order.discountCents,
    lines: order.lines.map((line) => ({
      ...line,
      imageUrl: lineImage(line),
    })),
    shop: { name: shop.name, address: shop.address },
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  });

  try {
    const resend = new Resend(serverEnv.RESEND_API_KEY);
    const { error } = await resend.emails.send(
      {
        from: serverEnv.EMAIL_FROM,
        to: [order.customerEmail],
        subject: email.subject,
        html: email.html,
        text: email.text,
      },
      { idempotencyKey: `confirmation-commande/${order.reference}` },
    );
    // Pas d'adresse dans le journal : la référence suffit à retrouver la cliente.
    if (error) console.error(`Confirmation de ${order.reference} refusée par Resend : ${error.message}`);
  } catch (error) {
    console.error(`Confirmation de ${order.reference} non envoyée :`, error);
  }
}
