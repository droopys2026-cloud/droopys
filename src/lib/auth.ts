import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { isAdmin } from "@/lib/account/roles";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Autorisation. À appeler **dans chaque Server Action et chaque page**
 * protégée, pas seulement dans une mise en page : une mise en page protège ce
 * qu'elle rend, pas une action appelée directement — une Server Action est une
 * route publique comme une autre, son identifiant suffit à l'invoquer.
 *
 * Admin et client partagent Supabase Auth ; ce qui les distingue est le rôle
 * `app_metadata.role` (voir `@/lib/account/roles`). Être connecté ne vaut plus
 * être administrateur.
 */

/** Exige un administrateur. Un client connecté est renvoyé vers son compte. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/connexion");
  if (!isAdmin(user)) redirect("/compte");
  return user;
}

/**
 * Exige un client connecté, et garantit sa ligne `customers`.
 *
 * `next` est la page à retrouver après la connexion : sans lui, un client
 * renvoyé vers la connexion depuis « Mes adresses » atterrirait sur le
 * tableau de bord et devrait refaire le chemin.
 */
export async function requireCustomer(next = "/compte") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/compte/connexion?suite=${encodeURIComponent(next)}`);
  }
  const customer = await ensureCustomer(user);
  return { user, customer };
}

/**
 * Crée la ligne `customers` d'un utilisateur si elle manque, et la rend.
 *
 * Le prénom et le nom viennent des métadonnées posées à l'inscription, ou de
 * Google (`given_name`, `family_name`). `on conflict do nothing` : deux
 * requêtes simultanées à la première connexion ne doivent pas se battre.
 */
export async function ensureCustomer(user: User) {
  const meta = user.user_metadata ?? {};
  const firstName = pickString(meta.first_name, meta.given_name);
  const lastName = pickString(meta.last_name, meta.family_name);

  await db
    .insert(customers)
    .values({ id: user.id, firstName, lastName })
    .onConflictDoNothing();

  const customer = await db.query.customers.findFirst({
    where: (row, { eq }) => eq(row.id, user.id),
  });
  // La ligne vient d'être garantie : son absence est une panne, pas un cas.
  if (!customer) throw new Error(`Ligne client introuvable pour ${user.id}.`);
  return customer;
}

function pickString(...values: unknown[]): string {
  const found = values.find(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
  return found?.slice(0, 80) ?? "";
}
