import "server-only";

import Stripe from "stripe";
import { serverEnv } from "@/lib/env";

/**
 * Client Stripe, côté serveur uniquement.
 *
 * La version d'API n'est pas fixée à la main : `stripe@22.6.2` est publiée
 * pour `2026-08-26.dahlia` et s'y attache d'elle-même. Écrire une autre date
 * ici ferait diverger les types TypeScript des réponses réellement reçues —
 * exactement le genre de bug qu'on ne voit qu'en production.
 */
export const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY);

/** Devise de la boutique. En centimes partout, comme le reste du projet. */
export const CURRENCY = "eur";
