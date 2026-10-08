/**
 * Poids estimé d'un colis, pour afficher le prix réel du transporteur.
 *
 * La boutique ne pèse pas ses pièces : on estime le poids d'un article par sa
 * nature, lue dans son classement — sous-rayon d'abord (« manteaux »,
 * « chaussures »…), qui dit ce qu'est la pièce, puis rayon (« bébé »), puis
 * un poids de vêtement par défaut. Les cinq poids se règlent dans l'admin.
 *
 * C'est une estimation pour le prix affiché : le transporteur facturera le
 * poids réel au moment de l'étiquette.
 */

export type ParcelWeights = {
  /** Vêtement courant : robe, pull, pantalon. */
  clothes: number;
  /** Pièce de bébé, sans autre précision. */
  baby: number;
  shoes: number;
  coat: number;
  accessory: number;
};

type Kind = keyof ParcelWeights;

/** Mots des slugs de rayon et sous-rayon qui disent la nature d'une pièce. */
const KEYWORDS: [Kind, string[]][] = [
  ["coat", ["manteaux", "doudounes", "parkas", "blousons", "ski", "laine"]],
  ["shoes", ["chaussures", "baskets", "bottines", "sandales", "chaussons"]],
  ["accessory", ["accessoires", "bonnets", "echarpes", "gants", "sacs", "casquettes", "chaussettes", "ceintures"]],
];

function kindOf(slug: string | null): Kind | null {
  if (!slug) return null;
  return KEYWORDS.find(([, words]) => words.includes(slug))?.[0] ?? null;
}

export function itemWeightGrams(
  product: { categorySlug: string | null; subcategorySlug: string | null },
  weights: ParcelWeights,
): number {
  const kind =
    kindOf(product.subcategorySlug) ??
    kindOf(product.categorySlug) ??
    (product.categorySlug === "bebe" ? "baby" : "clothes");
  return weights[kind];
}

export function parcelWeightGrams(
  lines: { categorySlug: string | null; subcategorySlug: string | null; quantity: number }[],
  weights: ParcelWeights,
): number {
  return lines.reduce(
    (total, line) => total + itemWeightGrams(line, weights) * line.quantity,
    0,
  );
}
