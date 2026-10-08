import { z } from "zod";

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

export const sizeStockSchema = z.object({
  size: z.string().trim().min(1),
  quantity: z.number().int().min(0),
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

  sizes: z.array(sizeStockSchema),
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

  const duplicates = input.sizes
    .map((entry) => entry.size)
    .filter((size, index, list) => list.indexOf(size) !== index);
  if (duplicates.length > 0) {
    issues.push(`Taille en double : ${[...new Set(duplicates)].join(", ")}.`);
  }

  return issues;
}
