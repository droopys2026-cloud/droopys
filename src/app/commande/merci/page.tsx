import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClearCartOnMount } from "@/components/sections/clear-cart";
import { formatPrice } from "@/lib/format";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Merci pour votre commande | Droopy's",
  // Page de confirmation, propre à une commande : rien à indexer.
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Confirmation de commande.
 *
 * Elle **lit** la session chez Stripe pour afficher le montant et l'e-mail,
 * mais elle n'enregistre rien : la commande est créée par le webhook, seul
 * témoin fiable du paiement. Un client qui ferme l'onglet avant d'arriver ici
 * a quand même sa commande ; un curieux qui forge l'adresse n'en obtient pas.
 */
export default async function ThankYouPage({ searchParams }: PageProps) {
  const raw = (await searchParams).session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;
  if (!sessionId) redirect("/");

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const paid = session.payment_status === "paid";

  // La commande est créée par le webhook, parfois une seconde après l'arrivée
  // ici : trouvée, son numéro préremplit le formulaire de rétractation ; sinon
  // la cliente le saisit, il est dans l'e-mail de confirmation.
  const order = paid
    ? await db.query.orders.findFirst({
        where: eq(orders.stripeSessionId, session.id),
        columns: { reference: true },
      })
    : undefined;
  const withdrawalParams = new URLSearchParams();
  if (order) withdrawalParams.set("commande", order.reference);
  if (session.customer_details?.email) withdrawalParams.set("email", session.customer_details.email);
  const withdrawalHref = `/retractation${withdrawalParams.size > 0 ? `?${withdrawalParams}` : ""}`;

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader />

      <main className="section-main min-h-[50vh]">
        <section className="container-page flex flex-col items-center gap-9 py-17 text-center">
          <h1 className="heading-h2 pt-0">
            {paid ? "Merci pour votre commande" : "Paiement en cours de validation"}
          </h1>

          {paid ? (
            <>
              {/* Le panier n'est vidé qu'une fois le paiement confirmé : un
                  paiement refusé doit laisser au client ce qu'il avait choisi. */}
              <ClearCartOnMount />

              <p className="text-paragraph m-0 max-w-lg">
                Un e-mail de confirmation part à{" "}
                <b>{session.customer_details?.email}</b>. Nous préparons votre
                colis et vous recevrez le numéro de suivi à l&apos;expédition.
              </p>

              <p className="text-strong m-0">
                Total réglé : {formatPrice(session.amount_total ?? 0)}
              </p>

              {/* La fonction de rétractation doit être facile à trouver
                  (directive (UE) 2023/2673) : elle est aussi en pied de page
                  et sur la commande dans l'espace client. */}
              <p className="text-paragraph m-0 max-w-lg">
                Vous changez d&apos;avis ? Vous avez 14 jours après réception
                pour vous rétracter.
              </p>
              <Link href={withdrawalHref} className="account-button-outline w-auto">
                Se rétracter du contrat ici
              </Link>
            </>
          ) : (
            <p className="text-paragraph m-0 max-w-lg">
              Votre banque n&apos;a pas encore confirmé le paiement. Vous
              recevrez un e-mail dès qu&apos;il sera validé — inutile de
              recommencer la commande.
            </p>
          )}

          <Link href="/" className="link-cta-block">
            Continuer mes achats
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
