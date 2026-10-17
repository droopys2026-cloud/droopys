import { z } from "zod";
import { normalizeCode } from "@/lib/promo/discount";

/**
 * Validation d'un code promo saisi à l'admin.
 *
 * Les champs arrivent en chaînes depuis un formulaire : tout est relu ici,
 * avant la base. Les euros deviennent des centimes, les cases vides des
 * « sans limite ».
 */

/** « 10 », « 10,50 » ou « 10.50 » → centimes ; vide → `null`. */
const optionalEuros = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === "") return null;
    const normalized = value.replace(",", ".").replace(/\s/g, "");
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
      context.addIssue({ code: "custom", message: "Montant invalide — attendu : 10 ou 10,50." });
      return z.NEVER;
    }
    return Math.round(Number(normalized) * 100);
  });

const optionalCount = z
  .string()
  .trim()
  .transform((value, context) => {
    if (value === "") return null;
    if (!/^\d+$/.test(value) || Number(value) < 1) {
      context.addIssue({ code: "custom", message: "Nombre d'utilisations invalide." });
      return z.NEVER;
    }
    return Number(value);
  });

/**
 * Dernière seconde du jour choisi, heure de Paris : « jusqu'au 30 novembre »
 * doit valoir toute la journée du 30 pour une cliente en France, été comme
 * hiver.
 */
export function parisEndOfDay(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const guess = Date.UTC(year, month - 1, day, 23, 59, 59);
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(guess))
    .find((part) => part.type === "timeZoneName")?.value;
  const match = offset?.match(/GMT([+-])(\d{2}):(\d{2})/);
  const minutes = match ? (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3])) : 0;
  return new Date(guess - minutes * 60_000);
}

export const promoInputSchema = z
  .object({
    code: z
      .string()
      .transform(normalizeCode)
      .pipe(
        z
          .string()
          .regex(
            /^[A-Z0-9-]{3,30}$/,
            "Le code fait 3 à 30 caractères : lettres, chiffres et tirets, sans espace ni accent.",
          ),
      ),
    kind: z.enum(["percent", "amount"], { message: "Choisissez le type de remise." }),
    value: z.string().trim(),
    scope: z.enum(["site", "products"], { message: "Choisissez la portée du code." }),
    productIds: z.array(z.string().uuid()),
    endsOn: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide.")]),
    maxUses: optionalCount,
    minSubtotal: optionalEuros,
    oncePerCustomer: z.boolean(),
    active: z.boolean(),
    announce: z.boolean(),
    announcement: z.string().trim().max(160, "Le message de la bande fait 160 caractères au plus."),
  })
  .transform((input, context) => {
    let value: number;
    if (input.kind === "percent") {
      value = Number(input.value);
      if (!/^\d+$/.test(input.value) || value < 1 || value > 100) {
        context.addIssue({ code: "custom", message: "Le pourcentage va de 1 à 100." });
        return z.NEVER;
      }
    } else {
      const normalized = input.value.replace(",", ".").replace(/\s/g, "");
      if (!/^\d+(\.\d{1,2})?$/.test(normalized) || Number(normalized) <= 0) {
        context.addIssue({ code: "custom", message: "Montant de remise invalide — attendu : 10 ou 10,50." });
        return z.NEVER;
      }
      value = Math.round(Number(normalized) * 100);
    }

    if (input.scope === "products" && input.productIds.length === 0) {
      context.addIssue({ code: "custom", message: "Choisissez au moins un produit, ou la portée « Tout le site »." });
      return z.NEVER;
    }

    return {
      code: input.code,
      kind: input.kind,
      value,
      scope: input.scope,
      productIds: input.scope === "products" ? [...new Set(input.productIds)] : [],
      endsAt: input.endsOn === "" ? null : parisEndOfDay(input.endsOn),
      maxUses: input.maxUses,
      minSubtotalCents: input.minSubtotal,
      oncePerCustomer: input.oncePerCustomer,
      active: input.active,
      // Seul un code « tout le site » s'annonce : la bande parle à toutes les
      // clientes, un code limité à trois articles y tromperait.
      announce: input.scope === "site" && input.announce,
      announcement: input.announcement === "" ? null : input.announcement,
    };
  });

export type PromoInput = z.output<typeof promoInputSchema>;
