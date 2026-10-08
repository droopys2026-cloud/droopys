import { z } from "zod";

/**
 * Liste de favoris d'un visiteur non connecté, telle que rangée en cookie.
 *
 * Bornée : un cookie dépasse vite les 4 Ko qu'acceptent les navigateurs, et
 * un cookie trop gros n'est pas tronqué, il est **ignoré** — tous les favoris
 * disparaîtraient d'un coup. Cent identifiants tiennent largement.
 */
export const MAX_WISHLIST = 100;

const listSchema = z.array(z.string().uuid());

/**
 * Lit le cookie. Illisible → liste vide plutôt qu'erreur : le visiteur n'a pas
 * à subir une page cassée parce qu'une ancienne version écrivait un autre
 * format.
 */
export function parseWishlist(raw: string | undefined): string[] {
  if (!raw) return [];
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return [];
  }
  const parsed = listSchema.safeParse(json);
  if (!parsed.success) return [];
  return [...new Set(parsed.data)].slice(0, MAX_WISHLIST);
}

/**
 * Ajoute ou retire un produit. L'ajout se fait en tête — la page des favoris
 * montre d'abord le dernier coup de cœur — et, liste pleine, le plus ancien
 * sort.
 */
export function toggleInWishlist(
  list: string[],
  productId: string,
): { list: string[]; saved: boolean } {
  if (list.includes(productId)) {
    return { list: list.filter((id) => id !== productId), saved: false };
  }
  return { list: [productId, ...list].slice(0, MAX_WISHLIST), saved: true };
}
