import type { Metadata } from "next";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WithdrawalForm } from "@/components/withdrawal/withdrawal-form";

export const metadata: Metadata = {
  title: "Se rétracter du contrat | Droopy's",
  description: "Exercer votre droit de rétractation sur une commande Droopy's.",
};

type PageProps = {
  searchParams: Promise<{ commande?: string | string[]; email?: string | string[] }>;
};

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.slice(0, 120) ?? "";

/**
 * Fonction de rétractation, accessible à tous et depuis toutes les pages
 * (lien du pied de page). Préremplie quand on vient d'une commande de
 * l'espace client ou de l'e-mail de confirmation.
 */
export default async function WithdrawalPage({ searchParams }: PageProps) {
  const { commande, email } = await searchParams;

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader />

      <main className="section-main min-h-[50vh]">
        <section className="container-page flex max-w-3xl flex-col gap-9 pt-9 pb-17">
          <h1 className="account-title">Se rétracter du contrat</h1>
          <p className="text-paragraph m-0">
            Vous disposez de 14 jours à compter de la réception de votre
            commande pour vous rétracter, sans avoir à vous justifier — Droopy&apos;s
            vous en accorde 30. Indiquez la commande concernée, choisissez les
            articles, puis confirmez : un accusé de réception vous est envoyé
            aussitôt par e-mail.
          </p>
          <WithdrawalForm prefill={{ name: "", email: one(email), reference: one(commande) }} />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
