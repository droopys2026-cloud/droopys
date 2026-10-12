import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/**
 * Webhook Sendcloud : vérification de la signature et lecture de l'appel.
 *
 * Module pur, testé à part de la route : c'est la seule défense contre un
 * appel forgé qui ferait passer n'importe quelle commande en « livrée ».
 *
 * Sendcloud signe le corps brut en HMAC-SHA256 avec la clé secrète de
 * l'intégration, et met le condensé hexadécimal dans `Sendcloud-Signature`
 * (sendcloud.dev/api/v2/webhooks, relevé le 12 octobre 2026).
 */
export function isValidSendcloudSignature(
  rawBody: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const received = Buffer.from(signature, "hex");
  // Longueurs différentes : `timingSafeEqual` lèverait, et ce n'est de toute
  // façon pas la bonne signature.
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/** Statut Sendcloud « Delivered » — relevé sur un colis réel. */
export const SENDCLOUD_DELIVERED = 11;

/**
 * Seul l'événement de changement de statut nous intéresse ; les autres
 * (intégration modifiée, retour créé…) sont acquittés sans traitement.
 */
export const parcelStatusSchema = z.object({
  action: z.literal("parcel_status_changed"),
  parcel: z.object({
    id: z.number().int(),
    status: z.object({ id: z.number().int(), message: z.string() }),
  }),
});
