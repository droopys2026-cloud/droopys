"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import {
  DEFAULT_SHOP_SETTINGS,
  SHOP_SETTINGS_KEY,
  shopSettingsSchema,
  type ShopSettings,
} from "@/lib/settings";

/**
 * Enregistrement des réglages de boutique.
 *
 * Les montants arrivent en euros — c'est ce qu'on saisit — et sont convertis
 * en centimes ici, une bonne fois : au-delà de cette fonction, plus rien dans
 * le système ne manipule de flottant sur la monnaie.
 */
export type SettingsState = { error?: string; saved?: boolean };

/** « 6,90 » → 690. Vide → `null` quand le champ l'autorise. */
const eurosToCents = z
  .string()
  .trim()
  .transform((value) => value.replace(",", ".").replace(/\s/g, ""))
  .refine((value) => value === "" || /^\d+(\.\d{1,2})?$/.test(value), {
    message: "Montant invalide — attendu : 150 ou 6,90",
  })
  .transform((value) => (value === "" ? null : Math.round(Number(value) * 100)));

const wholeNumber = z
  .string()
  .trim()
  .transform((value) => (value === "" ? 0 : Number(value)))
  .refine((value) => Number.isInteger(value) && value >= 0, {
    message: "Nombre de jours invalide.",
  });

export async function saveSettings(
  _state: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireAdmin();

  const text = (key: string) => String(formData.get(key) ?? "").trim();

  const freeFrom = eurosToCents.safeParse(formData.get("freeFrom") ?? "");
  const WEIGHT_FIELDS = ["clothes", "baby", "shoes", "coat", "accessory"] as const;
  const weightInputs = WEIGHT_FIELDS.map((key) =>
    wholeNumber.safeParse(formData.get(`weight-${key}`) ?? ""),
  );
  const days = wholeNumber.safeParse(formData.get("returnDays") ?? "");

  for (const result of [freeFrom, days, ...weightInputs]) {
    if (!result.success) {
      return { error: result.error.issues[0]?.message ?? "Saisie invalide." };
    }
  }

  const candidate: ShopSettings = {
    boutique: {
      name: text("shopName"),
      email: text("shopEmail"),
      phone: text("shopPhone"),
      address: text("shopAddress"),
    },
    livraison: {
      freeFromCents: freeFrom.success ? freeFrom.data : null,
      // Un poids vide ou nul reprend la valeur d'usine : un colis sans poids
      // n'aurait aucun tarif chez Sendcloud.
      weights: {
        clothes: weightOr(weightInputs[0], DEFAULT_SHOP_SETTINGS.livraison.weights.clothes),
        baby: weightOr(weightInputs[1], DEFAULT_SHOP_SETTINGS.livraison.weights.baby),
        shoes: weightOr(weightInputs[2], DEFAULT_SHOP_SETTINGS.livraison.weights.shoes),
        coat: weightOr(weightInputs[3], DEFAULT_SHOP_SETTINGS.livraison.weights.coat),
        accessory: weightOr(weightInputs[4], DEFAULT_SHOP_SETTINGS.livraison.weights.accessory),
      },
      delay: text("deliveryDelay"),
    },
    paiement: { methods: formData.getAll("methods").map(String) },
    retours: {
      days: days.success ? days.data : 0,
      terms: text("returnTerms"),
    },
    annonce: { message: text("announcement") },
    newsletter: {
      title: text("newsletterTitle"),
      text: text("newsletterText"),
      placeholder: text("newsletterPlaceholder"),
      buttonLabel: text("newsletterButton"),
      // Sans prestataire, le formulaire du site n'a nulle part où poster : le
      // champ vide vaut « non branché », et le bouton reste inactif.
      provider: text("newsletterProvider") || null,
    },
    reseaux: {
      instagram: text("instagram"),
      facebook: text("facebook"),
      tiktok: text("tiktok"),
      pinterest: text("pinterest"),
    },
  };

  const parsed = shopSettingsSchema.safeParse(candidate);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Réglages invalides." };
  }

  await db
    .insert(settings)
    .values({ key: SHOP_SETTINGS_KEY, value: parsed.data })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: parsed.data, updatedAt: new Date() },
    });

  // Les réglages se voient sur tout le site — bandeau, fiche, pied de page —
  // donc c'est la mise en page racine qu'on rafraîchit, pas une page.
  revalidateTag(CACHE_TAGS.settings, "max");
  revalidatePath("/", "layout");
  return { saved: true };
}

function weightOr(
  input: { success: true; data: number } | { success: false },
  fallback: number,
): number {
  return input.success && input.data > 0 ? input.data : fallback;
}
