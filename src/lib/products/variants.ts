/**
 * Prix et libellé d'une déclinaison (couleur × taille).
 *
 * Une seule définition, partagée par la fiche, le panier, le tunnel et le
 * webhook : si chacun recalculait le prix à sa façon, la boutique pourrait
 * afficher un montant et Stripe en débiter un autre.
 */

/** Prix effectif : celui de la déclinaison s'il est saisi, sinon celui du produit. */
export function variantPriceCents(
  variant: { priceCents: number | null },
  productPriceCents: number,
): number {
  return variant.priceCents ?? productPriceCents;
}

/**
 * Le plus bas des prix, et s'ils diffèrent — de quoi écrire « dès 39,00 € ».
 * Liste vide : rien à dire, on rend `undefined` plutôt qu'un prix inventé.
 */
export function priceRange(
  prices: number[],
): { fromCents: number; varies: boolean } | undefined {
  if (prices.length === 0) return undefined;
  const fromCents = Math.min(...prices);
  return { fromCents, varies: prices.some((price) => price !== fromCents) };
}

/**
 * « Rose poudré · taille 8 ans », ou « Taille 8 ans » pour une pièce sans
 * couleur. Écrit pour ouvrir une ligne : la majuscule suit le premier mot.
 */
export function variantLabel(line: { color?: string | null; size: string }): string {
  return line.color ? `${line.color} · taille ${line.size}` : `Taille ${line.size}`;
}

/**
 * Même chose au milieu d'une phrase : « Doudoune, Rose poudré, taille 8 ans ».
 * La couleur garde sa casse saisie — c'est un nom, pas un mot de liaison.
 */
export function inlineVariantLabel(line: { color?: string | null; size: string }): string {
  return line.color ? `${line.color}, taille ${line.size}` : `taille ${line.size}`;
}

/**
 * Prix à afficher pour un ensemble de déclinaisons — toutes celles d'une
 * carte, celles d'une couleur sur la fiche, ou la seule choisie.
 *
 * Seules les déclinaisons en stock comptent quand il y en a : « dès 39 € »
 * pour une taille épuisée promettrait un prix qu'on ne peut pas payer. Le
 * prix barré n'apparaît que si aucune n'a de prix propre — il a été fixé
 * contre le prix de la fiche, pas contre un prix de taille.
 */
export function displayPrice(
  product: { priceCents: number; compareAtPriceCents?: number },
  sizes: { priceCents: number; ownPrice: boolean; quantity: number }[],
): { cents: number; from: boolean; compareAtCents?: number } {
  const available = sizes.filter((entry) => entry.quantity > 0);
  const pool = available.length > 0 ? available : sizes;
  const range = priceRange(pool.map((entry) => entry.priceCents));
  const cents = range?.fromCents ?? product.priceCents;
  const compareAt = product.compareAtPriceCents;

  return {
    cents,
    from: range?.varies ?? false,
    compareAtCents:
      compareAt !== undefined && compareAt > cents && !pool.some((entry) => entry.ownPrice)
        ? compareAt
        : undefined,
  };
}
