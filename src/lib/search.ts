import { HOME_RAILS } from "@/lib/placeholder-data";
import type { Product } from "@/types/product";

/**
 * Recherche produit.
 *
 * Le catalogue n'existe pas encore : on aplatit les rails de l'accueil pour
 * avoir quelque chose à chercher. Le jour où l'API arrive, seule
 * `searchableProducts` change — la page, elle, ne connaît que `searchProducts`.
 */
function searchableProducts(): Product[] {
  const seen = new Map<string, Product>();
  // Un même produit peut figurer dans deux rails ; la clé le dédoublonne,
  // sinon la grille afficherait deux fois la même carte.
  for (const rail of HOME_RAILS) {
    for (const product of rail.products) seen.set(product.id, product);
  }
  return [...seen.values()];
}

/**
 * Normalise pour comparer : minuscules et accents retirés, pour que
 * « ecarpe » trouve « Écharpe ». NFD sépare la lettre de son accent, la
 * plage Unicode supprime ensuite les accents restés seuls.
 */
function normalize(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Produits dont le nom ou la marque contient tous les mots saisis.
 * Tous les mots, et non au moins un : « pull laine » doit resserrer la
 * liste, pas l'élargir.
 */
export function searchProducts(query: string): Product[] {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  return searchableProducts().filter((product) => {
    const haystack = normalize(`${product.brand} ${product.name}`);
    return words.every((word) => haystack.includes(word));
  });
}
