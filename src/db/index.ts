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
 * Mode session partout s'il est fourni (`DEV_DATABASE_URL`, nom historique),
 * transaction sinon — voir `env.ts`.
 *
 * Derrière le pooler en mode transaction, des requêtes de 150 ms restaient
 * figées (« active / ClientRead ») : en développement d'abord, puis au build,
 * puis en production, où des pages entières tombaient au bout de 300 s
 * (12 octobre 2026). Le mode session ne fige pas ; il plafonne au « Pool
 * Size » de Supabase pour tout le projet (porté de 15 à 40 le 12 octobre
 * 2026 : les instances du site gardaient les 15 et le build n'en trouvait
 * plus), d'où les pools réduits ci-dessous.
 */
function connectionUrl(): string {
  return serverEnv.DEV_DATABASE_URL ?? serverEnv.DATABASE_URL;
}

/**
 * Connexions par processus. Quarante au total pour le projet en mode session :
 * - build : 3 processus × 2 ;
 * - production : 2 par instance de fonction, rendues vite au pooler ;
 * - développement : 4, un seul serveur.
 */
function poolSize(): number {
  if (process.env.NEXT_PHASE === "phase-production-build") return 2;
  if (process.env.NODE_ENV === "production") return 2;
  return 4;
}

const globalForDb = globalThis as unknown as {
  droopysSql?: ReturnType<typeof postgres>;
};

const sql =
  globalForDb.droopysSql ??
  postgres(connectionUrl(), {
    prepare: false,
    max: poolSize(),
    // Une connexion inactive est rendue au pooler plutôt que gardée : elle
    // servira à une autre fonction. Vite, puisqu'elles sont comptées.
    idle_timeout: 10,
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
