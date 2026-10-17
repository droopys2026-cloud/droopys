"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { sendRefundNotice } from "@/lib/email/send-refund-notice";
import { publicEnv } from "@/lib/env";
import { orderTotalCents } from "@/lib/orders/total";
import { stripe } from "@/lib/stripe";

/**
 * Remboursement d'une commande depuis sa fiche, dans l'admin.
 *
 * Le remboursement part chez Stripe, qui rend l'argent sur le moyen de
 * paiement d'origine (carte, Klarna…). Il peut être partiel — un seul article
 * retourné — et se répéter, sans jamais dépasser ce qui a été payé : le cumul
 * est tenu dans `orders.refunded_cents`.
 *
 * Le stock n'est pas remis automatiquement : un article retourné abîmé ne se
 * revend pas. La boutique le remet à la main dans la fiche produit.
 */
export type RefundState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "done"; amountCents: number; full: boolean };

/** « 89,90 » → 8990. Vide ou invalide → `null`. */
function parseEuros(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

export async function refundOrder(_state: RefundState, formData: FormData): Promise<RefundState> {
  await requireAdmin();

  const input = z
    .object({ orderId: z.string().uuid(), amount: z.string().max(20) })
    .safeParse({ orderId: formData.get("orderId"), amount: formData.get("amount") ?? "" });
  if (!input.success) return { status: "error", message: "Demande invalide." };

  const amountCents = parseEuros(input.data.amount);
  if (amountCents === null || amountCents <= 0) {
    return { status: "error", message: "Montant invalide — attendu : 89,90 par exemple." };
  }

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, input.data.orderId),
    with: { lines: true },
  });
  if (!order) return { status: "error", message: "Commande introuvable." };
  if (!order.stripeSessionId) {
    return {
      status: "error",
      message: "Cette commande n'a pas été payée en ligne : le remboursement se fait hors du site.",
    };
  }

  // Remise du code promo comprise : on ne rembourse jamais plus que payé.
  const paidCents = orderTotalCents(order);
  const remainingCents = paidCents - order.refundedCents;
  if (remainingCents <= 0) return { status: "error", message: "Cette commande est déjà entièrement remboursée." };
  if (amountCents > remainingCents) {
    return {
      status: "error",
      message: `On ne peut pas rembourser plus que le reste payé (${(remainingCents / 100).toFixed(2).replace(".", ",")} €).`,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
  const paymentIntent =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!paymentIntent) return { status: "error", message: "Paiement introuvable chez Stripe pour cette commande." };

  try {
    await stripe.refunds.create(
      { payment_intent: paymentIntent, amount: amountCents, metadata: { commande: order.reference } },
      // Un double clic ou un rechargement ne rembourse pas deux fois : la clé
      // dépend du cumul déjà remboursé, qui change après chaque remboursement.
      { idempotencyKey: `remboursement/${order.id}/${order.refundedCents}/${amountCents}` },
    );
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error(`Remboursement de ${order.reference} refusé par Stripe :`, error.code ?? error.message);
      return { status: "error", message: `Stripe a refusé le remboursement : ${error.message}` };
    }
    throw error;
  }

  const full = order.refundedCents + amountCents >= paidCents;
  // Cumul calculé par la base, et non relu puis réécrit : deux
  // remboursements simultanés ne s'écrasent pas.
  const refunded = { refundedCents: sql`${orders.refundedCents} + ${amountCents}`, refundedAt: new Date() };
  await db
    .update(orders)
    .set(full ? { ...refunded, status: "remboursee" } : refunded)
    .where(eq(orders.id, order.id));

  await sendRefundNotice(order.customerEmail, {
    reference: order.reference,
    customerName: order.customerName,
    amountCents,
    full,
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
  });

  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${order.id}`);
  return { status: "done", amountCents, full };
}
