"use server";

import { redirect } from "next/navigation";
import { ensureCustomer } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/account/redirect";
import {
  emailField,
  issueMessages,
  passwordField,
  pickValues,
  type FormValues,
  signInSchema,
  signUpSchema,
} from "@/lib/account/schema";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeWishlistCookie } from "@/lib/wishlist/store";

/**
 * Connexion, inscription, mot de passe — côté client de la boutique.
 *
 * Règle commune : **ne jamais dire si une adresse est inscrite.** Un message
 * qui distingue « e-mail inconnu » de « mot de passe faux », ou un « aucun
 * compte à cette adresse » au mot de passe oublié, permet à n'importe qui de
 * tester une liste d'adresses. Les messages ci-dessous sont donc identiques
 * quel que soit le cas.
 *
 * Les tentatives répétées sont limitées par Supabase Auth lui-même.
 */

export type AuthFormState =
  | { status: "idle" }
  | { status: "error"; errors: string[]; values?: FormValues }
  /** E-mail envoyé : confirmation d'inscription ou lien de réinitialisation. */
  | { status: "sent" };

const CONFIRMATION_URL = `${publicEnv.NEXT_PUBLIC_SITE_URL}/compte/confirmation`;

const WRONG_CREDENTIALS = "Adresse e-mail ou mot de passe incorrect.";
const UNEXPECTED =
  "Une erreur est survenue. Réessayez dans un instant, ou écrivez-nous si elle persiste.";

/** Connexion par e-mail et mot de passe. */
export async function signInCustomer(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  const values = pickValues(formData, ["email"]);
  if (!parsed.success) return { status: "error", errors: [WRONG_CREDENTIALS], values };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Ce message-là peut être précis sans rien révéler : Supabase ne le rend
    // que si le mot de passe était juste.
    if (error.code === "email_not_confirmed") {
      return {
        status: "error",
        errors: [
          "Confirmez d'abord votre adresse : le lien vous a été envoyé par e-mail à l'inscription.",
        ],
        values,
      };
    }
    return { status: "error", errors: [WRONG_CREDENTIALS], values };
  }

  const customer = await ensureCustomer(data.user);
  await mergeWishlistCookie(customer.id);

  redirect(safeRedirectPath(formData.get("suite"), "/compte"));
}

/**
 * Inscription. Le compte n'est utilisable qu'après confirmation de l'adresse :
 * c'est elle qui autorise ensuite à voir les commandes passées en invité avec
 * cette adresse. Sans confirmation, s'inscrire avec l'e-mail d'un autre
 * suffirait à lire ses commandes.
 */
export async function signUpCustomer(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    firstName: formData.get("firstName") ?? "",
    lastName: formData.get("lastName") ?? "",
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  const values = pickValues(formData, ["firstName", "lastName", "email"]);
  if (!parsed.success) {
    return { status: "error", errors: issueMessages(parsed.error), values };
  }

  const { firstName, lastName, email, password } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: CONFIRMATION_URL,
      // Repris par `ensureCustomer` à la première connexion.
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) {
    if (error.code === "weak_password") {
      return {
        status: "error",
        errors: ["Ce mot de passe est trop faible : allongez-le ou variez les caractères."],
        values,
      };
    }
    // Une adresse déjà inscrite ne produit **pas** d'erreur chez Supabase
    // (il rend un faux utilisateur) : on arrive ici pour une vraie panne.
    console.error("Inscription refusée par Supabase :", error.code ?? error.message);
    return { status: "error", errors: [UNEXPECTED], values };
  }

  // Même écran que l'adresse soit nouvelle ou déjà inscrite — voir l'en-tête.
  return { status: "sent" };
}

/** Connexion avec Google : on part chez Google, on revient par la confirmation. */
export async function signInWithGoogle(formData: FormData) {
  const suite = safeRedirectPath(formData.get("suite"), "/compte");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${CONFIRMATION_URL}?suite=${encodeURIComponent(suite)}`,
    },
  });

  if (error || !data.url) {
    console.error("Connexion Google indisponible :", error?.code ?? "url absente");
    redirect("/compte/connexion?erreur=google");
  }
  redirect(data.url);
}

/** Envoie le lien de réinitialisation. Réponse identique que l'adresse existe ou non. */
export async function requestPasswordReset(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = emailField.safeParse(formData.get("email") ?? "");
  if (!parsed.success) {
    return {
      status: "error",
      errors: issueMessages(parsed.error),
      values: pickValues(formData, ["email"]),
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${CONFIRMATION_URL}?suite=${encodeURIComponent("/compte/nouveau-mot-de-passe")}`,
  });
  // Une erreur ici (quota d'envoi, panne) ne doit pas trahir l'existence du
  // compte : on la journalise et on répond comme si tout allait bien.
  if (error) console.error("Réinitialisation non envoyée :", error.code ?? error.message);

  return { status: "sent" };
}

/**
 * Nouveau mot de passe, depuis la session ouverte par le lien de
 * réinitialisation — ou depuis le profil, pour un client connecté.
 */
export async function updatePassword(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = passwordField.safeParse(formData.get("password") ?? "");
  if (!parsed.success) {
    return { status: "error", errors: issueMessages(parsed.error) };
  }
  if (formData.get("confirmation") !== parsed.data) {
    return { status: "error", errors: ["Les deux mots de passe ne correspondent pas."] };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      status: "error",
      errors: ["Ce lien a expiré. Demandez-en un nouveau depuis « Mot de passe oublié »."],
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) {
    if (error.code === "same_password") {
      return { status: "error", errors: ["Choisissez un mot de passe différent de l'ancien."] };
    }
    if (error.code === "weak_password") {
      return { status: "error", errors: ["Ce mot de passe est trop faible."] };
    }
    console.error("Mot de passe non modifié :", error.code ?? error.message);
    return { status: "error", errors: [UNEXPECTED] };
  }

  redirect(safeRedirectPath(formData.get("suite"), "/compte?motDePasse=modifie"));
}

export async function signOutCustomer() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
