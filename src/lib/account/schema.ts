import { z } from "zod";

/**
 * Validation des formulaires de l'espace client. Toute donnée saisie passe
 * par ici avant d'atteindre Supabase ou la base.
 */

export const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Adresse e-mail invalide.")
  .max(254);

/**
 * Huit caractères minimum, la même règle que celle réglée dans Supabase : la
 * vérifier ici donne un message en français avant l'aller-retour. 72 au plus,
 * limite de bcrypt — au-delà, les caractères seraient ignorés sans le dire.
 */
export const passwordField = z
  .string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères.")
  .max(72, "Le mot de passe ne peut pas dépasser 72 caractères.");

const nameField = (label: string) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(80);

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Mot de passe obligatoire."),
});

export const signUpSchema = z.object({
  firstName: nameField("Le prénom"),
  lastName: nameField("Le nom"),
  email: emailField,
  password: passwordField,
});

export const profileSchema = z.object({
  firstName: nameField("Le prénom"),
  lastName: nameField("Le nom"),
});

/** Pays acceptés par le paiement Stripe (`startCheckout`). */
export const COUNTRY_CODES = ["FR", "BE", "LU", "CH", "MC"] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

export const COUNTRY_LABELS: Record<CountryCode, string> = {
  FR: "France",
  BE: "Belgique",
  LU: "Luxembourg",
  CH: "Suisse",
  MC: "Monaco",
};

/** Champ facultatif : une chaîne vide devient `null`, pas une valeur vide en base. */
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === "" ? null : value));

export const addressSchema = z.object({
  fullName: nameField("Le nom du destinataire"),
  line1: z.string().trim().min(1, "L'adresse est obligatoire.").max(120),
  line2: optional(120),
  postalCode: z
    .string()
    .trim()
    .min(2, "Code postal invalide.")
    .max(12, "Code postal invalide."),
  city: z.string().trim().min(1, "La ville est obligatoire.").max(80),
  country: z.enum(COUNTRY_CODES, { message: "Pays non desservi." }),
  phone: optional(30),
  isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;

/** Les messages d'une validation ratée, prêts pour l'affichage. */
export function issueMessages(error: z.ZodError): string[] {
  return [...new Set(error.issues.map((issue) => issue.message))];
}

/**
 * Valeurs saisies, renvoyées avec une erreur pour réafficher le formulaire.
 *
 * React 19 réinitialise un formulaire après chaque envoi par action : sans
 * ce renvoi, une faute sur un champ effacerait tous les autres. Les mots de
 * passe ne sont jamais renvoyés — ni stockés dans l'état, ni réaffichés.
 */
export type FormValues = Record<string, string>;

export function pickValues(formData: FormData, names: readonly string[]): FormValues {
  const values: FormValues = {};
  for (const name of names) {
    const value = formData.get(name);
    if (typeof value === "string") values[name] = value;
  }
  return values;
}
