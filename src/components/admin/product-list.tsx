import Link from "next/link";
import Image from "next/image";
import {
  deleteProduct,
  togglePublished,
} from "@/app/admin/(back-office)/produits/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { formatPrice } from "@/lib/format";
import type { AdminProductRow } from "@/lib/queries/admin-catalog";

/**
 * Catalogue en tableau.
 *
 * Un tableau et non des lignes empilées : on compare ici des valeurs de même
 * nature — des prix, des stocks, des états. Alignées en colonnes, elles se
 * lisent d'un balayage vertical ; noyées dans une phrase par ligne, il faut
 * les chercher une par une. C'est aussi ce que le tri par colonne supposera
 * le jour où on l'ajoutera.
 *
 * Chaque action est un formulaire, jamais un lien : publier ou supprimer
 * change l'état du serveur, et un GET peut être déclenché par un préchargeur.
 * Sans JavaScript les boutons fonctionnent quand même — c'est ce que donne
 * une Server Action appelée depuis un `<form>`.
 */
export function ProductList({
  rows,
  narrowed,
  query,
}: {
  rows: AdminProductRow[];
  narrowed: boolean;
  query?: string;
}) {
  if (rows.length === 0) {
    return (
      <AdminEmpty
        title={
          query
            ? `Aucun résultat pour « ${query} »`
            : narrowed
              ? "Aucun produit ne correspond à ce tri"
              : "Aucun produit enregistré"
        }
        text={
          narrowed
            ? "Élargissez le tri, ou ajoutez un produit dans ce rayon."
            : "Ajoutez un premier produit pour le voir apparaître ici."
        }
      />
    );
  }

  return (
    <div className="admin-table-wrap">
      <p className="admin-field__hint">
        {rows.length} produit{rows.length > 1 ? "s" : ""}
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col" className="admin-table__thumb">
              <span className="sr-only">Photo</span>
            </th>
            <th scope="col">Produit</th>
            <th scope="col">Marque</th>
            <th scope="col">Rayon</th>
            {/* Les nombres sont alignés à droite : c'est ce qui permet de
                comparer deux prix sans lire leurs chiffres un à un. */}
            <th scope="col" className="admin-table__num">
              Prix
            </th>
            <th scope="col" className="admin-table__num">
              Stock
            </th>
            <th scope="col">État</th>
            <th scope="col" className="admin-table__actions">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="admin-table__thumb">
                {row.imageUrl ? (
                  <Image
                    src={row.imageUrl}
                    alt=""
                    width={36}
                    height={48}
                    className="admin-row__image"
                  />
                ) : (
                  /* Un cadre vide plutôt que rien : la ligne garde sa hauteur,
                     et l'absence de photo se voit — c'est une fiche à finir. */
                  <span
                    className="admin-row__image admin-row__image--empty"
                    aria-hidden
                  />
                )}
              </td>

              <th scope="row" className="admin-table__name">
                <Link href={`/admin/produits/${row.id}`}>{row.name}</Link>
              </th>

              <td>{row.brandName}</td>
              <td className="admin-table__muted">{row.categorySlug ?? "—"}</td>

              <td className="admin-table__num">
                {formatPrice(row.priceCents)}
                {row.compareAtPriceCents && (
                  <span className="admin-table__was">
                    {formatPrice(row.compareAtPriceCents)}
                  </span>
                )}
              </td>

              <td className="admin-table__num">
                <span
                  className={
                    row.stock > 0
                      ? "admin-stock__state"
                      : "admin-stock__state admin-stock__state--out"
                  }
                >
                  {row.stock > 0 ? row.stock : "rupture"}
                </span>
              </td>

              <td>
                <span
                  className={
                    row.published
                      ? "admin-badge admin-badge--live"
                      : "admin-badge"
                  }
                >
                  {row.published ? "Publié" : "Brouillon"}
                </span>
              </td>

              <td className="admin-table__actions">
                <div className="admin-row__actions">
                  <form action={togglePublished}>
                    <input type="hidden" name="productId" value={row.id} />
                    <button
                      type="submit"
                      className="admin-button admin-button--ghost admin-button--small"
                    >
                      {row.published ? "Dépublier" : "Publier"}
                    </button>
                  </form>

                  <Link
                    href={`/admin/produits/${row.id}`}
                    className="admin-button admin-button--ghost admin-button--small"
                  >
                    Modifier
                  </Link>

                  {row.published && (
                    <Link
                      href={`/produits/${row.slug}`}
                      className="admin-row__link"
                      target="_blank"
                    >
                      Voir
                    </Link>
                  )}

                  <form action={deleteProduct}>
                    <input type="hidden" name="productId" value={row.id} />
                    <button
                      type="submit"
                      className="admin-row__delete"
                      aria-label={`Supprimer ${row.name}`}
                      title={`Supprimer ${row.name}`}
                    >
                      ×
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
