"use server";

import { z } from "zod";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

/**
 * Inscription à la lettre d'information.
 *
 * L'adresse est enregistrée en base même sans prestataire d'emailing : c'est
 * précisément quand on n'a pas encore choisi son outil qu'il faut garder les
 * adresses, sinon on ouvre la boutique avec une liste vide.
 *
 * La réponse est la même pour une adresse nouvelle et pour une déjà inscrite.
 * Dire « vous êtes déjà inscrit » révèle à un inconnu qu'une adresse figure
 * dans la liste — une fuite discrète, mais une fuite.
 */
const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type NewsletterState = { error?: string; done?: boolean };

export async function subscribe(
  _state: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Cette adresse e-mail ne semble pas valide." };
  }

  await db
    .insert(newsletterSubscribers)
    .values({ email: parsed.data.email })
    // Une réinscription réveille une adresse désinscrite plutôt que d'échouer
    // sur la contrainte d'unicité.
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { unsubscribedAt: null },
    });

  return { done: true };
}
