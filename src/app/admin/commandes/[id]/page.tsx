import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderShipping } from "@/components/admin/order-shipping";
import { formatPrice } from "@/lib/format";
import { DEMO_ORDER } from "@/lib/placeholder-data";
import { orderTotalCents, statusLabel } from "@/types/order";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [{ id: DEMO_ORDER.id }];
}

export const metadata: Metadata = { title: "Commande | Admin Droopys" };

export default async function AdminCommandePage({ params }: PageProps) {
  const { id } = await params;

  // Une seule commande existe tant que la base n'est pas branchée.
  if (id !== DEMO_ORDER.id) notFound();
  const order = DEMO_ORDER;

  const placed = new Date(order.placedAt).toLocaleString("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="admin-page">
      <Link href="/admin/commandes" className="admin-back">
        <span aria-hidden>←</span> Retour aux commandes
      </Link>

      <AdminPageHeader
        title={`Commande ${order.reference}`}
        lead={`${placed} · ${statusLabel(order.status)} · ${order.payment}`}
      />

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
                <tr key={`${line.productName}-${line.size}`}>
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
                  {formatPrice(orderTotalCents(order))}
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

          <OrderShipping reference={order.reference} />
        </div>
      </div>
    </div>
  );
}
