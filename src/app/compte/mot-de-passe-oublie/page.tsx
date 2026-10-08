import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/auth-shell";
import { ForgotPasswordForm } from "@/components/account/forgot-password-form";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Mot de passe oublié | Droopy's",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <AuthShell title="Mot de passe oublié">
          <p className="text-paragraph m-0">
            Indiquez l&apos;adresse de votre compte : nous vous envoyons un lien
            pour choisir un nouveau mot de passe.
          </p>
          <ForgotPasswordForm />
          <Link href="/compte/connexion" className="link-underline-sm self-start">
            Retour à la connexion
          </Link>
        </AuthShell>
      </main>

      <SiteFooter />
    </>
  );
}
