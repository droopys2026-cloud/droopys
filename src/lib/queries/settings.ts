import "server-only";

import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import {
  DEFAULT_SHOP_SETTINGS,
  SHOP_SETTINGS_KEY,
  shopSettingsSchema,
  type ShopSettings,
} from "@/lib/settings";

/**
 * Réglages de boutique, validés par Zod à la lecture.
 *
 * Le jsonb de Postgres n'a pas de forme garantie : une ligne écrite par une
 * version antérieure du formulaire, ou modifiée à la main dans le tableau de
 * bord Supabase, peut ne plus correspondre au schéma. On retombe alors sur
 * les valeurs d'usine **en signalant l'écart dans les logs** — une boutique
 * qui affiche « livraison offerte dès 0 € » par silence vaut moins qu'une
 * boutique qui affiche le seuil d'usine et une erreur lisible en console.
 *
 * Deux caches superposés, et ils ne font pas le même travail : `unstable_cache`
 * garde le résultat **entre les rendus** — c'est lui qui évite une requête par
 * page au build — et `cache` de React le garde **au sein d'un rendu**, où le
 * bandeau d'annonce et la fiche produit le demandent tous les deux.
 */
const readShopSettings = unstable_cache(
  async (): Promise<ShopSettings> => {
    const row = await db.query.settings.findFirst({
      where: eq(settings.key, SHOP_SETTINGS_KEY),
    });

    if (!row) return DEFAULT_SHOP_SETTINGS;

    const parsed = shopSettingsSchema.safeParse(row.value);
    if (!parsed.success) {
      console.error(
        `Réglages « ${SHOP_SETTINGS_KEY} » invalides en base, repli sur les valeurs d'usine :`,
        parsed.error.issues,
      );
      return DEFAULT_SHOP_SETTINGS;
    }

    return parsed.data;
  },
  ["reglages-boutique"],
  { tags: [CACHE_TAGS.settings] },
);

export const getShopSettings = cache(readShopSettings);
