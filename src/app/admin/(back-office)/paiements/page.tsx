import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import {
  getBalance,
  getMonthSummary,
  listPayouts,
  listRecentPayments,
  stripeDashboardUrl,
  type PaymentRow,
} from "@/lib/queries/payments";

export const metadata: Metadata = { title: "Paiements | Admin Droopy's" };

const DATE: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
};
const DAY: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", timeZone: "Europe/Paris" };

const STATUS: Record<PaymentRow["status"], { label: string; live: boolean }> = {
  paye: { label: "Payé", live: true },
  partiel: { label: "Remboursé en partie", live: false },
  rembourse: { label: "Remboursé", live: false },
  "en-attente": { label: "En attente", live: false },
};

const METHODS: Record<string, string> = {
  card: "Carte",
  klarna: "Klarna",
  bancontact: "Bancontact",
  eps: "EPS",
  link: "Link",
};

const PAYOUT_STATUS: Record<string, string> = {
  paid: "Versé",
  pending: "Prévu",
  in_transit: "En cours",
  failed: "Échoué",
  canceled: "Annulé",
};

/**
 * L'argent de la boutique, lu chez Stripe : solde, chiffres du mois, derniers
 * paiements, virements vers la banque. Les remboursements se font dans le
 * tableau de bord Stripe, vers lequel chaque ligne renvoie — les refaire ici
 * dupliquerait un outil qui existe et qui fait foi.
 */
export default async function AdminPaymentsPage() {
  await requireAdmin();

  // `allSettled` : une panne Stripe n'efface pas la page entière, chaque bloc
  // dit ce qu'il n'a pas pu lire.
  const [balance, month, payments, payouts] = await Promise.allSettled([
    getBalance(),
    getMonthSummary(),
    listRecentPayments(),
    listPayouts(),
  ]);
  for (const result of [balance, month, payments, payouts]) {
    if (result.status === "rejected") console.error("Lecture Stripe impossible :", result.reason);
  }

  const unreadable = "Indisponible";

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Paiements"
        lead="Lu en direct chez Stripe. Les remboursements se font depuis le tableau de bord Stripe."
      />

      <ul className="admin-tiles">
        <li className="admin-tile">
          <span className="admin-tile__label">Solde disponible</span>
          <span className="admin-tile__value">
            {balance.status === "fulfilled" ? formatPrice(balance.value.availableCents) : unreadable}
          </span>
          <span className="admin-tile__hint">Prêt à être viré sur votre compte</span>
        </li>
        <li className="admin-tile">
          <span className="admin-tile__label">En attente</span>
          <span className="admin-tile__value">
            {balance.status === "fulfilled" ? formatPrice(balance.value.pendingCents) : unreadable}
          </span>
          <span className="admin-tile__hint">Paiements récents, pas encore disponibles</span>
        </li>
        <li className="admin-tile">
          <span className="admin-tile__label">Encaissé ce mois</span>
          <span className="admin-tile__value">
            {month.status === "fulfilled" ? formatPrice(month.value.grossCents) : unreadable}
          </span>
          <span className="admin-tile__hint">
            {month.status === "fulfilled"
              ? `${month.value.paymentCount} paiement${month.value.paymentCount > 1 ? "s" : ""}`
              : "—"}
          </span>
        </li>
        <li className="admin-tile">
          <span className="admin-tile__label">Net ce mois</span>
          <span className="admin-tile__value">
            {month.status === "fulfilled" ? formatPrice(month.value.netCents) : unreadable}
          </span>
          <span className="admin-tile__hint">
            {month.status === "fulfilled"
              ? `Frais Stripe ${formatPrice(month.value.feesCents)} · remboursé ${formatPrice(month.value.refundedCents)}`
              : "—"}
          </span>
        </li>
      </ul>

      <section className="admin-table-wrap" aria-labelledby="derniers-paiements">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 id="derniers-paiements" className="admin-card__title">Derniers paiements</h2>
          <a
            href={stripeDashboardUrl("/payments")}
            target="_blank"
            rel="noreferrer noopener"
            className="admin-button admin-button--ghost admin-button--small"
          >
            Ouvrir Stripe
          </a>
        </div>

        {payments.status === "rejected" ? (
          <p className="admin-field__hint">Stripe n&apos;a pas répondu. Rechargez la page dans un instant.</p>
        ) : payments.value.length === 0 ? (
          <AdminEmpty title="Aucun paiement" text="Les paiements du tunnel de commande apparaîtront ici." />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Cliente</th>
                <th scope="col">Moyen</th>
                <th scope="col">État</th>
                <th scope="col">Commande</th>
                <th scope="col" className="admin-table__num">Montant</th>
              </tr>
            </thead>
            <tbody>
              {payments.value.map((payment) => (
                <tr key={payment.sessionId}>
                  <td className="admin-table__muted">
                    {payment.createdAt.toLocaleString("fr-FR", DATE)}
                  </td>
                  <th scope="row" className="admin-table__name">{payment.email ?? "—"}</th>
                  <td className="admin-table__muted">
                    {payment.method ? (METHODS[payment.method] ?? payment.method) : "—"}
                  </td>
                  <td>
                    <span className={`admin-badge ${STATUS[payment.status].live ? "admin-badge--live" : ""}`}>
                      {STATUS[payment.status].label}
                    </span>
                  </td>
                  <td>
                    {payment.orderReference ? (
                      <Link
                        href={`/admin/commandes?q=${encodeURIComponent(payment.orderReference)}`}
                        className="admin-row__link"
                      >
                        {payment.orderReference}
                      </Link>
                    ) : (
                      // Payé sans commande : le webhook n'a pas tourné. À
                      // vérifier — c'est de l'argent reçu sans colis préparé.
                      <span className="admin-badge" title="Paiement reçu sans commande : vérifier le webhook Stripe.">
                        Sans commande
                      </span>
                    )}
                  </td>
                  <td className="admin-table__num">
                    {formatPrice(payment.amountCents)}
                    {payment.refundedCents > 0 && (
                      <span className="admin-table__muted block">
                        −{formatPrice(payment.refundedCents)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-table-wrap" aria-labelledby="virements">
        <h2 id="virements" className="admin-card__title">Virements vers votre banque</h2>
        {payouts.status === "rejected" ? (
          <p className="admin-field__hint">Stripe n&apos;a pas répondu.</p>
        ) : payouts.value.length === 0 ? (
          <p className="admin-field__hint">
            Aucun virement pour l&apos;instant. Stripe vire le solde disponible
            selon le calendrier réglé dans son tableau de bord.
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Arrivée</th>
                <th scope="col">État</th>
                <th scope="col" className="admin-table__num">Montant</th>
              </tr>
            </thead>
            <tbody>
              {payouts.value.map((payout) => (
                <tr key={payout.id}>
                  <th scope="row" className="admin-table__name">
                    {payout.arrivalDate.toLocaleDateString("fr-FR", DAY)}
                  </th>
                  <td className="admin-table__muted">{PAYOUT_STATUS[payout.status] ?? payout.status}</td>
                  <td className="admin-table__num">{formatPrice(payout.amountCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
