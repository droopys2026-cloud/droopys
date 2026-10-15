"use client";

import { useProductVariant } from "@/components/product/product-variant-context";
import { formatPrice } from "@/lib/format";
import { displayPrice } from "@/lib/products/variants";

/**
 * Prix de la fiche : celui de la taille choisie, sinon « dès … » quand les
 * tailles de la couleur n'ont pas toutes le même prix.
 */
export function ProductVariantPrice({
  priceCents,
  compareAtPriceCents,
}: {
  priceCents: number;
  compareAtPriceCents?: number;
}) {
  const { sizes, chosen } = useProductVariant();
  const price = displayPrice(
    { priceCents, compareAtPriceCents },
    chosen ? [chosen] : sizes,
  );

  return (
    // `aria-live` : le prix change sans rechargement quand on choisit une
    // taille, un lecteur d'écran doit l'entendre.
    <p className="product-price m-0" aria-live="polite">
      {price.compareAtCents !== undefined && (
        <span className="product-price__was">{formatPrice(price.compareAtCents)}</span>
      )}
      {price.from && <span className="product-price__from">dès </span>}
      {formatPrice(price.cents)}
    </p>
  );
}
