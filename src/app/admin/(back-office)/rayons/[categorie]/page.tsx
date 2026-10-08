import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, count, eq } from "drizzle-orm";
import {
  deleteSubcategory,
  moveSubcategory,
} from "@/app/admin/(back-office)/rayons/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IconTrash } from "@/components/admin/admin-icons";
import { SubcategoryCreateForm } from "@/components/admin/subcategory-create-form";
import { db } from "@/db";
import { categories, products, subcategories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

type PageProps = { params: Promise<{ categorie: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorie } = await params;
  return { title: `Rayon ${categorie} | Admin Droopy's` };
}

/** Les sous-rayons d'un rayon : ordre, photo, suppression, ajout. */
export default async function AdminRayonPage({ params }: PageProps) {
  await requireAdmin();

  const { categorie } = await params;
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, categorie),
    columns: { id: true, slug: true, title: true },
  });
  if (!category) notFound();

  const rows = await db
    .select({
      id: subcategories.id,
      slug: subcategories.slug,
      title: subcategories.title,
      imageUrl: subcategories.imageUrl,
      productCount: count(products.id),
    })
    .from(subcategories)
    .leftJoin(products, eq(products.subcategoryId, subcategories.id))
    .where(eq(subcategories.categoryId, category.id))
    .groupBy(subcategories.id)
    .orderBy(asc(subcategories.position));

  return (
    <div className="admin-page">
      <Link href="/admin/menu" className="admin-back">
        <span aria-hidden>←</span> Retour au menu
      </Link>

      <AdminPageHeader
        title={category.title}
        lead="Les liens qui s'affichent quand on survole l'onglet, dans cet ordre. Chaque lien est aussi une page du site."
      />

      {rows.length === 0 ? (
        <AdminEmpty
          title="Aucun sous-rayon"
          text="Ajoutez-en un ci-dessous : il apparaîtra dans le menu, sous cet onglet."
        />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Sous-rayon</th>
                <th scope="col">Page</th>
                <th scope="col">Photo</th>
                <th scope="col" className="admin-table__num">
                  Produits
                </th>
                <th scope="col" className="admin-table__actions">
                  <span className="sr-only">Ordre et suppression</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <th scope="row" className="admin-table__name">
                    <Link
                      href={`/admin/rayons/${category.slug}/${row.slug}`}
                      className="admin-row__link"
                    >
                      {row.title}
                    </Link>
                  </th>
                  <td className="admin-table__muted">
                    /{category.slug}/{row.slug}
                  </td>
                  <td className="admin-table__muted">
                    {row.imageUrl ? "oui" : "—"}
                  </td>
                  <td className="admin-table__num">{row.productCount}</td>
                  <td className="admin-table__actions">
                    {/* Trois formulaires frères plutôt qu'un seul à plusieurs
                        boutons : chacun porte sa propre action, et aucun ne
                        dépend du bouton qui l'a envoyé. */}
                    <form action={moveSubcategory}>
                      <input type="hidden" name="subcategoryId" value={row.id} />
                      <input type="hidden" name="direction" value="haut" />
                      <button
                        type="submit"
                        className="admin-row__delete"
                        disabled={index === 0}
                        aria-label={`Monter ${row.title}`}
                      >
                        <span aria-hidden>↑</span>
                      </button>
                    </form>

                    <form action={moveSubcategory}>
                      <input type="hidden" name="subcategoryId" value={row.id} />
                      <input type="hidden" name="direction" value="bas" />
                      <button
                        type="submit"
                        className="admin-row__delete"
                        disabled={index === rows.length - 1}
                        aria-label={`Descendre ${row.title}`}
                      >
                        <span aria-hidden>↓</span>
                      </button>
                    </form>

                    <form action={deleteSubcategory}>
                      <input type="hidden" name="subcategoryId" value={row.id} />
                      <button
                        type="submit"
                        className="admin-row__delete"
                        disabled={row.productCount > 0}
                        aria-label={`Supprimer ${row.title}`}
                        title={
                          row.productCount > 0
                            ? `${row.title} porte ${row.productCount} produit${row.productCount > 1 ? "s" : ""} : rangez-les ailleurs avant de le supprimer.`
                            : `Supprimer ${row.title}`
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
      )}

      <SubcategoryCreateForm categorySlug={category.slug} />
    </div>
  );
}
