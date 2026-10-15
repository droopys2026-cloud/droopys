import "server-only";

import { inArray } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { productVariants } from "@/db/schema";
import { readCart } from "@/lib/cart/cookie";
import { variantPriceCents } from "@/lib/products/variants";
import type { CartLine } from "@/types/cart";

/**
 * Le panier tel qu'il s'affiche.
 *
 * Le cookie ne porte que des identifiants : prix, nom, photo et stock sont
 * relus ici, à chaque affichage. Une ligne dont la variante a disparu du
 * catalogue est **écartée en silence** — elle ne peut plus être vendue, et
 * afficher un article fantôme qu'on ne peut pas commander vaut moins que de
 * ne rien afficher.
 *
 * La quantité est plafonnée au stock réel : le panier ne promet jamais plus
 * que ce qui existe.
 */
export const getCart = cache(async (): Promise<CartLine[]> => {
  const wanted = await readCart();
  if (wanted.length === 0) return [];

  const rows = await db.query.productVariants.findMany({
    where: inArray(
      productVariants.id,
      wanted.map((line) => line.variantId),
    ),
    with: {
      color: true,
      product: {
        with: {
          brand: true,
          images: true,
          // Rayon et sous-rayon : ils donnent le poids estimé de la pièce,
          // donc le port (voir `@/lib/shipping/weight`).
          category: { columns: { slug: true } },
          subcategory: { columns: { slug: true, title: true } },
        },
      },
    },
  });

  const byId = new Map(rows.map((row) => [row.id, row]));

  return wanted.flatMap((line) => {
    const variant = byId.get(line.variantId);
    if (!variant || !variant.product.published) return [];

    const quantity = Math.min(line.quantity, variant.quantity);
    if (quantity <= 0) return [];

    // La vignette montre la couleur achetée : ses photos d'abord, puis les
    // communes, comme sur la fiche.
    const images = [...variant.product.images].sort((a, b) => a.position - b.position);
    const gallery = [
      ...images.filter((image) => variant.colorId !== null && image.colorId === variant.colorId),
      ...images.filter((image) => image.colorId === null),
    ].map((image) => image.url);
    const ownPrice = variant.priceCents !== null;

    return [
      {
        // L'identifiant de ligne est celui de la variante : le même produit
        // en deux tailles fait deux variantes, donc deux lignes distinctes.
        id: variant.id,
        color: variant.color?.name,
        size: variant.size,
        unitPriceCents: variantPriceCents(variant, variant.product.priceCents),
        quantity,
        stock: variant.quantity,
        product: {
          id: variant.product.id,
          slug: variant.product.slug,
          brand: variant.product.brand.name,
          name: variant.product.name,
          priceCents: variant.product.priceCents,
          // Le prix barré vaut contre le prix du produit : sur une taille au
          // prix propre, il mentirait.
          compareAtPriceCents: ownPrice
            ? undefined
            : (variant.product.compareAtPriceCents ?? undefined),
          imageUrl: gallery[0],
          hoverImageUrl: gallery[1],
          categorySlug: variant.product.category?.slug,
          subcategory: variant.product.subcategory ?? undefined,
        },
      },
    ];
  });
});

/**
 * Le panier vu du serveur au moment de payer : la variante, son stock et le
 * prix du catalogue. C'est cette lecture, et elle seule, qui fait foi pour le
 * montant débité.
 */
export async function getCartForCheckout() {
  const wanted = await readCart();
  if (wanted.length === 0) return [];

  const rows = await db.query.productVariants.findMany({
    where: inArray(
      productVariants.id,
      wanted.map((line) => line.variantId),
    ),
    with: {
      color: true,
      product: {
        with: {
          brand: true,
          images: true,
          category: { columns: { slug: true } },
          subcategory: { columns: { slug: true } },
        },
      },
    },
  });

  const byId = new Map(rows.map((row) => [row.id, row]));

  return wanted.flatMap((line) => {
    const variant = byId.get(line.variantId);
    if (!variant || !variant.product.published) return [];
    const quantity = Math.min(line.quantity, variant.quantity);
    if (quantity <= 0) return [];
    return [
      {
        variant,
        quantity,
        unitPriceCents: variantPriceCents(variant, variant.product.priceCents),
      },
    ];
  });
}
