import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import { serverEnv } from "@/lib/env";

/**
 * Client Postgres partagé.
 *
 * Deux précautions liées à l'hébergement :
 *
 * 1. `prepare: false` est **obligatoire** derrière le pooler Supabase en mode
 *    transaction, qui ne supporte pas les requêtes préparées. Sans ce réglage,
 *    tout marche en local (connexion directe) et casse en production.
 *    Voir docs/reference/drizzle.md, section « Drizzle <> Supabase ».
 * 2. **Un pool volontairement petit.** Le build lance neuf workers, chacun
 *    avec son propre client : à dix connexions par worker, le pooler Supabase
 *    ferme les connexions en cours de route et le build échoue en
 *    `CONNECTION_CLOSED`. Quatre suffisent — une page rend au plus trois ou
 *    quatre requêtes de front. Descendre à une seule connexion serait pire
 *    que le mal : une requête restée en vol bloquerait alors *toutes* les
 *    suivantes du processus, et la page ne rendrait jamais la main.
 * 3. Le client est mémorisé sur `globalThis` : en développement, le
 *    rechargement à chaud réévalue ce module à chaque édition, et sans cela
 *    chaque sauvegarde laisserait une connexion ouverte derrière elle.
 */
/**
 * Mode session en développement **et pendant le build** s'il est fourni,
 * transaction sinon — voir `env.ts`.
 *
 * Le build aussi : derrière le pooler en mode transaction, des requêtes de
 * 150 ms restaient figées (« active / ClientRead ») jusqu'au délai de 15 s,
 * et le build échouait une fois sur deux sur une page au hasard. Le mode
 * session ne fige pas ; il plafonne à quinze connexions, d'où les trois
 * processus de build au plus fixés dans `next.config.ts` (3 × 4 = 12).
 */
function connectionUrl(): string {
  const longLived =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PHASE === "phase-production-build";
  if (longLived && serverEnv.DEV_DATABASE_URL) return serverEnv.DEV_DATABASE_URL;
  return serverEnv.DATABASE_URL;
}

const globalForDb = globalThis as unknown as {
  droopysSql?: ReturnType<typeof postgres>;
};

const sql =
  globalForDb.droopysSql ??
  postgres(connectionUrl(), {
    prepare: false,
    max: 4,
    // Une connexion inactive est rendue au pooler plutôt que gardée : elle
    // servira à une autre fonction.
    idle_timeout: 20,
    // Une connexion ne vit pas plus de dix minutes : le pooler recycle, et
    // une connexion devenue inutilisable finit par disparaître d'elle-même.
    max_lifetime: 60 * 10,
    connect_timeout: 10,
    connection: {
      // Filet de sécurité : Postgres annule lui-même toute requête qui
      // dépasse quinze secondes. Sans lui, une requête restée en vol — un
      // rendu abandonné par le navigateur, par exemple — garde sa connexion
      // et finit, à force, par vider le pool ; les pages ralentissent alors
      // sans qu'aucune erreur ne soit levée. Une requête de catalogue prend
      // 150 ms : dépasser quinze secondes est déjà une panne.
      statement_timeout: 15_000,
    },
  });

if (process.env.NODE_ENV !== "production") globalForDb.droopysSql = sql;

export const db = drizzle({ client: sql, schema });
export { schema };

/**
 * Une transaction, telle que la reçoit le rappel de `db.transaction`.
 *
 * Le type est exporté parce qu'une fonction appelée depuis une transaction
 * doit pouvoir l'accepter en paramètre : lui passer `db` la ferait travailler
 * hors transaction, et ses écritures survivraient à un `rollback`.
 */
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
