import "server-only";

import { sql } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { renderAccountEmail, type AccountEmail } from "@/lib/email/account-emails";
import { publicEnv, serverEnv } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Liens d'inscription et de mot de passe oublié, envoyés par la boutique.
 *
 * Supabase fabrique le lien sécurisé (`generateLink`) **sans rien envoyer** ;
 * la boutique l'envoie elle-même par Resend, en français. L'envoi de
 * Supabase plafonne à deux e-mails par heure et ne part qu'aux membres de
 * l'équipe tant qu'aucun SMTP n'est réglé — inutilisable pour des clientes.
 *
 * Le lien pointe directement sur `/compte/confirmation?token_hash=…&type=…` :
 * il marche quel que soit l'appareil où on l'ouvre, et ne dépend pas de la
 * liste d'adresses de redirection réglée dans Supabase.
 *
 * Deux garde-fous, puisque c'est désormais la boutique qui envoie :
 * - **une fois par minute et par adresse** au plus, d'après la date d'envoi
 *   que Supabase tient à jour : le formulaire ne sert pas à inonder une
 *   boîte ;
 * - **rien ne trahit l'existence d'un compte** : adresse inconnue, déjà
 *   inscrite ou envoi trop rapproché donnent la même réponse à l'écran.
 */

const RESEND_DELAY_SECONDS = 60;

type Column = "confirmation_sent_at" | "recovery_sent_at";

/** Vrai si un lien du même type est parti vers cette adresse il y a moins d'une minute. */
async function sentRecently(email: string, column: Column): Promise<boolean> {
  // Lecture directe de `auth.users` : l'API d'administration ne cherche pas
  // un compte par e-mail. Le nom de colonne vient du type ci-dessus, jamais
  // d'une saisie.
  const rows = await db.execute<{ recent: boolean }>(sql`
    select coalesce(${sql.raw(column)} > now() - make_interval(secs => ${RESEND_DELAY_SECONDS}), false) as recent
    from auth.users where lower(email) = lower(${email}) limit 1
  `);
  return rows[0]?.recent === true;
}

function confirmationLink(hashedToken: string, type: "signup" | "recovery"): string {
  const params = new URLSearchParams({ token_hash: hashedToken, type });
  return `${publicEnv.NEXT_PUBLIC_SITE_URL}/compte/confirmation?${params}`;
}

async function send(to: string, email: AccountEmail): Promise<void> {
  if (!serverEnv.RESEND_API_KEY || !serverEnv.EMAIL_FROM) {
    throw new Error("RESEND_API_KEY ou EMAIL_FROM absente : e-mail du compte non envoyé.");
  }
  const content = renderAccountEmail(email);
  const { error } = await new Resend(serverEnv.RESEND_API_KEY).emails.send({
    from: serverEnv.EMAIL_FROM,
    to: [to],
    subject: content.subject,
    html: content.html,
    text: content.text,
  });
  if (error) throw new Error(`Resend a refusé l'e-mail du compte : ${error.message}`);
}

export type SignupResult = { status: "sent" } | { status: "weak-password" };

/**
 * Crée le compte (non confirmé) et envoie le lien de confirmation. Une
 * adresse déjà inscrite et confirmée ne reçoit rien : même réponse à l'écran.
 */
export async function sendSignupConfirmation(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<SignupResult> {
  if (await sentRecently(input.email, "confirmation_sent_at")) return { status: "sent" };

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email: input.email,
    password: input.password,
    // Repris par `ensureCustomer` à la première connexion.
    options: { data: { first_name: input.firstName, last_name: input.lastName } },
  });

  if (error) {
    if (error.code === "weak_password") return { status: "weak-password" };
    if (error.code === "email_exists") return { status: "sent" };
    throw new Error(`Lien d'inscription refusé par Supabase : ${error.code ?? error.message}`);
  }

  await send(input.email, {
    kind: "confirm",
    firstName: input.firstName,
    link: confirmationLink(data.properties.hashed_token, "signup"),
  });
  return { status: "sent" };
}

/** Envoie le lien de nouveau mot de passe, si l'adresse a un compte. */
export async function sendPasswordReset(email: string): Promise<void> {
  if (await sentRecently(email, "recovery_sent_at")) return;

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({ type: "recovery", email });
  if (error) {
    // Adresse sans compte : rien à envoyer, et rien à dire.
    if (error.code === "user_not_found") return;
    throw new Error(`Lien de réinitialisation refusé par Supabase : ${error.code ?? error.message}`);
  }

  await send(email, { kind: "reset", link: confirmationLink(data.properties.hashed_token, "recovery") });
}
