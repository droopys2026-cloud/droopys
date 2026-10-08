import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { changeOrderStatus } from "@/app/admin/(back-office)/commandes/actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { markWithdrawalHandled } from "@/app/admin/(back-office)/commandes/actions";
import { OrderShipping } from "@/components/admin/order-shipping";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { requireAdmin } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { SERVICES } from "@/lib/shipping/services";
import { formatPrice } from "@/lib/format";
import { getOrder } from "@/lib/queries/orders";
import { ORDER_STATUSES } from "@/types/order";

type PageProps = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Commande | Admin Droopy's" };

export default async function AdminCommandePage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const placed = order.placedAt.toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // Le total se recalcule depuis les lignes figées : elles portent le prix
  // payé, pas le prix d'aujourd'hui.
  const itemsCents = order.lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );
  const totalCents = itemsCents + order.shippingCents;

  return (
    <div className="admin-page">
      <Link href="/admin/commandes" className="admin-back">
        <span aria-hidden>←</span> Retour aux commandes
      </Link>

      <AdminPageHeader
        title={`Commande ${order.reference}`}
        lead={`${placed} · ${order.payment}`}
      />
      <div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Une rétractation se voit avant tout le reste : elle change ce qu'il
          faut faire de la commande (ne pas expédier, ou attendre le retour). */}
      {order.withdrawals.map((withdrawal) => (
        <section key={withdrawal.id} className="admin-card" role="status">
          <h2 className="admin-card__title">
            {withdrawal.handledAt ? "Rétractation traitée" : "Rétractation demandée"}
          </h2>
          <p className="m-0">
            Reçue le{" "}
            {withdrawal.createdAt.toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "Europe/Paris",
            })}{" "}
            — {withdrawal.customerName} ({withdrawal.customerEmail})
          </p>
          <ul className="admin-field__hint m-0 list-disc pl-5">
            {withdrawal.items.map((item) => (
              <li key={item.lineId}>{item.label}</li>
            ))}
          </ul>
          {withdrawal.handledAt ? (
            <p className="admin-field__hint m-0">
              Traitée le {withdrawal.handledAt.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })}.
            </p>
          ) : (
            <form action={markWithdrawalHandled}>
              <input type="hidden" name="withdrawalId" value={withdrawal.id} />
              <input type="hidden" name="orderId" value={order.id} />
              <p className="admin-field__hint">
                Remboursez depuis Stripe (articles et livraison initiale) au plus
                tard 14 jours après la demande, puis marquez-la comme traitée.
              </p>
              <button type="submit" className="admin-button admin-button--ghost admin-button--small">
                Marquer comme traitée
              </button>
            </form>
          )}
        </section>
      ))}

      <div className="admin-columns">
        <section className="admin-card">
          <h2 className="admin-card__title">Articles</h2>
          <table className="admin-stock">
            <thead>
              <tr>
                <th scope="col">Article</th>
                <th scope="col">Taille</th>
                <th scope="col">Qté</th>
                <th scope="col">Prix</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line) => (
                <tr key={line.id}>
                  <td className="admin-stock__size">
                    {line.brand ? `${line.brand} — ` : ""}
                    {line.productName}
                  </td>
                  <td>{line.size}</td>
                  <td>{line.quantity}</td>
                  <td>{formatPrice(line.unitPriceCents * line.quantity)}</td>
                </tr>
              ))}
              <tr>
                <td className="admin-stock__size">Livraison</td>
                <td />
                <td />
                <td>
                  {order.shippingCents === 0
                    ? "Offerte"
                    : formatPrice(order.shippingCents)}
                </td>
              </tr>
              <tr>
                <td className="admin-stock__size">Total</td>
                <td />
                <td />
                <td className="admin-stock__size">
                  {formatPrice(totalCents)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <div className="admin-column">
          <section className="admin-card">
            <h2 className="admin-card__title">Client</h2>
            <p>{order.customerName}</p>
            <p className="admin-field__hint">{order.customerEmail}</p>
          </section>

          <section className="admin-card">
            <h2 className="admin-card__title">Livraison</h2>
            <address className="admin-address">
              {order.shippingAddress.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </section>

          {/* Changer l'état à la main reste nécessaire : une commande annulée
              au téléphone ou un retour reçu ne passent par aucun automatisme. */}
          <section className="admin-card">
            <h2 className="admin-card__title">État</h2>
            <div className="admin-filter__chips">
              {ORDER_STATUSES.map((entry) => (
                <form key={entry.id} action={changeOrderStatus}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="status" value={entry.id} />
                  <button
                    type="submit"
                    className="admin-chip"
                    aria-pressed={order.status === entry.id}
                  >
                    {entry.label}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <OrderShipping
            orderId={order.id}
            deliveryMethod={order.deliveryMethod}
            serviceLabel={
              SERVICES.find((service) => service.key === order.shippingService)?.label ??
              "Transporteur non précisé"
            }
            label={
              order.sendcloudParcelId
                ? {
                    trackingNumber: order.trackingNumber,
                    trackingUrl: order.trackingUrl,
                    isTest: order.labelIsTest ?? false,
                  }
                : null
            }
            testMode={serverEnv.SENDCLOUD_TEST_LABELS === "1"}
            homeServices={
              order.shippingService
                ? []
                : SERVICES.filter((service) => service.kind === "domicile").map(({ key, label }) => ({ key, label }))
            }
          />
        </div>
      </div>
    </div>
  );
}
