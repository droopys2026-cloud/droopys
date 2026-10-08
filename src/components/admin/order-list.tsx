import Link from "next/link";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconSearch } from "@/components/admin/admin-icons";
import { formatPrice } from "@/lib/format";
import type { OrderFilters, OrderRow } from "@/lib/queries/orders";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { ORDER_STATUSES, statusLabel } from "@/types/order";

/**
 * Commandes, en tableau.
 *
 * Le tri par état est le geste quotidien — « qu'est-ce que j'expédie
 * aujourd'hui ? » — donc il vient avant la recherche. Il vit dans l'URL : la
 * liste « à préparer » se met en favori, et c'est celle qu'on ouvre le matin.
 */
function href(filters: OrderFilters, patch: OrderFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...filters, ...patch })) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/admin/commandes?${query}` : "/admin/commandes";
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

export function OrderList({
  rows,
  filters,
  counts,
}: {
  rows: OrderRow[];
  filters: OrderFilters;
  counts: Map<string, number>;
}) {
  const narrowed = Boolean(filters.etat || filters.q);

  return (
    <div className="admin-filters">
      <div className="admin-filter">
        <span className="admin-filter__label">État</span>
        <div className="admin-filter__chips">
          <Link
            href={href(filters, { etat: undefined })}
            className="admin-chip"
            aria-current={!filters.etat ? "true" : undefined}
          >
            Toutes
          </Link>
          {ORDER_STATUSES.map((entry) => {
            const chosen = filters.etat === entry.id;
            const total = counts.get(entry.id) ?? 0;
            return (
              <Link
                key={entry.id}
                href={href(filters, { etat: chosen ? undefined : entry.id })}
                className="admin-chip"
                aria-current={chosen ? "true" : undefined}
              >
                {entry.label}
                {total > 0 && ` (${total})`}
              </Link>
            );
          })}
        </div>
      </div>

      <form action="/admin/commandes" method="get" role="search">
        {filters.etat && (
          <input type="hidden" name="etat" value={filters.etat} />
        )}
        <div className="admin-search">
          <span className="admin-search__icon" aria-hidden>
            <IconSearch />
          </span>
          <label className="sr-only" htmlFor="recherche-commande">
            Rechercher une commande
          </label>
          <input
            id="recherche-commande"
            name="q"
            type="search"
            className="admin-field__input admin-search__input"
            placeholder="Numéro de commande, nom ou e-mail…"
            defaultValue={filters.q ?? ""}
          />
        </div>
      </form>

      {rows.length === 0 ? (
        <AdminEmpty
          title={
            filters.q
              ? `Aucune commande pour « ${filters.q} »`
              : filters.etat
                ? `Aucune commande « ${statusLabel(filters.etat as never).toLowerCase()} »`
                : "Aucune commande"
          }
          text={
            narrowed
              ? "Élargissez le tri pour voir les autres commandes."
              : "Les commandes s'afficheront ici dès la première vente."
          }
        />
      ) : (
        <div className="admin-table-wrap">
          <p className="admin-field__hint">
            {rows.length} commande{rows.length > 1 ? "s" : ""}
          </p>

          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Numéro</th>
                <th scope="col">Date</th>
                <th scope="col">Client</th>
                <th scope="col" className="admin-table__num">
                  Articles
                </th>
                <th scope="col" className="admin-table__num">
                  Total
                </th>
                <th scope="col">Paiement</th>
                <th scope="col">État</th>
                <th scope="col" className="admin-table__actions">
                  <span className="sr-only">Ouvrir</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className="admin-table__name">
                    <Link href={`/admin/commandes/${row.id}`}>
                      {row.reference}
                    </Link>
                  </th>
                  <td className="admin-table__muted">
                    {row.placedAt.toLocaleDateString("fr-FR", DATE_FORMAT)}
                  </td>
                  <td>
                    {row.customerName}
                    <span className="admin-table__sub">
                      {row.customerEmail}
                    </span>
                  </td>
                  <td className="admin-table__num">{row.lineCount}</td>
                  <td className="admin-table__num">
                    {formatPrice(row.totalCents)}
                  </td>
                  <td className="admin-table__muted">{row.payment}</td>
                  <td>
                    <OrderStatusBadge status={row.status} />
                  </td>
                  <td className="admin-table__actions">
                    <Link
                      href={`/admin/commandes/${row.id}`}
                      className="admin-button admin-button--ghost admin-button--small"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
