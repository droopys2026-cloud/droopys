import type { Metadata } from "next";

import { LoginForm } from "@/app/admin/connexion/login-form";

export const metadata: Metadata = {
  title: "Connexion | Admin Droopy's",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Page de connexion.
 *
 * Elle vit hors du groupe `(back-office)` : la coquille de l'admin — barre
 * latérale, liens vers les commandes — n'a aucun sens tant qu'on n'est pas
 * identifié.
 */
export default async function LoginPage({ searchParams }: PageProps) {
  const raw = (await searchParams).suite;
  const suite = Array.isArray(raw) ? raw[0] : raw;

  return (
    <div className="admin-login">
      <div className="admin-login__panel">
        <p className="admin-login__brand">Droopy&apos;s</p>
        <h1 className="admin-login__title">Administration</h1>
        <LoginForm suite={suite} />
      </div>
    </div>
  );
}
