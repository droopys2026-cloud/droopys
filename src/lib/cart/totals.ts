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
