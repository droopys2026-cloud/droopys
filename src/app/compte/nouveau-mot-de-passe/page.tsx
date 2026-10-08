import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/auth-shell";
import { FormAlert } from "@/components/account/form-alert";
import { NewPasswordForm } from "@/components/account/new-password-form";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nouveau mot de passe | Droopy's",
  robots: { index: false, follow: false },
};

/**
 * Atteinte par le lien de réinitialisation, qui a déjà ouvert une session de
 * récupération (`/compte/confirmation`). Sans session, le lien a expiré :
 * on le dit au lieu d'afficher un formulaire qui échouerait à l'envoi.
 */
export default async function NewPasswordPage() {
  const user = await getCurrentUser();

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <AuthShell title="Nouveau mot de passe">
          {user ? (
            <NewPasswordForm suite="/compte?motDePasse=modifie" />
          ) : (
            <>
              <FormAlert
                errors={["Ce lien a expiré ou a déjà servi. Demandez-en un nouveau."]}
              />
              <Link href="/compte/mot-de-passe-oublie" className="link-underline-sm self-start">
                Mot de passe oublié
              </Link>
            </>
          )}
        </AuthShell>
      </main>

      <SiteFooter />
    </>
  );
}
