import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { listCustomers } from "@/lib/queries/orders";

export const metadata: Metadata = { title: "Clients | Admin Droopy's" };

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

/**
 * Les clients, déduits des commandes.
 *
 * Il n'y a pas de table `clients` : tant que la boutique n'a pas de comptes,
 * un client **est** l'ensemble de ses commandes. Le tableau s'affiche même
 * vide, avec ses en-têtes : on voit alors ce qui sera suivi, au lieu d'un
 * encart qui n'annonce rien.
 */
export default async function AdminClientsPage() {
  await requireAdmin();

  const rows = await listCustomers();

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Clients"
        lead="Les personnes qui ont commandé, et ce qu'elles ont commandé."
      />

      <div className="admin-table-wrap">
        <p className="admin-field__hint">
          {rows.length} client{rows.length > 1 ? "s" : ""}
        </p>

        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Client</th>
              <th scope="col">E-mail</th>
              <th scope="col" className="admin-table__num">
                Commandes
              </th>
              <th scope="col" className="admin-table__num">
                Total dépensé
              </th>
              <th scope="col">Dernière commande</th>
              <th scope="col" className="admin-table__actions">
                <span className="sr-only">Commandes</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.email}>
                <th scope="row" className="admin-table__name">
                  {row.name}
                </th>
                <td className="admin-table__muted">{row.email}</td>
                <td className="admin-table__num">{row.orderCount}</td>
                <td className="admin-table__num">
                  {formatPrice(row.spentCents)}
                </td>
                <td className="admin-table__muted">
                  {new Date(row.lastOrderAt).toLocaleDateString(
                    "fr-FR",
                    DATE_FORMAT,
                  )}
                </td>
                <td className="admin-table__actions">
                  <Link
                    href={`/admin/commandes?q=${encodeURIComponent(row.email)}`}
                    className="admin-button admin-button--ghost admin-button--small"
                  >
                    Ses commandes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <AdminEmpty
          title="Aucun client"
          text="Un client apparaît ici à sa première commande. Les comptes en boutique viendront plus tard, sur le même écran."
        />
      )}
    </div>
  );
}
