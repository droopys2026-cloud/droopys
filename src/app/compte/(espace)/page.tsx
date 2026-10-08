import type { Metadata } from "next";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { CUSTOMER_STATUS_LABELS } from "@/components/account/order-status";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { requireCustomer } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { listCustomerOrders } from "@/lib/queries/customer-orders";

export const metadata: Metadata = {
  title: "Mon compte | Droopy's",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ motDePasse?: string | string[] }> };

/** Tableau de bord : la dernière commande d'abord, c'est ce qu'on vient chercher. */
export default async function AccountDashboardPage({ searchParams }: PageProps) {
  const { user, customer } = await requireCustomer("/compte");
  const { motDePasse } = await searchParams;

  const [[lastOrder], [wishlist], defaultAddress] = await Promise.all([
    listCustomerOrders(user, 1),
    db
      .select({ total: count() })
      .from(wishlistItems)
      .where(eq(wishlistItems.customerId, customer.id)),
    db.query.customerAddresses.findFirst({
      where: (address, { and }) =>
        and(eq(address.customerId, customer.id), eq(address.isDefault, true)),
    }),
  ]);

  return (
    <>
      <section className="account-section">
        <h2 className="account-title">
          Bonjour{customer.firstName ? ` ${customer.firstName}` : ""}
        </h2>
        {motDePasse === "modifie" && (
          <p role="status" className="account-notice m-0">
            Votre mot de passe a bien été modifié.
          </p>
        )}
      </section>

      <section className="account-section" aria-labelledby="derniere-commande">
        <h3 id="derniere-commande" className="account-subtitle">
          Dernière commande
        </h3>
        {lastOrder ? (
          <div className="account-card">
            <span className="account-card__title">{lastOrder.reference}</span>
            <span className="account-card__muted">
              {formatDate(lastOrder.placedAt.toISOString())} ·{" "}
              {CUSTOMER_STATUS_LABELS[lastOrder.status]} ·{" "}
              {formatPrice(lastOrder.totalCents)}
            </span>
            <div className="account-card__actions">
              <Link
                href={`/compte/commandes/${lastOrder.reference}`}
                className="link-underline-sm"
              >
                Voir le détail
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-paragraph m-0">
            Aucune commande pour l&apos;instant.{" "}
            <Link href="/nouveautes" className="link-underline-sm">
              Voir les nouveautés
            </Link>
          </p>
        )}
      </section>

      <section className="account-cards" aria-label="Raccourcis">
        <Link href="/favoris" className="account-card account-card--link">
          <span className="account-card__title">Mes favoris</span>
          <span className="account-card__muted">
            {wishlist.total === 0
              ? "Aucune pièce mise de côté."
              : `${wishlist.total} pièce${wishlist.total > 1 ? "s" : ""} mise${wishlist.total > 1 ? "s" : ""} de côté.`}
          </span>
          <span className="account-card__cta">Voir mes favoris →</span>
        </Link>
        <Link href="/compte/adresses" className="account-card account-card--link">
          <span className="account-card__title">Mes adresses</span>
          <span className="account-card__muted">
            {defaultAddress
              ? `${defaultAddress.line1}, ${defaultAddress.postalCode} ${defaultAddress.city}`
              : "Aucune adresse enregistrée."}
          </span>
          <span className="account-card__cta">
            {defaultAddress ? "Gérer mes adresses →" : "Ajouter une adresse →"}
          </span>
        </Link>
        <Link href="/compte/profil" className="account-card account-card--link">
          <span className="account-card__title">Mon profil</span>
          <span className="account-card__muted">{user.email}</span>
          <span className="account-card__cta">Modifier mon profil →</span>
        </Link>
      </section>
    </>
  );
}
