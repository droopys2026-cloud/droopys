/**
 * Totaux d'une période à partir des mouvements de solde Stripe.
 *
 * Module pur : il reçoit les mouvements, il ne les va pas chercher. On classe
 * par `reporting_category` et non par `type` — c'est le champ que Stripe
 * destine à la comptabilité, stable quand les types se multiplient.
 * Montants en centimes, signés comme Stripe les rend : un remboursement est
 * négatif, des frais aussi.
 */
export type BalanceMovement = {
  amount: number;
  fee: number;
  net: number;
  currency: string;
  reporting_category: string;
};

export type PeriodSummary = {
  /** Paiements encaissés, avant frais. */
  grossCents: number;
  /** Frais Stripe sur ces paiements (positif). */
  feesCents: number;
  /** Remboursements (positif). */
  refundedCents: number;
  /** Ce qui reste réellement : encaissé − frais − remboursé. */
  netCents: number;
  paymentCount: number;
};

export function summarizeMovements(
  movements: BalanceMovement[],
  currency = "eur",
): PeriodSummary {
  const summary: PeriodSummary = {
    grossCents: 0,
    feesCents: 0,
    refundedCents: 0,
    netCents: 0,
    paymentCount: 0,
  };

  for (const movement of movements) {
    if (movement.currency !== currency) continue;
    if (movement.reporting_category === "charge") {
      summary.grossCents += movement.amount;
      summary.feesCents += movement.fee;
      summary.netCents += movement.net;
      summary.paymentCount += 1;
    } else if (movement.reporting_category === "refund") {
      summary.refundedCents += -movement.amount;
      summary.netCents += movement.net;
    }
    // Virements, ajustements, frais divers : hors de ce résumé des ventes.
  }

  return summary;
}
