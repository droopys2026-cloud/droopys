import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { ensureCustomer } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/account/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeWishlistCookie } from "@/lib/wishlist/store";

/**
 * Point d'arrivée de tous les liens d'authentification : confirmation
 * d'inscription, retour de Google, lien de réinitialisation.
 *
 * Deux formes arrivent ici selon le modèle d'e-mail réglé dans Supabase :
 *
 * - `?code=…` — flux PKCE, celui des liens par défaut et de Google. Le code
 *   s'échange contre une session grâce au vérificateur rangé en cookie au
 *   départ : il ne marche donc que dans le navigateur qui a fait la demande.
 * - `?token_hash=…&type=…` — modèle d'e-mail personnalisé. Fonctionne même
 *   si le lien est ouvert sur un autre appareil que celui de l'inscription.
 *
 * Un lien expiré ou déjà utilisé renvoie vers la connexion avec un message,
 * jamais vers une page d'erreur brute.
 */
const OTP_TYPES = new Set<string>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function isOtpType(value: string | null): value is EmailOtpType {
  return value !== null && OTP_TYPES.has(value);
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  // Le lien de réinitialisation mène toujours au formulaire du nouveau mot de
  // passe, quel que soit le `suite` qu'il porte.
  const fallback =
    type === "recovery" ? "/compte/nouveau-mot-de-passe" : "/compte";
  const suite = safeRedirectPath(searchParams.get("suite"), fallback);

  const supabase = await createSupabaseServerClient();
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
    if (error) console.error("Échange de code refusé :", error.code ?? error.message);
  } else if (tokenHash && isOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    failed = Boolean(error);
    if (error) console.error("Lien e-mail refusé :", error.code ?? error.message);
  }

  if (failed) {
    return NextResponse.redirect(`${origin}/compte/connexion?erreur=lien`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const customer = await ensureCustomer(user);
    await mergeWishlistCookie(customer.id);
  }

  return NextResponse.redirect(`${origin}${suite}`);
}
