import { z } from "zod";
import { COUNTRY_CODES, emailField } from "@/lib/account/schema";
import type { ShippingOption } from "@/lib/shipping/services";

/**
 * Ce que le client saisit dans le tunnel, et ce qui en voyage jusqu'à Stripe.
 *
 * Module pur : il sert au formulaire (validation au fil des étapes), à la
 * Server Action (revalidation, car rien de ce qui vient du navigateur n'est
 * cru) et au webhook (relecture des métadonnées).
 */

const nameField = (label: string) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(80);

/** Chiffres, espaces, points, tirets, parenthèses et « + » : de 6 à 20 caractères. */
const phoneField = z
  .string()
  .trim()
  .regex(/^\+?[0-9 ().-]{6,20}$/, "Numéro de téléphone invalide.");

export const contactSchema = z.object({
  email: emailField,
  firstName: nameField("Le prénom"),
  lastName: nameField("Le nom"),
  phone: phoneField,
});

export const shippingAddressSchema = z.object({
  line1: z.string().trim().min(1, "L'adresse est obligatoire.").max(120),
  // `nullish` : le navigateur renvoie au serveur des coordonnées déjà
  // validées, où un complément vide est devenu `null`. Le schéma doit
  // accepter sa propre sortie, sinon la revalidation serveur échoue.
  line2: z
    .string()
    .trim()
    .max(120)
    .nullish()
    .transform((value) => (value ? value : null)),
  postalCode: z.string().trim().min(2, "Code postal invalide.").max(12),
  city: z.string().trim().min(1, "La ville est obligatoire.").max(80),
  country: z.enum(COUNTRY_CODES, { message: "Pays non desservi." }),
});

const HOME_SERVICES = ["colissimo-domicile", "mondial-relay-domicile"] as const;
const RELAY_SERVICES = ["colissimo-relais", "mondial-relay-relais", "chronopost-relais"] as const;

/**
 * Le mode de livraison, en union discriminée : chaque mode porte exactement
 * ce dont il a besoin. Le retrait n'a ni adresse ni transporteur ; le point
 * relais n'a qu'un identifiant Sendcloud — son adresse est relue chez Sendcloud
 * côté serveur, jamais crue du navigateur.
 */
export const deliverySchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("domicile"),
    service: z.enum(HOME_SERVICES, { message: "Choisissez un transporteur." }),
    address: shippingAddressSchema,
  }),
  z.object({
    method: z.literal("relais"),
    service: z.enum(RELAY_SERVICES, { message: "Choisissez un transporteur." }),
    servicePointId: z.number().int().positive({ message: "Choisissez un point relais." }),
  }),
  z.object({ method: z.literal("retrait") }),
]);

export const checkoutDetailsSchema = z.object({
  contact: contactSchema,
  delivery: deliverySchema,
});

export type ContactDetails = z.infer<typeof contactSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type DeliveryChoice = z.infer<typeof deliverySchema>;
export type DeliveryMethod = DeliveryChoice["method"];
export type CheckoutDetails = z.infer<typeof checkoutDetailsSchema>;

/**
 * L'adresse de facturation passée à Stripe au moment de payer.
 *
 * La carte s'en passe, Klarna non : sans nom ni pays, Stripe refuse de
 * confirmer (« error_details_unknown »). À domicile, c'est l'adresse de
 * livraison ; en point relais ou en retrait, la cliente n'a saisi aucune
 * adresse — on transmet son nom et la France, le seul pays de ces deux modes.
 */
export function billingContact(details: CheckoutDetails): {
  name: string;
  address: { country: string; line1?: string; line2?: string | null; city?: string; postal_code?: string };
} {
  const name = `${details.contact.firstName} ${details.contact.lastName}`;
  if (details.delivery.method !== "domicile") return { name, address: { country: "FR" } };
  const { address } = details.delivery;
  return {
    name,
    address: {
      country: address.country,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      postal_code: address.postalCode,
    },
  };
}

/**
 * Port TTC en centimes pour un choix de livraison, ou `null` si ce service
 * n'est pas disponible (poids hors tranche, pays non desservi).
 *
 * Le prix vient des options Sendcloud ; la boutique ne fixe rien, sauf une
 * éventuelle franchise (`freeFromCents`), aujourd'hui désactivée.
 */
export function shippingCentsFor(
  delivery: DeliveryChoice,
  options: ShippingOption[],
  itemsCents: number,
  freeFromCents: number | null,
): number | null {
  if (delivery.method === "retrait") return 0;
  const option = options.find(
    (entry) => entry.key === delivery.service && entry.kind === delivery.method,
  );
  if (!option) return null;
  if (freeFromCents !== null && itemsCents >= freeFromCents) return 0;
  return option.priceCents;
}

/**
 * Lignes d'adresse telles qu'elles figurent sur une étiquette, et telles que
 * `orders.shipping_address` les range.
 */
export function addressLines(address: ShippingAddress): string[] {
  return [
    address.line1,
    address.line2,
    `${address.postalCode} ${address.city}`,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

/**
 * Métadonnées de la session Stripe. L'adresse — de livraison, ou celle du
 * point relais relue chez Sendcloud — voyage par ici jusqu'au webhook, avec
 * de quoi créer l'étiquette plus tard (méthode Sendcloud, point relais).
 * Stripe limite chaque valeur à 500 caractères ; la troncature n'est qu'un
 * filet, les champs bornés par le schéma tiennent dedans.
 */
export function toSessionMetadata(
  details: CheckoutDetails,
  shipping: { addressLines: string[]; methodId: number | null },
): Record<string, string> {
  const { contact, delivery } = details;
  return {
    livraison: delivery.method,
    service: delivery.method === "retrait" ? "" : delivery.service,
    methode: shipping.methodId === null ? "" : String(shipping.methodId),
    relais: delivery.method === "relais" ? String(delivery.servicePointId) : "",
    nom: `${contact.firstName} ${contact.lastName}`.slice(0, 500),
    telephone: contact.phone,
    adresse: JSON.stringify(shipping.addressLines).slice(0, 500),
  };
}

const optionalNumber = z
  .string()
  .optional()
  .transform((value) => (value ? Number(value) : null))
  .refine((value) => value === null || Number.isInteger(value), "Nombre attendu.");

const metadataSchema = z.object({
  livraison: z.enum(["domicile", "relais", "retrait"]),
  service: z.string().optional().default(""),
  methode: optionalNumber,
  relais: optionalNumber,
  nom: z.string(),
  telephone: z.string(),
  adresse: z.string(),
});

export type SessionDelivery = {
  method: DeliveryMethod;
  /** Clé du service (`mondial-relay-relais`…), vide pour un retrait. */
  service: string;
  /** Tranche Sendcloud payée, pour l'étiquette. */
  methodId: number | null;
  servicePointId: number | null;
  name: string;
  phone: string;
  addressLines: string[];
};

/**
 * Relit les métadonnées dans le webhook. `null` si elles manquent ou sont
 * abîmées : la commande se rabat alors sur ce que Stripe sait lui-même.
 */
export function readSessionMetadata(
  metadata: Record<string, string> | null | undefined,
): SessionDelivery | null {
  const parsed = metadataSchema.safeParse(metadata ?? {});
  if (!parsed.success) return null;

  let lines: unknown;
  try {
    lines = JSON.parse(parsed.data.adresse);
  } catch {
    return null;
  }
  const address = z.array(z.string()).safeParse(lines);
  if (!address.success) return null;

  return {
    method: parsed.data.livraison,
    service: parsed.data.service,
    methodId: parsed.data.methode,
    servicePointId: parsed.data.relais,
    name: parsed.data.nom,
    phone: parsed.data.telephone,
    addressLines: address.data,
  };
}
