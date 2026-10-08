import "server-only";

import { inArray } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { summarizeMovements, type PeriodSummary } from "@/lib/payments/summary";
import { CURRENCY, stripe } from "@/lib/stripe";

/**
 * Lectures Stripe pour la page « Paiements » de l'admin.
 *
 * Rien n'est recopié en base : Stripe est la source de vérité de l'argent, et
 * un double maison finirait par diverger du relevé. Chaque affichage relit
 * donc Stripe — quelques appels, pour une page consultée par une personne.
 */

export type Balance = { availableCents: number; pendingCents: number };

export async function getBalance(): Promise<Balance> {
  const balance = await stripe.balance.retrieve();
  const sum = (entries: { amount: number; currency: string }[]) =>
    entries
      .filter((entry) => entry.currency === CURRENCY)
      .reduce((total, entry) => total + entry.amount, 0);
  return { availableCents: sum(balance.available), pendingCents: sum(balance.pending) };
}

/**
 * Minuit le 1er du mois en cours, **à Paris**. Le serveur tourne en UTC : sans
 * ce calcul, le mois commencerait à 1 h ou 2 h du matin, heure de la boutique,
 * et les ventes de la première nuit tomberaient dans le mois précédent.
 */
function parisMonthStart(now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  // Décalage de Paris ce jour-là : « GMT+1 » l'hiver, « GMT+2 » l'été.
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "shortOffset",
  })
    .formatToParts(new Date(`${year}-${month}-01T12:00:00Z`))
    .find((part) => part.type === "timeZoneName")
    ?.value.replace("GMT", "");
  const hours = Number(offset || "0");
  const sign = hours < 0 ? "-" : "+";
  return new Date(
    `${year}-${month}-01T00:00:00${sign}${String(Math.abs(hours)).padStart(2, "0")}:00`,
  );
}

/** Totaux depuis le 1er du mois en cours, à l'heure de Paris. */
export async function getMonthSummary(): Promise<PeriodSummary> {
  const monthStart = parisMonthStart();
  const movements: Stripe.BalanceTransaction[] = [];
  // Borné à 1 000 mouvements : au-delà, c'est le relevé Stripe qu'il faut
  // ouvrir, pas une page d'admin qui ferait patienter.
  for await (const movement of stripe.balanceTransactions.list({
    created: { gte: Math.floor(monthStart.getTime() / 1000) },
    limit: 100,
  })) {
    movements.push(movement);
    if (movements.length >= 1000) break;
  }
  return summarizeMovements(movements);
}

export type PaymentRow = {
  sessionId: string;
  createdAt: Date;
  amountCents: number;
  refundedCents: number;
  email: string | null;
  method: string | null;
  status: "paye" | "rembourse" | "partiel" | "en-attente";
  orderReference: string | null;
};

/** Les derniers paiements aboutis du tunnel, reliés à leur commande. */
export async function listRecentPayments(limit = 20): Promise<PaymentRow[]> {
  const sessions = await stripe.checkout.sessions.list({
    status: "complete",
    limit,
    expand: ["data.payment_intent.latest_charge"],
  });

  const ids = sessions.data.map((session) => session.id);
  const linked = ids.length
    ? await db
        .select({ sessionId: orders.stripeSessionId, reference: orders.reference })
        .from(orders)
        .where(inArray(orders.stripeSessionId, ids))
    : [];
  const referenceBySession = new Map(linked.map((row) => [row.sessionId, row.reference]));

  return sessions.data.map((session) => {
    const intent = typeof session.payment_intent === "object" ? session.payment_intent : null;
    const charge =
      intent && typeof intent.latest_charge === "object" ? intent.latest_charge : null;
    const amount = session.amount_total ?? 0;
    const refunded = charge?.amount_refunded ?? 0;

    return {
      sessionId: session.id,
      createdAt: new Date(session.created * 1000),
      amountCents: amount,
      refundedCents: refunded,
      email: session.customer_details?.email ?? null,
      method: charge?.payment_method_details?.type ?? null,
      status:
        session.payment_status !== "paid"
          ? "en-attente"
          : refunded === 0
            ? "paye"
            : refunded >= amount
              ? "rembourse"
              : "partiel",
      orderReference: referenceBySession.get(session.id) ?? null,
    };
  });
}

export type PayoutRow = {
  id: string;
  amountCents: number;
  arrivalDate: Date;
  status: string;
};

/** Virements vers le compte bancaire, à venir et récents. */
export async function listPayouts(limit = 5): Promise<PayoutRow[]> {
  const payouts = await stripe.payouts.list({ limit });
  return payouts.data.map((payout) => ({
    id: payout.id,
    amountCents: payout.amount,
    arrivalDate: new Date(payout.arrival_date * 1000),
    status: payout.status,
  }));
}

/** Lien vers le tableau de bord Stripe, en mode test ou réel selon la clé. */
export function stripeDashboardUrl(path: string): string {
  const test = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
  return `https://dashboard.stripe.com${test ? "/test" : ""}${path}`;
}
