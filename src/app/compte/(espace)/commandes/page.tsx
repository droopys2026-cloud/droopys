import type { Metadata } from "next";
import Link from "next/link";
import { CUSTOMER_STATUS_LABELS } from "@/components/account/order-status";
import { requireCustomer } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { listCustomerOrders } from "@/lib/queries/customer-orders";

export const metadata: Metadata = {
  title: "Mes commandes | Droopy's",
  robots: { index: false, follow: false },
};

export default async function CustomerOrdersPage() {
  const { user } = await requireCustomer("/compte/commandes");
  const orders = await listCustomerOrders(user);

  return (
    <section className="account-section">
      <h2 className="account-title">Mes commandes</h2>

      {orders.length === 0 ? (
        <p className="text-paragraph m-0">
          Aucune commande pour l&apos;instant. Les commandes passées sans compte
          avec l&apos;adresse {user.email} apparaissent ici aussi.
        </p>
      ) : (
        <ul className="account-orders">
          {orders.map((order) => (
            <li key={order.reference} className="account-order">
              <Link
                href={`/compte/commandes/${order.reference}`}
                className="link-underline-sm"
              >
                {order.reference}
              </Link>
              <span className="text-strong">{formatPrice(order.totalCents)}</span>
              <span className="account-card__muted">
                {formatDate(order.placedAt.toISOString())} · {order.lineCount}{" "}
                article{order.lineCount > 1 ? "s" : ""}
              </span>
              <span>{CUSTOMER_STATUS_LABELS[order.status]}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
