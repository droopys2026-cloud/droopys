import "server-only";

import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import {
  categories,
  productPlacements,
  products,
  subcategories,
} from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import { WITH_RELATIONS, toProduct } from "@/lib/queries/product-row";

/**
 * Lecture des sous-rayons : /fille/robes.
 *
 * Même double cache que `queries/catalog` — voir l'explication qui y figure —
 * et même règle : une fonction mémorisée n'en appelle pas une autre.
 */
function taxonomyQuery<A extends unknown[], R>(
  key: string,
  query: (...args: A) => Promise<R>,
) {
  return cache(unstable_cache(query, [key], { tags: [CACHE_TAGS.catalog] }));
}

/** Sous-rayons d'un rayon, dans l'ordre d'affichage. */
export const listSubcategories = taxonomyQuery(
  "sous-rayons",
  async (categorySlug: string) =>
    db
      .select({
        id: subcategories.id,
        slug: subcategories.slug,
        title: subcategories.title,
        intro: subcategories.intro,
        imageUrl: subcategories.imageUrl,
        imageClassName: subcategories.imageClassName,
        position: subcategories.position,
      })
      .from(subcategories)
      .innerJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug))
      .orderBy(asc(subcategories.position)),
);

/**
 * Un sous-rayon par le couple rayon / sous-rayon de l'URL.
 *
 * Les deux segments sont vérifiés ensemble : /garcon/robes ne doit pas rendre
 * la page de /fille/robes sous prétexte que le second segment existe ailleurs.
 */
export const getSubcategory = taxonomyQuery(
  "sous-rayon",
  async (categorySlug: string, slug: string) => {
    const [row] = await db
      .select({
        id: subcategories.id,
        slug: subcategories.slug,
        title: subcategories.title,
        intro: subcategories.intro,
        imageUrl: subcategories.imageUrl,
        imageClassName: subcategories.imageClassName,
        categorySlug: categories.slug,
        categoryTitle: categories.title,
      })
      .from(subcategories)
      .innerJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(and(eq(categories.slug, categorySlug), eq(subcategories.slug, slug)))
      .limit(1);

    return row;
  },
);

/**
 * Produits d'un sous-rayon : ceux qui y sont classés, plus ceux qu'on y a
 * placés à la main.
 *
 * Les deux origines se valent à l'affichage. Un article rangé en garçon et
 * mis en avant sous /manteaux/doudounes doit apparaître aux deux endroits
 * sans qu'un visiteur puisse deviner lequel est « le vrai ».
 */
export const listProductsForSubcategory = taxonomyQuery(
  "produits-sous-rayon",
  async (subcategoryId: string) => {
    const rows = await db.query.products.findMany({
      where: and(
        eq(products.published, true),
        or(
          eq(products.subcategoryId, subcategoryId),
          inArray(
            products.id,
            db
              .select({ id: productPlacements.productId })
              .from(productPlacements)
              .where(eq(productPlacements.subcategoryId, subcategoryId)),
          ),
        ),
      ),
      with: WITH_RELATIONS,
      orderBy: [desc(products.createdAt)],
    });
    return rows.map(toProduct);
  },
);

/**
 * Produits d'un rayon transverse — manteaux, chaussures, accessoires.
 *
 * Ces rayons n'ont pas de pièces en propre : leur page est la réunion de
 * leurs sous-rayons. Sans cette remontée, placer une doudoune sous
 * /manteaux/doudounes laisserait /manteaux vide, ce qu'aucun visiteur ne
 * comprendrait.
 */
export const listPlacedProductsForCategory = taxonomyQuery(
  "produits-places-rayon",
  async (categorySlug: string) => {
    const owned = db
      .select({ id: subcategories.id })
      .from(subcategories)
      .innerJoin(categories, eq(subcategories.categoryId, categories.id))
      .where(eq(categories.slug, categorySlug));

    const rows = await db.query.products.findMany({
      where: and(
        eq(products.published, true),
        or(
          inArray(products.subcategoryId, owned),
          inArray(
            products.id,
            db
              .select({ id: productPlacements.productId })
              .from(productPlacements)
              .where(inArray(productPlacements.subcategoryId, owned)),
          ),
        ),
      ),
      with: WITH_RELATIONS,
      orderBy: [desc(products.createdAt)],
    });
    return rows.map(toProduct);
  },
);

/** Couples rayon / sous-rayon, pour `generateStaticParams`. */
export const listSubcategoryPaths = taxonomyQuery("chemins-sous-rayons", async () =>
  db
    .select({ categorie: categories.slug, sous: subcategories.slug })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id)),
);
