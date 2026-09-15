import type { CartLine } from "@/types/cart";

/**
 * Seuil de livraison offerte, en centimes. La valeur reprend celle annoncée
 * par la barre d'annonce (150 €) : les deux doivent rester d'accord, sinon le
 * client lit une promesse que le panier contredit.
 */
export const FREE_SHIPPING_THRESHOLD_CENTS = 15_000;

/** Nombre d'articles, quantités comprises — c'est ce que compte la pastille. */
export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Sous-total en centimes : jamais de flottant, on additionne des entiers. */
export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce(
    (total, line) => total + line.product.priceCents * line.quantity,
    0,
  );
}

/** Ce qu'il reste à ajouter pour la livraison offerte, 0 si le seuil est franchi. */
export function amountToFreeShippingCents(lines: CartLine[]): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - cartSubtotalCents(lines));
}
