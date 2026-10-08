import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/account/auth-shell";
import { FormAlert } from "@/components/account/form-alert";
import { GoogleButton } from "@/components/account/google-button";
import { SignInForm } from "@/components/account/sign-in-form";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { safeRedirectPath } from "@/lib/account/redirect";

export const metadata: Metadata = {
  title: "Connexion | Droopy's",
  robots: { index: false, follow: false },
};

/** Messages portés par `?erreur=` quand on revient ici après un échec. */
const ERRORS: Record<string, string> = {
  lien: "Ce lien a expiré ou a déjà servi. Connectez-vous, ou demandez un nouveau lien depuis « Mot de passe oublié ».",
  google: "La connexion avec Google est indisponible pour le moment. Utilisez votre e-mail, ou réessayez plus tard.",
};

type PageProps = {
  searchParams: Promise<{ suite?: string | string[]; erreur?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { suite, erreur } = await searchParams;
  // `suite` repasse par le même filtre que dans l'action : il est relu ici
  // pour être recopié dans le formulaire, pas pour être cru.
  const target = safeRedirectPath(suite, "/compte");
  const error = typeof erreur === "string" ? ERRORS[erreur] : undefined;

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <AuthShell title="Me connecter">
          {error && <FormAlert errors={[error]} />}
          <SignInForm suite={target} />

          <div className="account-auth__links">
            <Link href="/compte/mot-de-passe-oublie" className="link-underline-sm">
              Mot de passe oublié ?
            </Link>
          </div>

          <p className="account-divider">ou</p>
          <GoogleButton suite={target} />

          <p className="text-paragraph">
            Pas encore de compte ?{" "}
            <Link href="/compte/inscription" className="link-underline-sm">
              Créer un compte
            </Link>
          </p>
          <p className="text-caption-muted">
            Vous avez commandé sans compte ?{" "}
            <Link href="/suivi-commande" className="link-underline-sm">
              Suivre une commande
            </Link>
          </p>
        </AuthShell>
      </main>

      <SiteFooter />
    </>
  );
}
