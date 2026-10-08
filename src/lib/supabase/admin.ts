import "server-only";

import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/env";

/**
 * Client privilégié, réservé au serveur.
 *
 * La clé secrète contourne RLS et donne accès aux API d'administration. Ce
 * module ne doit jamais être atteint depuis un composant client : `server-only`
 * transforme la tentative en erreur de compilation plutôt qu'en fuite de clé.
 *
 * Il ne sert qu'à ce que la session du visiteur ne peut pas faire : téléverser
 * dans le stockage, créer un compte.
 */
export const supabaseAdmin = createClient(
  publicEnv.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.SUPABASE_SECRET_KEY,
  {
    // Un client serveur n'a pas de session à garder ni à rafraîchir : chaque
    // appel est authentifié par la clé.
    auth: { persistSession: false, autoRefreshToken: false },
  },
);

/** Buckets d'images — créés par `scripts/storage.mts`. */
export const PRODUCT_BUCKET = "produits";
/**
 * Photos de rayon, de sous-rayon et de sélection. Un bucket distinct de celui
 * des produits : ces visuels survivent aux fiches qu'ils côtoient, et purger
 * les photos d'un produit ne doit pas risquer d'emporter l'image d'un rayon.
 */
export const TAXONOMY_BUCKET = "rayons";
