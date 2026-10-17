/**
 * Ce que la cliente a payé : articles − remise + port, en centimes.
 *
 * Un seul calcul pour toute la boutique — remboursement, admin, espace
 * client, e-mail. Recopié à chaque endroit, il oubliait la remise du code
 * promo quelque part, et le remboursement maximum dépassait le payé.
 */
export function orderItemsCents(lines: { unitPriceCents: number; quantity: number }[]): number {
  return lines.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);
}

export function orderTotalCents(order: {
  lines: { unitPriceCents: number; quantity: number }[];
  shippingCents: number;
  discountCents: number;
}): number {
  return orderItemsCents(order.lines) - order.discountCents + order.shippingCents;
}
