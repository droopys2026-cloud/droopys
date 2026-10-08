"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdmin } from "@/lib/account/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Connexion à l'administration.
 *
 * Le message d'erreur reste volontairement identique pour un e-mail inconnu
 * et pour un mot de passe faux : distinguer les deux dirait à un inconnu
 * quelles adresses existent.
 */
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginState = { error?: string };

export async function signIn(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Adresse e-mail ou mot de passe invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Adresse e-mail ou mot de passe invalide." };

  // Un compte client a de bons identifiants mais aucun droit ici. On referme
  // sa session et on répond le même message : dire « vous n'êtes pas admin »
  // confirmerait que le couple e-mail / mot de passe est juste.
  if (!isAdmin(data.user)) {
    await supabase.auth.signOut();
    return { error: "Adresse e-mail ou mot de passe invalide." };
  }

  const suite = formData.get("suite");
  // On ne suit que les chemins internes : un « suite » pointant vers un autre
  // site transformerait la page de connexion en tremplin de redirection.
  const target =
    typeof suite === "string" && suite.startsWith("/admin") ? suite : "/admin";
  redirect(target);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/connexion");
}
