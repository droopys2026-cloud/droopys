"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { requireCustomer } from "@/lib/auth";
import {
  emailField,
  issueMessages,
  pickValues,
  profileSchema,
  type FormValues,
} from "@/lib/account/schema";
import { publicEnv } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ProfileFormState =
  | { status: "idle" }
  | { status: "error"; errors: string[]; values: FormValues }
  | { status: "saved"; message: string };

const PATH = "/compte/profil";

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { customer } = await requireCustomer(PATH);

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName") ?? "",
    lastName: formData.get("lastName") ?? "",
  });
  if (!parsed.success) {
    return {
      status: "error",
      errors: issueMessages(parsed.error),
      values: pickValues(formData, ["firstName", "lastName"]),
    };
  }

  await db.update(customers).set(parsed.data).where(eq(customers.id, customer.id));
  revalidatePath("/compte", "layout");
  return { status: "saved", message: "Vos informations sont enregistrées." };
}

/**
 * Changement d'adresse e-mail. Supabase n'applique le changement qu'une fois
 * la **nouvelle** adresse confirmée par lien : on ne peut pas détourner un
 * compte vers une boîte qu'on ne lit pas.
 */
export async function updateEmail(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { user } = await requireCustomer(PATH);

  const parsed = emailField.safeParse(formData.get("email") ?? "");
  const values = pickValues(formData, ["email"]);
  if (!parsed.success) {
    return { status: "error", errors: issueMessages(parsed.error), values };
  }
  if (parsed.data === user.email) {
    return { status: "error", errors: ["C'est déjà l'adresse de votre compte."], values };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser(
    { email: parsed.data },
    { emailRedirectTo: `${publicEnv.NEXT_PUBLIC_SITE_URL}/compte/confirmation?suite=${encodeURIComponent(PATH)}` },
  );
  if (error) {
    console.error("Changement d'e-mail refusé :", error.code ?? error.message);
    return {
      status: "error",
      errors: ["Impossible de changer d'adresse pour le moment. Réessayez plus tard."],
      values,
    };
  }

  return {
    status: "saved",
    message: `Un lien de confirmation vient de partir vers ${parsed.data}. Le changement prendra effet une fois ce lien ouvert.`,
  };
}

/**
 * Suppression du compte : identité Supabase, profil, adresses et favoris.
 *
 * Les commandes restent — ce sont des pièces comptables à conserver dix ans —
 * mais perdent leur lien au compte (`customer_id` passe à null par la clé
 * étrangère). La confirmation est demandée à l'écran par une case à cocher.
 */
export async function deleteAccount(formData: FormData) {
  const { user, customer } = await requireCustomer(PATH);
  if (formData.get("confirmation") !== "on") return;

  // Supabase d'abord : si la suppression d'identité échoue, le client garde
  // un compte complet plutôt qu'une identité sans profil.
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
  if (error) throw new Error(`Suppression du compte refusée : ${error.code ?? error.message}`);

  await db.delete(customers).where(eq(customers.id, customer.id));

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/?compte=supprime");
}
