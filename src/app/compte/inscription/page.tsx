import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/auth-shell";
import { GoogleButton } from "@/components/account/google-button";
import { SignUpForm } from "@/components/account/sign-up-form";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Créer un compte | Droopy's",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <AuthShell title="Créer un compte">
          <p className="text-paragraph m-0">
            Retrouvez vos commandes, vos adresses et vos favoris sur tous vos
            appareils. Le compte reste facultatif pour commander.
          </p>

          <GoogleButton />
          <p className="account-divider">ou</p>
          <SignUpForm />

          <p className="text-paragraph">
            Déjà client ?{" "}
            <Link href="/compte/connexion" className="link-underline-sm">
              Me connecter
            </Link>
          </p>
          <p className="text-caption-muted">
            En créant un compte, vous acceptez notre{" "}
            <Link href="/legal/confidentialite" className="link-underline-sm">
              politique de confidentialité
            </Link>
            .
          </p>
        </AuthShell>
      </main>

      <SiteFooter />
    </>
  );
}
