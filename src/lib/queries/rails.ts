import "server-only";

import { cache } from "react";
import { listCategories, listProducts, listProductsForCategory } from "@/lib/queries/catalog";
import type { ProductRail } from "@/types/product";

/** Nombre d'articles par carrousel : au-delà, personne ne fait défiler. */
const RAIL_SIZE = 12;

/** Les deux sélections de l'accueil, par rayon, dans l'ordre d'affichage. */
const SELECTIONS = ["fille", "garcon"];

/**
 * Les trois carrousels de la page d'accueil.
 *
 * Ils se construisent à partir du catalogue et non d'une liste écrite à la
 * main : le premier montre les dernières fiches publiées, les deux suivants
 * « La sélection Fille » et « La sélection Garçon » — les articles de la
 * page du rayon, placements compris, et eux seuls. Une mise en avant éditoriale — « la sélection
 * de Noël » — demandera une vraie table de collections ; tant que personne
 * ne l'a demandée, on ne l'invente pas.
 */
export const getHomeRails = cache(async (): Promise<ProductRail[]> => {
  const [latest, categories] = await Promise.all([
    listProducts({ limit: RAIL_SIZE }),
    listCategories(),
  ]);

  const rails: ProductRail[] = [];

  if (latest.length > 0) {
    rails.push({
      title: "Nouveautés ",
      titleAccent: "de la saison",
      href: "/nouveautes",
      products: latest,
    });
  }

  // Mêmes articles que la page du rayon, placements compris : une basket
  // rangée en Garçon et placée en Fille doit aussi sortir dans la sélection
  // Fille, puisqu'elle est sur la page Fille.
  const byCategory = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: (await listProductsForCategory(category.slug)).slice(0, RAIL_SIZE),
    })),
  );

  // Fille et Garçon, toujours, dans cet ordre : c'est ce que la boutique
  // attend sous ces titres. Choisir « les deux rayons les mieux fournis »
  // faisait disparaître la sélection Garçon dès que Bébé la dépassait. Un
  // autre rayon ne prend la place que d'une sélection trop maigre pour tenir
  // un carrousel — trois articles sous une flèche de défilement font pauvre.
  const fills = (entry: (typeof byCategory)[number]) => entry.products.length >= 4;
  const preferred = SELECTIONS.flatMap((slug) =>
    byCategory.filter((entry) => entry.category.slug === slug && fills(entry)),
  );
  const fallback = byCategory
    .filter((entry) => fills(entry) && !preferred.includes(entry))
    .sort((a, b) => b.products.length - a.products.length);
  const furnished = [...preferred, ...fallback].slice(0, 2);

  for (const entry of furnished) {
    rails.push({
      title: "La sélection ",
      titleAccent: entry.category.title,
      href: `/${entry.category.slug}`,
      products: entry.products,
    });
  }

  return rails;
});
