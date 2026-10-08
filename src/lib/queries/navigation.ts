import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import {
  brands,
  categories,
  productImages,
  productPlacements,
  products,
  subcategories,
} from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import type { NavFeature, NavItem } from "@/types/navigation";

/** Nombre d'articles mis en avant dans chaque panneau. */
const FEATURED_COUNT = 2;

/** Liens par colonne : au-delà, une nouvelle colonne s'ouvre. */
const LINKS_PER_COLUMN = 3;

/**
 * Articles récents lus d'un coup, parmi lesquels chaque rubrique pioche ses
 * deux mises en avant. Large exprès : un rayon peu fourni doit encore y
 * trouver ses deux derniers articles.
 */
const CANDIDATE_COUNT = 200;

/** Les photos du menu changent d'article toutes les heures. */
const ROTATION_MS = 60 * 60 * 1000;

/** La liste commencée au rang `seed` (modulo sa longueur), puis bouclée. */
function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) return items;
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

/**
 * Le menu principal, construit **automatiquement** à partir des rayons.
 *
 * Rien ne se règle à la main : chaque rayon devient une rubrique de la barre,
 * dans l'ordre des rayons ; ses sous-rayons deviennent les liens de son
 * panneau ; les deux derniers articles du rayon s'affichent à droite. Une
 * rubrique « Marques » liste les maisons, juste avant l'Outlet. Ajouter un
 * sous-rayon dans Admin → Rayons l'ajoute donc au menu, sans autre geste.
 *
 * Demandé par l'en-tête de **toutes** les pages : sans le cache entre rendus,
 * générer le site rejouerait ces requêtes une fois par page. L'étiquette est
 * celle du catalogue, que les écritures sur les rayons invalident.
 */
export const getMainNav = cache(
  unstable_cache(
    async (): Promise<NavItem[]> => {
      // Quatre requêtes en tout, quel que soit le nombre de rayons : le build
      // rend toutes les pages en parallèle, et une requête par rubrique
      // saturait le pool au point de faire échouer la génération.
      const [categoryRows, brandRows, latest, placements] = await Promise.all([
        db.query.categories.findMany({
          orderBy: [asc(categories.position)],
          columns: { id: true, slug: true, title: true, headline: true },
          with: {
            subcategories: {
              orderBy: [asc(subcategories.position)],
              columns: { id: true, slug: true, title: true },
            },
          },
        }),
        db.query.brands.findMany({ orderBy: [asc(brands.position)], columns: { slug: true, name: true } }),
        db.query.products.findMany({
          where: eq(products.published, true),
          orderBy: [desc(products.createdAt)],
          limit: CANDIDATE_COUNT,
          columns: {
            id: true,
            slug: true,
            name: true,
            priceCents: true,
            compareAtPriceCents: true,
            categoryId: true,
            subcategoryId: true,
          },
          with: {
            brand: { columns: { name: true } },
            images: { orderBy: [asc(productImages.position)], limit: 1, columns: { url: true } },
          },
        }),
        db
          .select({ productId: productPlacements.productId, subcategoryId: productPlacements.subcategoryId })
          .from(productPlacements),
      ]);

      const placedIn = new Map<string, Set<string>>();
      for (const placement of placements) {
        const set = placedIn.get(placement.productId) ?? new Set<string>();
        set.add(placement.subcategoryId);
        placedIn.set(placement.productId, set);
      }

      // Seuls les articles photographiés vont au menu : une case grise sous
      // un onglet fait plus « site en travaux » que pas de case du tout.
      const photographed = latest.filter((row) => row.images.length > 0);
      type Candidate = (typeof photographed)[number];

      /**
       * Les deux photos d'un panneau.
       *
       * Les articles de la rubrique passent d'abord, puis ceux du reste du
       * site complètent quand le rayon est encore peu fourni. Deux règles
       * pour que le menu ne se répète pas :
       * - la liste tourne d'un cran par heure et par onglet (`seed`) : deux
       *   onglets voisins ne commencent pas au même article, et la sélection
       *   change toute seule au fil de la journée ;
       * - une photo déjà montrée sous un autre onglet n'est reprise que s'il
       *   ne reste rien d'autre, et jamais deux fois dans le même panneau
       *   (plusieurs articles de démonstration partagent la même image).
       */
      const shownElsewhere = new Set<string>();
      const toFeatures = (own: Candidate[], seed: number): NavFeature[] | undefined => {
        const ordered = [...rotate(own, seed), ...rotate(photographed, seed)];
        const picked: Candidate[] = [];
        const inPanel = new Set<string>();
        for (const allowRepeat of [false, true]) {
          for (const row of ordered) {
            if (picked.length >= FEATURED_COUNT) break;
            const url = row.images[0].url;
            if (picked.includes(row) || inPanel.has(url)) continue;
            if (!allowRepeat && shownElsewhere.has(url)) continue;
            picked.push(row);
            inPanel.add(url);
          }
        }
        for (const url of inPanel) shownElsewhere.add(url);

        const features = picked.map((row) => ({
          title: row.name,
          brand: row.brand.name,
          href: `/produits/${row.slug}`,
          imageUrl: row.images[0].url,
          priceCents: row.priceCents,
        }));
        return features.length > 0 ? features : undefined;
      };

      const hour = Math.floor(Date.now() / ROTATION_MS);

      /**
       * Les articles propres à une rubrique :
       * - un rayon : ses articles, plus ceux classés ou placés dans ses
       *   sous-rayons — la même règle que la page du rayon ;
       * - l'Outlet : les pièces démarquées ;
       * - Nouveautés et Marques : tout le site.
       */
      const featuresFor = (
        category: (typeof categoryRows)[number] | undefined,
        slug: string,
        tabIndex: number,
      ) => {
        const seed = hour + tabIndex * FEATURED_COUNT;
        if (slug === "outlet") {
          return toFeatures(
            photographed.filter((row) => row.compareAtPriceCents !== null && row.compareAtPriceCents > row.priceCents),
            seed,
          );
        }
        if (!category || slug === "nouveautes") return toFeatures(photographed, seed);
        const own = new Set(category.subcategories.map((sub) => sub.id));
        return toFeatures(
          photographed.filter(
            (row) =>
              row.categoryId === category.id ||
              (row.subcategoryId !== null && own.has(row.subcategoryId)) ||
              [...(placedIn.get(row.id) ?? [])].some((id) => own.has(id)),
          ),
          seed,
        );
      };

      const items: NavItem[] = categoryRows.map((category, tabIndex) => {
        const href = `/${category.slug}`;
        // Le grand titre du rayon (« Bébé 0-24 mois ») quand il en a un :
        // l'âge dit tout de suite à qui s'adresse l'onglet.
        const label = category.headline ?? category.title;
        // Un rayon sans sous-rayon reste un simple lien de la barre.
        if (category.subcategories.length === 0) return { label, href };
        const links = category.subcategories.map((sub) => ({
          label: sub.title,
          href: `/${category.slug}/${sub.slug}`,
        }));
        return {
          label,
          href,
          columns: chunk(links, LINKS_PER_COLUMN).map((column) => ({ title: "", links: column })),
          features: featuresFor(category, category.slug, tabIndex),
        };
      });

      // « Marques » avant l'Outlet, qui ferme la barre comme dans toute boutique.
      const brandLinks = brandRows.map((brand) => ({ label: brand.name, href: `/marques/${brand.slug}` }));
      const marques: NavItem =
        brandLinks.length === 0
          ? { label: "Marques", href: "/marques" }
          : {
              label: "Marques",
              href: "/marques",
              columns: chunk(brandLinks, LINKS_PER_COLUMN).map((column) => ({ title: "", links: column })),
              features: featuresFor(undefined, "marques", categoryRows.length),
            };
      const outletIndex = items.findIndex((item) => item.href === "/outlet");
      items.splice(outletIndex === -1 ? items.length : outletIndex, 0, marques);
      return items;
    },
    ["menu-automatique"],
    // Recalculé chaque heure pour que la sélection tourne d'elle-même.
    { tags: [CACHE_TAGS.catalog], revalidate: ROTATION_MS / 1000 },
  ),
);
