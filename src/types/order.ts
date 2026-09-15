/**
 * Commande passée sur la boutique.
 *
 * Les montants sont en centimes — jamais de flottant sur la monnaie — et
 * chaque ligne fige le prix payé : si le prix du produit change demain, la
 * commande d'hier ne doit pas changer avec lui.
 */
export type OrderStatus =
  "a-preparer" | "expediee" | "livree" | "retour" | "annulee";

export type OrderLine = {
  productName: string;
  brand?: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
};

export type Order = {
  id: string;
  /** Numéro lisible, celui que le client cite : DR-2026-0001. */
  reference: string;
  placedAt: string;
  status: OrderStatus;

  customerName: string;
  customerEmail: string;
  shippingAddress: string[];

  lines: OrderLine[];
  shippingCents: number;
  /** Moyen de paiement tel qu'annoncé au client. */
  payment: string;

  /** Numéro de suivi Colissimo, saisi à la main tant que rien n'est branché. */
  trackingNumber?: string;
};

export const ORDER_STATUSES: { id: OrderStatus; label: string }[] = [
  { id: "a-preparer", label: "À préparer" },
  { id: "expediee", label: "Expédiée" },
  { id: "livree", label: "Livrée" },
  { id: "retour", label: "Retour" },
  { id: "annulee", label: "Annulée" },
];

export function orderTotalCents(order: Order): number {
  const items = order.lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );
  return items + order.shippingCents;
}

export function statusLabel(status: OrderStatus): string {
  return ORDER_STATUSES.find((entry) => entry.id === status)?.label ?? status;
}
