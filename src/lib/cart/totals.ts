import type { PromoLine } from "@/lib/promo/discount";
import type { CartLine } from "@/types/cart";

/** Nombre d'articles, quantités comprises — c'est ce que compte la pastille. */
export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** Sous-total en centimes : jamais de flottant, on additionne des entiers. */
export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );
}

/**
 * Les lignes telles que le code promo les compte. « Soldé » suit la même règle
 * que l'affichage : un prix barré en vigueur, supérieur au prix payé.
 */
export function promoLines(lines: CartLine[]): PromoLine[] {
  return lines.map((line) => ({
    productId: line.product.id,
    unitPriceCents: line.unitPriceCents,
    quantity: line.quantity,
    onSale:
      line.product.compareAtPriceCents !== undefined &&
      line.product.compareAtPriceCents > line.unitPriceCents,
  }));
}
