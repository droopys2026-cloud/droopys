import { DEMO_PRODUCT, HOME_RAILS } from "@/lib/placeholder-data";
import type { Product } from "@/types/product";

/**
 * Catalogue consultable par la fiche produit.
 *
 * Il réunit tout ce qui porte un lien vers `/produits/…` : la fiche complète
 * de démonstration et les articles des rails d'accueil. Sans cela, chaque
 * carte des rails menait à une 404 — le lien existait, la page non.
 *
 * La déduplication se fait sur le slug, qui est aussi l'adresse : deux
 * produits au même slug, c'est une page qui en cache une autre.
 */
export const ALL_PRODUCTS: Product[] = [
  DEMO_PRODUCT,
  ...HOME_RAILS.flatMap((rail) => rail.products),
].filter(
  (product, index, list) =>
    list.findIndex((other) => other.slug === product.slug) === index,
);

export function getProduct(slug: string): Product | undefined {
  return ALL_PRODUCTS.find((product) => product.slug === slug);
}
