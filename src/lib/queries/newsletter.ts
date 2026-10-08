import "server-only";

import { desc } from "drizzle-orm";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

/** Toutes les inscriptions, la plus récente d'abord, désinscrits compris. */
export async function listSubscribers() {
  return db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

/**
 * Une cellule CSV sûre. Guillemets doublés pour le format ; apostrophe devant
 * `= + - @` pour qu'un tableur n'exécute pas la cellule comme une formule —
 * l'adresse a été saisie par un inconnu dans un formulaire public.
 */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
