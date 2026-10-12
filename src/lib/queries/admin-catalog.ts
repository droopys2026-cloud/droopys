import "server-only";

import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import {
  brands,
  categories,
  productImages,
  productPlacements,
  products,
  productVariants,
  subcategories,
} from "@/db/schema";

/**
 * Lecture du catalogue **côté administration**.
 *
 * Elle diffère de `@/lib/queries/catalog` sur un point qui justifie un module
 * séparé : ici les brouillons sont visibles. Un filtre `published` oublié
 * côté boutique publie un brouillon ; le même oubli ici cache au vendeur la
 * fiche qu'il vient d'enregistrer. Les deux lectures n'ont pas le même
 * contrat, elles ne partagent donc pas la même fonction.
 */

export type AdminProductRow = {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  brandSlug: string;
  categorySlug: string | null;
  priceCents: number;
  compareAtPriceCents: number | null;
  published: boolean;
  imageUrl: string | null;
  /** Somme des quantités de toutes les tailles. */
  stock: number;
  updatedAt: Date;
};

export type AdminProductFilters = {
  q?: string;
  brand?: string;
  category?: string;
  /** « publie » | « brouillon » — absent : les deux. */
  etat?: string;
};

export const listAdminProducts = cache(
  async (filters: AdminProductFilters = {}): Promise<AdminProductRow[]> => {
    const conditions: SQL[] = [];

    if (filters.brand) conditions.push(eq(brands.slug, filters.brand));
    if (filters.category) conditions.push(eq(categories.slug, filters.category));
    if (filters.etat === "publie") conditions.push(eq(products.published, true));
    if (filters.etat === "brouillon") {
      conditions.push(eq(products.published, false));
    }

    const q = filters.q?.trim();
    if (q) {
      // `ilike` suffit ici : l'admin cherche une référence ou un nom qu'il a
      // saisi lui-même, pas un mot approché comme le visiteur de la boutique.
      const pattern = `%${q}%`;
      const search = or(
        ilike(products.name, pattern),
        ilike(brands.name, pattern),
        ilike(products.reference, pattern),
      );
      if (search) conditions.push(search);
    }

    const rows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        brandName: brands.name,
        brandSlug: brands.slug,
        categorySlug: categories.slug,
        priceCents: products.priceCents,
        compareAtPriceCents: products.compareAtPriceCents,
        published: products.published,
        updatedAt: products.updatedAt,
        // Sous-requêtes plutôt que jointures : joindre images et tailles
        // multiplierait les lignes, et il faudrait les regrouper ensuite.
        //
        // Tables et colonnes écrites en toutes lettres : dans un fragment
        // `sql` de projection, Drizzle rend les colonnes sans préfixe, et la
        // corrélation se referme sur la mauvaise table (voir le même
        // commentaire dans `@/lib/queries/orders`).
        imageUrl: sql<string | null>`(
          select i.url from product_images i
          where i.product_id = "products"."id"
          order by i.position asc limit 1
        )`,
        stock: sql<number>`(
          select coalesce(sum(v.quantity), 0)::int
          from product_variants v
          where v.product_id = "products"."id"
        )`,
      })
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      // Les derniers ajoutés en tête, à place fixe : trier sur la date de
      // modification faisait remonter tout article simplement corrigé — et une
      // mise à jour en masse enterrait les nouveautés sous le catalogue entier.
      .orderBy(desc(products.createdAt), desc(products.id));

    return rows;
  },
);

/** Fiche complète pour le formulaire d'édition, brouillon compris. */
export const getAdminProduct = cache(async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      brand: true,
      category: true,
      images: { orderBy: [asc(productImages.position)] },
      variants: { orderBy: [asc(productVariants.position)] },
    },
  });
});

export type AdminProduct = NonNullable<
  Awaited<ReturnType<typeof getAdminProduct>>
>;

/** Compteurs du tableau de bord. */
export const countProducts = cache(async () => {
  const [row] = await db
    .select({
      total: sql<number>`count(*)::int`,
      published: sql<number>`count(*) filter (where ${products.published})::int`,
    })
    .from(products);
  return row;
});

/**
 * Marques et rayons pour les listes déroulantes de l'admin.
 *
 * Volontairement distincts de `listBrands` / `listCategories` de
 * `@/lib/queries/catalog` : ceux-là sont mémorisés **entre les rendus** pour
 * la boutique, ce que l'administration ne veut pas — elle doit voir une
 * marque créée à l'instant, sans attendre l'invalidation d'une étiquette.
 */
export const listBrandOptions = cache(async () =>
  db
    .select({ id: brands.slug, label: brands.name })
    .from(brands)
    .orderBy(asc(brands.position)),
);

export const listCategoryOptions = cache(async () =>
  db
    .select({ id: categories.slug, label: categories.title })
    .from(categories)
    .orderBy(asc(categories.position)),
);

/**
 * Sous-rayons pour la fiche produit, tous rayons confondus.
 *
 * Le rayon parent voyage avec chaque ligne : le formulaire n'affiche que les
 * sous-rayons du rayon choisi, et ce filtrage se fait dans le navigateur sans
 * second aller-retour.
 */
export const listSubcategoryOptions = cache(async () =>
  db
    .select({
      id: subcategories.id,
      label: subcategories.title,
      categorySlug: categories.slug,
    })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id))
    .orderBy(asc(categories.position), asc(subcategories.position)),
);

/**
 * Tous les articles, pour composer une sélection à la main.
 *
 * La liste est rendue entière et filtrée dans le navigateur : à l'échelle
 * d'une boutique de quelques centaines de pièces, c'est plus rapide qu'un
 * aller-retour par frappe. Au-delà, il faudra une vraie recherche côté
 * serveur — et ce commentaire sera le signe qu'on y est.
 */
export const listPlacementCandidates = cache(async () =>
  db
    .select({
      id: products.id,
      name: products.name,
      brand: brands.name,
      published: products.published,
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .orderBy(asc(brands.name), asc(products.name)),
);

/** Sous-rayons où un article apparaît en plus du sien (« Aussi visible dans »). */
export const listProductPlacementIds = cache(async (productId: string) =>
  (
    await db
      .select({ subcategoryId: productPlacements.subcategoryId })
      .from(productPlacements)
      .where(eq(productPlacements.productId, productId))
  ).map((row) => row.subcategoryId),
);

/** Articles déjà placés dans un sous-rayon. */
export const listPlacements = cache(async (subcategoryId: string) =>
  db
    .select({ productId: productPlacements.productId })
    .from(productPlacements)
    .where(eq(productPlacements.subcategoryId, subcategoryId))
    .orderBy(asc(productPlacements.position)),
);
