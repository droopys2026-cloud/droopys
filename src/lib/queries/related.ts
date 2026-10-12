import "server-only";

import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { categories, productPlacements, products, subcategories } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import { listProducts } from "@/lib/queries/catalog";
import type { Product } from "@/types/product";

/** Un carrousel : au-delà, personne ne fait défiler. */
const RELATED_SIZE = 8;

/**
 * Rayons qui disent **ce qu'est** l'article, et non à qui il s'adresse : deux
 * articles qui partagent « Chaussures › Baskets » sont bien plus voisins que
 * deux articles qui partagent « Garçon › 6-12 ans ».
 */
const TYPE_CATEGORIES = new Set(["chaussures", "manteaux", "accessoires"]);
const TYPE_WEIGHT = 3;

/**
 * Pour chaque article publié, tous les sous-rayons où il apparaît : le sien
 * et ceux où il est placé. Une lecture pour tout le catalogue, mise en cache
 * avec lui.
 */
const listNiches = unstable_cache(
  async (): Promise<[string, string[]][]> => {
    const [own, placed] = await Promise.all([
      db
        .select({ productId: products.id, category: categories.slug, sub: subcategories.slug })
        .from(products)
        .innerJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .innerJoin(categories, eq(subcategories.categoryId, categories.id))
        .where(eq(products.published, true)),
      db
        .select({ productId: productPlacements.productId, category: categories.slug, sub: subcategories.slug })
        .from(productPlacements)
        .innerJoin(subcategories, eq(productPlacements.subcategoryId, subcategories.id))
        .innerJoin(categories, eq(subcategories.categoryId, categories.id)),
    ]);
    const byProduct = new Map<string, Set<string>>();
    for (const row of [...own, ...placed]) {
      const set = byProduct.get(row.productId) ?? new Set<string>();
      set.add(`${row.category}/${row.sub}`);
      byProduct.set(row.productId, set);
    }
    // Paires plutôt que `Map` : le cache de données sérialise en JSON.
    return [...byProduct].map(([id, keys]) => [id, [...keys]]);
  },
  ["niches-produits"],
  { tags: [CACHE_TAGS.catalog] },
);

/**
 * « Vous aimerez aussi », sous une fiche produit : des articles de la même
 * niche, choisis automatiquement.
 *
 * Chaque sous-rayon partagé avec l'article affiché rapporte un point, trois
 * s'il dit le type d'article (chaussures, manteaux, accessoires) ; la même
 * marque en rapporte un de plus. Les mieux notés passent devant, à égalité le
 * plus récent ; s'il en manque, les dernières nouveautés complètent.
 * L'article affiché n'y figure jamais.
 */
export const getRelatedProducts = cache(async (product: Product): Promise<Product[]> => {
  const [all, niches] = await Promise.all([listProducts(), listNiches()]);
  const nicheOf = new Map(niches.map(([id, keys]) => [id, new Set(keys)]));
  const mine = nicheOf.get(product.id) ?? new Set<string>();

  const score = (candidate: Product): number => {
    let total = candidate.brand === product.brand ? 1 : 0;
    for (const key of nicheOf.get(candidate.id) ?? []) {
      if (mine.has(key)) total += TYPE_CATEGORIES.has(key.split("/")[0]) ? TYPE_WEIGHT : 1;
    }
    return total;
  };

  const others = all.filter((candidate) => candidate.id !== product.id);
  // Tri stable : à score égal, l'ordre « plus récent d'abord » de la liste reste.
  const ranked = others
    .map((candidate) => ({ candidate, points: score(candidate) }))
    .sort((a, b) => b.points - a.points)
    .map((entry) => entry.candidate);
  return ranked.slice(0, RELATED_SIZE);
});
