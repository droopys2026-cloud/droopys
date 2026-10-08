import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit tourne hors de Next : personne ne charge .env.local pour lui.
config({ path: ".env.local" });

const url = process.env.DIRECT_URL;
if (!url) throw new Error("DIRECT_URL manquante — voir .env.example.");

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Connexion directe (port 5432) et non le pooler : une migration a besoin
  // d'une session persistante, que le mode transaction ne fournit pas.
  dbCredentials: { url },
  // Supabase installe ses propres rôles dans la base ; sans cette exclusion,
  // drizzle-kit proposerait de les supprimer à chaque génération.
  entities: { roles: { provider: "supabase" } },
});
