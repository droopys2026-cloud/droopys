import { z } from "zod";
import { slugify } from "@/lib/slug";

/**
 * Validation d'une fiche produit à l'entrée du serveur.
 *
 * Un formulaire n'est pas une source fiable : les champs arrivent en chaînes
 * de caractères, peuvent être absents, et rien n'empêche d'en forger un à la
 * main. Tout passe donc par ce schéma avant d'approcher la base — c'est la
 * frontière du système, et elle échoue bruyamment.
 */

/** « 495,00 » ou « 495.00 » → 49500 centimes. */
const priceInCents = z
  .string()
  .trim()
  .transform((value) => value.replace(",", ".").replace(/\s/g, ""))
  .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
    message: "Prix invalide — attendu : 495 ou 495,00",
  })
  .transform((value) => Math.round(Number(value) * 100));

/** Champ facultatif : la chaîne vide vaut « non renseigné », pas « vide ». */
const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value));

/**
 * Une couleur saisie à l'admin. `key` est l'identifiant en base pour une
 * couleur existante, un identifiant provisoire pour une nouvelle : il ne sert
 * qu'à relier stock et photos à leur couleur dans le même envoi.
 */
export const colorInputSchema = z.object({
  key: z.string().min(1),
  name: z.string().trim().min(1, "Donnez un nom à chaque couleur.").max(60),
  hex: z
    .string()
    .trim()
    .regex(/^#[0-9a-f]{6}$/i, "Teinte invalide — attendue : #rrggbb.")
    .transform((value) => value.toLowerCase()),
});

/**
 * Une case du stock : une taille, dans une couleur (`null` sans couleur).
 * `price` vide vaut « prix du produit » — c'est le cas courant.
 */
export const stockInputSchema = z.object({
  colorKey: z.string().min(1).nullable(),
  size: z.string().trim().min(1),
  quantity: z.number().int().min(0),
  price: z.union([z.literal("").transform(() => undefined), priceInCents]),
});

export const measurementSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const productInputSchema = z.object({
  brandSlug: z.string().trim().min(1, "Choisissez une marque."),
  name: z.string().trim().min(1, "Le nom est obligatoire.").max(200),
  priceCents: priceInCents,
  // Vide vaut « hors promotion » : c'est l'état courant, pas une erreur.
  compareAtPriceCents: z.union([
    z.literal("").transform(() => undefined),
    priceInCents,
  ]),
  reference: optionalText,

  categorySlug: z.string().trim().min(1, "Choisissez un rayon."),
  /** Identifiant d'une ligne de `subcategories` ; vide vaut « sans ». */
  subcategoryId: z.union([
    z.literal("").transform(() => undefined),
    z.string().uuid("Sous-rayon inconnu."),
  ]),

  /** Une ligne par point : le front rend un paragraphe par entrée. */
  description: z.string().transform((value) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  ),
  madeIn: optionalText,
  composition: optionalText,
  care: optionalText,
  modelNote: optionalText,
  sizeAdvice: optionalText,
  badge: optionalText,

  colors: z.array(colorInputSchema),
  /** Tailles proposées, dans l'ordre d'affichage, communes à toutes les couleurs. */
  sizes: z.array(z.string().trim().min(1)),
  stock: z.array(stockInputSchema),
  measurements: z.array(measurementSchema),

  published: z.boolean(),
});

export type ProductInput = z.infer<typeof productInputSchema>;

/**
 * Cohérence que la validation champ par champ ne peut pas exprimer.
 * Séparée pour que le message parle métier, et non contrainte de saisie.
 */
export function productIssues(input: ProductInput): string[] {
  const issues: string[] = [];

  if (
    input.compareAtPriceCents !== undefined &&
    input.compareAtPriceCents <= input.priceCents
  ) {
    issues.push(
      "Le prix barré doit être supérieur au prix de vente, sinon la promotion n'en est pas une.",
    );
  }

  if (input.sizes.length === 0) {
    issues.push(
      "Choisissez au moins une taille : sans taille, le bouton d'achat de la fiche ne peut pas s'activer.",
    );
  }

  const duplicates = repeated(input.sizes);
  if (duplicates.length > 0) {
    issues.push(`Taille en double : ${duplicates.join(", ")}.`);
  }

  // Comparées par leur forme d'URL : « Rose » et « rosé » donneraient la même
  // adresse `?couleur=rose`, donc la même couleur pour la cliente.
  const slugs = input.colors.map((color) => slugify(color.name));
  if (slugs.some((slug) => slug === "")) {
    issues.push("Un nom de couleur doit contenir au moins une lettre ou un chiffre.");
  }
  const sameColors = repeated(slugs.filter(Boolean));
  if (sameColors.length > 0) {
    issues.push(
      `Couleur en double : ${input.colors
        .filter((color) => sameColors.includes(slugify(color.name)))
        .map((color) => color.name)
        .join(", ")}.`,
    );
  }

  if (input.stock.some((entry) => entry.price === 0)) {
    issues.push("Un prix de taille ne peut pas être à 0 € — laissez la case vide pour garder le prix du produit.");
  }

  if (!stockMatches(input)) {
    // Ne vient pas d'une saisie normale : le formulaire construit le stock à
    // partir des couleurs et des tailles. Mieux vaut refuser que d'inventer
    // une case manquante à 0.
    issues.push("Le stock ne correspond pas aux couleurs et tailles choisies. Rechargez la page et recommencez.");
  }

  return issues;
}

/**
 * Une couleur sans photo : la fiche n'aurait rien à montrer quand on la
 * choisit, et la cliente croirait voir une autre teinte. Les photos communes
 * ne comptent pas — elles ne montrent pas la couleur.
 */
export function colorPhotoIssues(
  colors: { key: string; name: string }[],
  imageColors: (string | null)[],
): string[] {
  return colors
    .filter((color) => !imageColors.includes(color.key))
    .map((color) => `Ajoutez au moins une photo pour la couleur « ${color.name} ».`);
}

/** Vrai si le stock a exactement une case par couleur × taille déclarées. */
function stockMatches(input: ProductInput): boolean {
  const colorKeys: (string | null)[] =
    input.colors.length > 0 ? input.colors.map((color) => color.key) : [null];
  const expected = colorKeys.flatMap((colorKey) =>
    input.sizes.map((size) => cellKey(colorKey, size)),
  );
  const received = input.stock.map((entry) => cellKey(entry.colorKey, entry.size));
  return (
    received.length === expected.length &&
    repeated(received).length === 0 &&
    expected.every((key) => received.includes(key))
  );
}

function cellKey(colorKey: string | null, size: string): string {
  return `${colorKey ?? ""}\u0000${size}`;
}

function repeated(values: string[]): string[] {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}
