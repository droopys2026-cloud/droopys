import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

/**
 * Crée ou remet à jour le compte d'administration.
 *
 *   npx tsx scripts/admin-user.mts <email> <mot-de-passe>
 *
 * Le compte est marqué comme vérifié d'office : il n'y a pas de boîte mail à
 * consulter tant qu'aucun expéditeur n'est configuré côté Supabase, et un
 * compte administrateur bloqué sur un lien de confirmation jamais reçu est le
 * genre d'impasse qui coûte une soirée.
 */
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  throw new Error(
    "Usage : npx tsx scripts/admin-user.mts <email> <mot-de-passe>",
  );
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Configuration Supabase incomplète — voir .env.example.");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing, error: listError } =
  await supabase.auth.admin.listUsers();
if (listError) throw listError;

const found = existing.users.find((user) => user.email === email);

if (found) {
  const { error } = await supabase.auth.admin.updateUserById(found.id, {
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Mot de passe mis à jour pour ${email}.`);
} else {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Compte d'administration créé : ${email}.`);
}
