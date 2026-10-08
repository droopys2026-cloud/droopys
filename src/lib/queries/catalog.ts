import "server-only";

import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache";
import { brands, categories, products } from "@/db/schema";
import { WITH_RELATIONS, toProduct } from "@/lib/queries/product-row";
import { listPlacedProductsForCategory } from "@/lib/queries/taxonomy";

/**
 * Lecture du catalogue.
 *
 * Tout sort d'ici sous la forme de `@/types/product`, celle que les
 * composants connaissent déjà : c'est ce qui permet de remplacer les données
 * de démonstration par la base sans toucher à une seule carte produit.
 *
 * Deux caches se superposent. `cache` de React couvre un rendu : deux
 * composants d'une même page qui demandent le même produit ne provoquent
 * qu'une requête. `unstable_cache` couvre les rendus entre eux : sans lui, la
 * génération des pages statiques rejouerait les mêmes requêtes 82 fois et
 * saturerait le pooler. L'étiquette `catalogue` est invalidée par les actions
 * d'écriture — voir `@/lib/cache`.
 *
 * **Une fonction ainsi mémorisée ne doit pas en appeler une autre** : deux
 * `unstable_cache` imbriqués se bloquent l'un l'autre, et le rendu ne rend
 * jamais la main. Les fonctions qui en composent d'autres restent donc en
 * `cache` de React seul — le cache entre rendus est déjà assuré par la
 * lecture qu'elles appellent.
 */
function catalogQuery<A extends unknown[], R>(
  key: string,
  query: (...args: A) => Promise<R>,
) {
  return cache(unstable_cache(query, [key], { tags: [CACHE_TAGS.catalog] }));
}

/**
 * Produits publiés, du plus récent au plus ancien.
 *
 * `published` est filtré ici et non chez l'appelant : une fiche en brouillon
 * qui apparaît en boutique parce qu'une page a oublié le filtre est une faute
 * qu'on ne doit pas pouvoir commettre.
 */
export const listProducts = catalogQuery(
  "produits",
  async (options: { categorySlug?: string; limit?: number } = {}) => {
    const category = options.categorySlug
      ? await getCategoryId(options.categorySlug)
      : undefined;

    // Rayon demandé mais inconnu : rendre la liste complète serait pire que
    // rien — la page afficherait un catalogue entier sous le titre d'un rayon.
    if (options.categorySlug && !category) return [];

    const rows = await db.query.products.findMany({
      where: category
        ? and(eq(products.published, true), eq(products.categoryId, category))
        : eq(products.published, true),
      with: WITH_RELATIONS,
      orderBy: [desc(products.createdAt)],
      limit: options.limit,
    });

    return rows.map(toProduct);
  },
);

export const getProductBySlug = catalogQuery("produit", async (slug: string) => {
  const row = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.published, true)),
    with: WITH_RELATIONS,
  });
  return row ? toProduct(row) : undefined;
});

/** Produits d'une marque, pour la page /marques/[slug]. */
export const listProductsOfBrand = catalogQuery("produits-marque", async (brandSlug: string) => {
  const rows = await db.query.products.findMany({
    where: and(
      eq(products.published, true),
      inArray(
        products.brandId,
        db.select({ id: brands.id }).from(brands).where(eq(brands.slug, brandSlug)),
      ),
    ),
    with: WITH_RELATIONS,
    orderBy: [desc(products.createdAt)],
  });
  return rows.map(toProduct);
});

/**
 * Recherche par nom ou marque, insensible à la casse et aux accents.
 *
 * `unaccent` n'est pas installé : on passe par `translate`, qui remplace les
 * lettres accentuées une à une. C'est moins élégant qu'une extension, mais ça
 * ne demande aucun droit particulier sur la base et suffit au français.
 */
export const searchProducts = catalogQuery("recherche", async (query: string) => {
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const folded = (value: ReturnType<typeof sql>) =>
    sql`translate(lower(${value}), 'àâäáãåçéèêëíìîïñóòôöõúùûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy')`;

  const haystack = folded(sql`${products.name} || ' ' || ${brands.name}`);

  const rows = await db
    .select({ id: products.id })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(
      and(
        eq(products.published, true),
        // Tous les mots, et non au moins un : « pull laine » doit resserrer
        // la liste, pas l'élargir.
        ...words.map(
          (word) => sql`${haystack} like '%' || ${folded(sql`${word}`)} || '%'`,
        ),
      ),
    );

  if (rows.length === 0) return [];

  const found = await db.query.products.findMany({
    where: inArray(
      products.id,
      rows.map((row) => row.id),
    ),
    with: WITH_RELATIONS,
    orderBy: [desc(products.createdAt)],
  });
  return found.map(toProduct);
});

// Appelée depuis `listProducts`, elle-même mémorisée : elle reste en cache de
// rendu uniquement, sous peine d'imbrication.
const getCategoryId = cache(async (slug: string) => {
  const row = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    columns: { id: true },
  });
  return row?.id;
});

export const listBrands = catalogQuery("marques", async () =>
  db.query.brands.findMany({ orderBy: [asc(brands.position)] }),
);

/**
 * Nombre d'articles publiés par marque, pour la page « Nos marques ».
 * Rendu en paires plutôt qu'en `Map` : le cache de données sérialise en JSON,
 * et une `Map` en ressortirait vide.
 */
export const countProductsByBrand = catalogQuery("articles-par-marque", async () =>
  db
    .select({ brandId: products.brandId, total: count() })
    .from(products)
    .where(eq(products.published, true))
    .groupBy(products.brandId),
);

export const listCategories = catalogQuery("rayons", async () =>
  db.query.categories.findMany({ orderBy: [asc(categories.position)] }),
);

/**
 * Un rayon par son slug d'URL. Lu dans la liste déjà en cache plutôt que par
 * une requête de plus : il y a une dizaine de rayons, pas de quoi indexer.
 */
// Compose une lecture déjà mémorisée entre les rendus : cache de rendu seul.
export const getCategoryBySlug = cache(async (slug: string) =>
  (await listCategories()).find((category) => category.slug === slug),
);

/**
 * Produits d'une page de rayon.
 *
 * Un rayon se remplit de trois façons, et la page ne doit pas avoir à savoir
 * laquelle s'applique :
 *
 * - par règle — « Nouveautés » est le catalogue trié par date, « Outlet » les
 *   seules pièces démarquées ;
 * - par classement — les pièces saisies dans ce rayon (bébé, fille, garçon) ;
 * - par placement — les pièces mises en avant dans l'un de ses sous-rayons,
 *   ce qui est la seule façon de remplir manteaux, chaussures, accessoires,
 *   qui n'ont pas d'articles en propre.
 *
 * Réunir les deux dernières ici évite que chaque page invente sa propre règle
 * et qu'elles finissent par se contredire.
 */
// Compose des lectures déjà mémorisées entre les rendus : cache de rendu seul.
export const listProductsForCategory = cache(async (slug: string) => {
  if (slug === "nouveautes") return listProducts({ limit: 48 });

  if (slug === "outlet") {
    const rows = await db.query.products.findMany({
      where: and(
        eq(products.published, true),
        sql`${products.compareAtPriceCents} > ${products.priceCents}`,
      ),
      with: WITH_RELATIONS,
      orderBy: [desc(products.createdAt)],
    });
    return rows.map(toProduct);
  }

  const [owned, placed] = await Promise.all([
    listProducts({ categorySlug: slug }),
    listPlacedProductsForCategory(slug),
  ]);

  // Une pièce classée dans le rayon ET placée dans l'un de ses sous-rayons ne
  // doit apparaître qu'une fois : l'identifiant tranche, pas l'origine.
  const seen = new Set(owned.map((product) => product.id));
  return [...owned, ...placed.filter((product) => !seen.has(product.id))];
});

/** Slugs publiés, pour `generateStaticParams`. */
export const listProductSlugs = catalogQuery("slugs-produits", async () => {
  const rows = await db.query.products.findMany({
    where: eq(products.published, true),
    columns: { slug: true },
  });
  return rows.map((row) => row.slug);
});

/** Une marque par son slug d'URL. `undefined` si elle n'existe pas. */
export const getBrandBySlug = catalogQuery("marque", async (slug: string) =>
  db.query.brands.findFirst({ where: eq(brands.slug, slug) }),
);

/**
 * Produits publiés parmi `ids`, **dans l'ordre de `ids`** — celui des favoris,
 * le plus récent d'abord. Non mis en cache : la liste est propre à chaque
 * visiteur. Un produit dépublié depuis disparaît simplement de la liste.
 */
export async function listProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await db.query.products.findMany({
    where: and(inArray(products.id, ids), eq(products.published, true)),
    with: WITH_RELATIONS,
  });
  const byId = new Map(rows.map((row) => [row.id, toProduct(row)]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}
