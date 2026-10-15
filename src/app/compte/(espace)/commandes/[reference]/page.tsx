import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CUSTOMER_STATUS_LABELS } from "@/components/account/order-status";
import { requireCustomer } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { inlineVariantLabel } from "@/lib/products/variants";
import { getCustomerOrder } from "@/lib/queries/customer-orders";

type PageProps = { params: Promise<{ reference: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { reference } = await params;
  return {
    title: `Commande ${reference} | Droopy's`,
    robots: { index: false, follow: false },
  };
}

export default async function CustomerOrderPage({ params }: PageProps) {
  const { reference } = await params;
  const { user } = await requireCustomer(`/compte/commandes/${reference}`);

  // La commande d'un autre client rend une 404, comme une commande
  // inexistante : rien ne doit dire que la référence existe.
  const order = await getCustomerOrder(user, reference);
  if (!order) notFound();

  const itemsCents = order.lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  return (
    <>
      <Link href="/compte/commandes" className="link-underline-sm self-start">
        ← Mes commandes
      </Link>

      <section className="account-section">
        <h2 className="account-title">Commande {order.reference}</h2>
        <p className="text-paragraph m-0">
          Passée le {formatDate(order.placedAt.toISOString())} ·{" "}
          <strong>{CUSTOMER_STATUS_LABELS[order.status]}</strong>
        </p>
        {order.trackingNumber && !order.labelIsTest && (
          <p className="text-paragraph m-0">
            Suivi du colis :{" "}
            {order.trackingUrl?.startsWith("https://") ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline-sm"
              >
                {order.trackingNumber}
              </a>
            ) : (
              order.trackingNumber
            )}
          </p>
        )}
      </section>

      <section className="account-section" aria-labelledby="articles">
        <h3 id="articles" className="account-subtitle">
          Articles
        </h3>
        <ul className="account-order__lines">
          {order.lines.map((line) => (
            <li key={line.id} className="account-order__line">
              <span>
                {line.brand && <span className="account-card__muted">{line.brand} — </span>}
                {line.productName} · {inlineVariantLabel(line)} · ×{line.quantity}
              </span>
              <span className="text-strong">
                {formatPrice(line.unitPriceCents * line.quantity)}
              </span>
            </li>
          ))}
          <li className="account-order__line">
            <span>Livraison</span>
            <span>
              {order.shippingCents === 0 ? "Offerte" : formatPrice(order.shippingCents)}
            </span>
          </li>
          <li className="account-order__line">
            <span className="text-strong">Total</span>
            <span className="text-strong">
              {formatPrice(itemsCents + order.shippingCents)}
            </span>
          </li>
        </ul>
      </section>

      <section className="account-cards">
        <div className="account-card">
          <span className="account-card__title">Livraison</span>
          <address className="not-italic">
            {order.customerName}
            {order.shippingAddress.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
        <div className="account-card">
          <span className="account-card__title">Paiement</span>
          <span>{order.payment}</span>
          <Link href="/aide/retours" className="link-underline-sm self-start">
            Retourner un article
          </Link>
          {/* Un vrai bouton, et non un lien discret : la fonction de
              rétractation doit sauter aux yeux (directive (UE) 2023/2673). */}
          <Link
            href={`/retractation?commande=${encodeURIComponent(order.reference)}&email=${encodeURIComponent(order.customerEmail)}`}
            className="account-button-outline mt-3 w-auto self-start"
          >
            Se rétracter du contrat ici
          </Link>
        </div>
      </section>
    </>
  );
}
