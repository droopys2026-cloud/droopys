import "server-only";

import { asc } from "drizzle-orm";
import {
  brands,
  categories,
  productImages,
  products,
  productVariants,
  subcategories,
} from "@/db/schema";
import type { Product } from "@/types/product";

/**
 * Traduction d'une ligne de `products` vers `@/types/product`.
 *
 * Extrait de `queries/catalog` parce que plusieurs lectures en ont besoin —
 * le catalogue, les sous-rayons, les sélections — et qu'une seule traduction
 * garantit qu'une fiche a la même forme d'où qu'on la lise.
 */

/** Forme rendue par les requêtes relationnelles qui chargent `WITH_RELATIONS`. */
export type ProductRow = typeof products.$inferSelect & {
  brand: typeof brands.$inferSelect;
  category: typeof categories.$inferSelect | null;
  subcategory: typeof subcategories.$inferSelect | null;
  images: (typeof productImages.$inferSelect)[];
  variants: (typeof productVariants.$inferSelect)[];
};

/**
 * Chargées avec chaque produit. Sans `as const` : Drizzle attend des tableaux
 * modifiables pour `orderBy`, et un tableau figé ne s'y assigne pas.
 */
export const WITH_RELATIONS = {
  // `true as const` : sans lui l'inférence remonte à `boolean`, que Drizzle
  // refuse — il n'accepte que `true` ou une configuration détaillée.
  brand: true as const,
  category: true as const,
  subcategory: true as const,
  images: { orderBy: [asc(productImages.position)] },
  variants: { orderBy: [asc(productVariants.position)] },
};

export function toProduct(row: ProductRow): Product {
  const gallery = row.images.map((image) => image.url);

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand.name,
    name: row.name,
    priceCents: row.priceCents,
    compareAtPriceCents: row.compareAtPriceCents ?? undefined,
    // La carte n'affiche que deux vues ; la fiche les veut toutes. Les deux
    // premières images jouent donc double rôle plutôt que d'être saisies deux fois.
    imageUrl: gallery[0],
    hoverImageUrl: gallery[1],
    images: gallery.length > 0 ? gallery : undefined,
    sizes: row.variants.map((variant) => ({
      variantId: variant.id,
      size: variant.size,
      quantity: variant.quantity,
    })),
    description: row.description.length > 0 ? row.description : undefined,
    composition: row.composition ?? undefined,
    care: row.care ?? undefined,
    madeIn: row.madeIn ?? undefined,
    measurements: row.measurements.length > 0 ? row.measurements : undefined,
    reference: row.reference ?? undefined,
    categorySlug: row.category?.slug,
    subcategory: row.subcategory
      ? { slug: row.subcategory.slug, title: row.subcategory.title }
      : undefined,
    modelNote: row.modelNote ?? undefined,
    sizeAdvice: row.sizeAdvice ?? undefined,
    badge: row.badge ?? undefined,
  };
}
