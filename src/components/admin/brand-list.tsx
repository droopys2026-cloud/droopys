import Link from "next/link";
import { deleteBrand } from "@/app/admin/(back-office)/marques/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconTrash } from "@/components/admin/admin-icons";

export type BrandRow = {
  id: string;
  slug: string;
  name: string;
  /** Nombre de produits rattachés : une marque utilisée ne se supprime pas. */
  productCount: number;
};

/**
 * Les marques distribuées.
 *
 * La colonne « Produits » n'est pas décorative : c'est elle qui explique
 * pourquoi le bouton de suppression est inactif sur certaines lignes. Un
 * bouton grisé sans raison visible se lit comme une panne.
 */
export function BrandList({ rows }: { rows: BrandRow[] }) {
  if (rows.length === 0) {
    return (
      <AdminEmpty
        title="Aucune marque enregistrée"
        text="Les marques ajoutées ici apparaîtront dans le menu et auront leur page."
        action={
          <Link href="/admin/marques/nouvelle" className="admin-button">
            Ajouter une marque
          </Link>
        }
      />
    );
  }

  return (
    <div className="admin-table-wrap">
      <p className="admin-field__hint">
        {rows.length} marque{rows.length > 1 ? "s" : ""}
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">Marque</th>
            <th scope="col">Page</th>
            <th scope="col" className="admin-table__num">
              Produits
            </th>
            <th scope="col" className="admin-table__actions">
              <span className="sr-only">Supprimer</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row" className="admin-table__name">
                {row.name}
              </th>
              <td className="admin-table__muted">
                <Link href={`/marques/${row.slug}`} className="admin-row__link">
                  /marques/{row.slug}
                </Link>
              </td>
              <td className="admin-table__num">{row.productCount}</td>
              <td className="admin-table__actions">
                <form action={deleteBrand}>
                  <input type="hidden" name="brandId" value={row.id} />
                  <button
                    type="submit"
                    className="admin-row__delete"
                    disabled={row.productCount > 0}
                    aria-label={`Supprimer ${row.name}`}
                    title={
                      row.productCount > 0
                        ? `${row.name} porte ${row.productCount} produit${row.productCount > 1 ? "s" : ""} : déplacez-les avant de la supprimer.`
                        : `Supprimer ${row.name}`
                    }
                  >
                    <IconTrash />
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
