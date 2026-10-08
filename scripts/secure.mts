import { config } from "dotenv";
import postgres from "postgres";

/**
 * Verrouille toutes les tables applicatives.
 *
 * Supabase expose automatiquement le schéma `public` en API REST, accessible
 * avec la clé publiable — celle qui part dans le navigateur. Une table sans
 * RLS y est donc lisible **et modifiable** par n'importe qui. Activer RLS
 * sans écrire la moindre policy ferme la porte : les rôles `anon` et
 * `authenticated` n'ont plus aucun droit.
 *
 * Notre propre accès n'en souffre pas : Drizzle se connecte en `postgres`,
 * propriétaire des tables, et le propriétaire contourne RLS par construction.
 * Le jour où le front lira directement Supabase, on ajoutera des policies de
 * lecture explicites — jamais l'inverse.
 */
config({ path: ".env.local" });

const url = process.env.DIRECT_URL;
if (!url) throw new Error("DIRECT_URL manquante — voir .env.example.");

const sql = postgres(url, { max: 1 });

const tables = await sql<{ tablename: string }[]>`
  select tablename from pg_tables where schemaname = 'public'
`;

for (const { tablename } of tables) {
  // Identifiant interpolé à la main : Postgres n'accepte pas de paramètre lié
  // à la place d'un nom de table. La liste vient de pg_tables, pas d'une saisie.
  await sql.unsafe(
    `alter table public."${tablename}" enable row level security`,
  );
  console.log(`RLS activé — ${tablename}`);
}

const open = await sql<{ tablename: string }[]>`
  select tablename from pg_tables
  where schemaname = 'public' and rowsecurity = false
`;
if (open.length > 0) {
  throw new Error(`Tables encore ouvertes : ${open.map((t) => t.tablename).join(", ")}`);
}
console.log(`\n${tables.length} tables vérifiées, aucune n'est ouverte.`);

await sql.end();
