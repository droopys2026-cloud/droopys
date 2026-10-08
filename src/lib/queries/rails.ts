import "server-only";

import { cache } from "react";
import { listCategories, listProducts } from "@/lib/queries/catalog";
import type { ProductRail } from "@/types/product";

/** Nombre d'articles par carrousel : au-delà, personne ne fait défiler. */
const RAIL_SIZE = 12;

/**
 * Les trois carrousels de la page d'accueil.
 *
 * Ils se construisent à partir du catalogue et non d'une liste écrite à la
 * main : le premier montre les dernières fiches publiées, les deux suivants
 * les rayons les mieux fournis. Une mise en avant éditoriale — « la sélection
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

  const byCategory = await Promise.all(
    categories.map(async (category) => ({
      category,
      products: await listProducts({
        categorySlug: category.slug,
        limit: RAIL_SIZE,
      }),
    })),
  );

  // Les deux rayons les mieux fournis, et seulement s'ils tiennent un
  // carrousel : trois articles sous une flèche de défilement font pauvre.
  const furnished = byCategory
    .filter((entry) => entry.products.length >= 4)
    .sort((a, b) => b.products.length - a.products.length)
    .slice(0, 2);

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
