import Link from "next/link";
import { deletePromo, togglePromo } from "@/app/admin/(back-office)/codes-promo/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { formatPrice } from "@/lib/format";
import { PROMO_STATUS_LABELS, promoStatus } from "@/lib/promo/status";

export type PromoRow = {
  id: string;
  code: string;
  kind: "percent" | "amount";
  value: number;
  scope: "site" | "products";
  productCount: number;
  endsAt: Date | null;
  maxUses: number | null;
  uses: number;
  active: boolean;
  announce: boolean;
};

/**
 * Les codes promo, en tableau : on compare ici des remises, des compteurs et
 * des états, qui se lisent en colonnes.
 *
 * L'état est calculé à l'affichage et non stocké : un code expire à minuit
 * sans que personne ne l'écrive en base.
 */
export function PromoList({ rows, now }: { rows: PromoRow[]; now: Date }) {
  if (rows.length === 0) {
    return (
      <AdminEmpty
        title="Aucun code promo"
        text="Créez un code valable sur tout le site ou sur quelques produits."
        action={
          <Link href="/admin/codes-promo/nouveau" className="admin-button">
            Créer un code
          </Link>
        }
      />
    );
  }

  const dateFormat = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeZone: "Europe/Paris",
  });

  return (
    <div className="admin-table-wrap">
      <p className="admin-field__hint">
        {rows.length} code{rows.length > 1 ? "s" : ""}
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Remise</th>
            <th scope="col">Portée</th>
            <th scope="col" className="admin-table__num">
              Utilisations
            </th>
            <th scope="col">Fin</th>
            <th scope="col">État</th>
            <th scope="col" className="admin-table__actions">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const status = promoStatus(row, now);
            return (
              <tr key={row.id}>
                <th scope="row" className="admin-table__name">
                  <Link href={`/admin/codes-promo/${row.id}`}>{row.code}</Link>
                  {row.announce && status === "actif" && (
                    <span className="admin-table__color">dans la bande noire</span>
                  )}
                </th>
                <td>
                  {row.kind === "percent" ? `−${row.value} %` : `−${formatPrice(row.value)}`}
                </td>
                <td className="admin-table__muted">
                  {row.scope === "site"
                    ? "Tout le site"
                    : `${row.productCount} produit${row.productCount > 1 ? "s" : ""}`}
                </td>
                <td className="admin-table__num">
                  {row.uses}
                  {row.maxUses !== null && ` / ${row.maxUses}`}
                </td>
                <td className="admin-table__muted">
                  {row.endsAt ? dateFormat.format(row.endsAt) : "—"}
                </td>
                <td>
                  <span className={status === "actif" ? "admin-badge admin-badge--live" : "admin-badge"}>
                    {PROMO_STATUS_LABELS[status]}
                  </span>
                </td>
                <td className="admin-table__actions">
                  <div className="admin-row__actions">
                    <form action={togglePromo}>
                      <input type="hidden" name="promoId" value={row.id} />
                      <button
                        type="submit"
                        className="admin-button admin-button--ghost admin-button--small"
                      >
                        {row.active ? "Désactiver" : "Activer"}
                      </button>
                    </form>
                    <Link
                      href={`/admin/codes-promo/${row.id}`}
                      className="admin-button admin-button--ghost admin-button--small"
                    >
                      Modifier
                    </Link>
                    <form action={deletePromo}>
                      <input type="hidden" name="promoId" value={row.id} />
                      <button
                        type="submit"
                        className="admin-row__delete"
                        aria-label={`Supprimer le code ${row.code}`}
                        title={`Supprimer le code ${row.code}`}
                      >
                        ×
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
