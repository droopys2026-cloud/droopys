import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

/**
 * Donne le rôle administrateur à un compte existant :
 *
 *   npm run grant-admin -- prenom@exemple.fr
 *
 * Le rôle est écrit dans `app_metadata`, que seule la clé secrète peut
 * modifier — un client ne peut pas se l'attribuer depuis le navigateur. Depuis
 * que les comptes clients existent, être connecté ne suffit plus pour entrer
 * dans l'admin : sans ce rôle, la connexion à /admin est refusée.
 */
config({ path: ".env.local" });

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("Usage : npm run grant-admin -- <email>");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SECRET_KEY manquante — voir .env.example.");
}

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// L'API d'administration ne cherche pas par e-mail : on parcourt les pages.
let page = 1;
for (;;) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) throw error;

  const user = data.users.find((entry) => entry.email?.toLowerCase() === email);
  if (user) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { ...user.app_metadata, role: "admin" },
    });
    if (updateError) throw updateError;
    console.log(`Rôle admin donné à ${email}.`);
    process.exit(0);
  }

  if (data.users.length < 200) break;
  page += 1;
}

throw new Error(`Aucun compte pour ${email}.`);
