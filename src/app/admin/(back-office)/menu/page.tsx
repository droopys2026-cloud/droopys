import type { Metadata } from "next";
import Link from "next/link";
import { asc, count } from "drizzle-orm";
import { moveMenuTab } from "@/app/admin/(back-office)/menu/actions";
import { deleteCategory } from "@/app/admin/(back-office)/rayons/actions";
import { IconTrash } from "@/components/admin/admin-icons";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryCreateForm } from "@/components/admin/category-create-form";
import { db } from "@/db";
import { brands, categories, products, subcategories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Menu | Admin Droopy's" };

type Tab =
  | { kind: "rayon"; id: string; slug: string; title: string; links: string[]; productCount: number }
  | { kind: "marques"; links: string[] };

/**
 * Le menu du site, tel que la cliente le voit.
 *
 * Un onglet *est* un rayon, et ses liens sont ses sous-rayons : c'est donc
 * ici qu'on ajoute, range et supprime les rayons, et « Modifier » ouvre la
 * fiche où se gèrent les liens. Lue sans cache, pour qu'un changement se
 * voie dès le rechargement.
 */
export default async function AdminMenuPage() {
  await requireAdmin();

  const [categoryRows, brandRows, productCounts] = await Promise.all([
    db.query.categories.findMany({
      orderBy: [asc(categories.position)],
      columns: { id: true, slug: true, title: true, headline: true },
      with: {
        subcategories: { orderBy: [asc(subcategories.position)], columns: { title: true } },
      },
    }),
    db.query.brands.findMany({ orderBy: [asc(brands.position)], columns: { name: true } }),
    db
      .select({ categoryId: products.categoryId, total: count() })
      .from(products)
      .groupBy(products.categoryId),
  ]);
  const productsIn = new Map(productCounts.map((row) => [row.categoryId, row.total]));

  // Même règle que le site (`getMainNav`) : « Marques » juste avant l'Outlet.
  const tabs: Tab[] = categoryRows.map((category) => ({
    kind: "rayon",
    id: category.id,
    slug: category.slug,
    // Même libellé que la barre du site (`getMainNav`).
    title: category.headline ?? category.title,
    links: category.subcategories.map((sub) => sub.title),
    productCount: productsIn.get(category.id) ?? 0,
  }));
  const outletIndex = tabs.findIndex((tab) => tab.kind === "rayon" && tab.slug === "outlet");
  tabs.splice(outletIndex === -1 ? tabs.length : outletIndex, 0, {
    kind: "marques",
    links: brandRows.map((brand) => brand.name),
  });

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Menu"
        lead="Voici le menu du site, dans l'ordre où il s'affiche. Les flèches changent l'ordre des onglets ; « Modifier » ouvre les liens d'un onglet. Un nouvel onglet s'ajoute en bas de page."
      />

      <p className="admin-menu-preview" aria-label="Aperçu de la barre du site">
        {tabs.map((tab) => (
          <span key={tab.kind === "rayon" ? tab.id : "marques"}>
            {tab.kind === "rayon" ? tab.title : "Marques"}
          </span>
        ))}
      </p>

      <ol className="admin-menu-list">
        {tabs.map((tab, index) => {
          if (tab.kind === "marques") {
            return (
              <li key="marques" className="admin-menu-tab">
                {/* Place fixe, juste avant l'Outlet : pas de flèches, mais la
                    colonne est gardée pour que les noms restent alignés. */}
                <div className="admin-menu-tab__order" />
                <div className="admin-menu-tab__body">
                  <p className="admin-menu-tab__title">
                    <span className="admin-menu-tab__rank">{index + 1}</span>
                    Marques
                  </p>
                  <p className="admin-menu-tab__links">
                    Toutes vos marques, automatiquement.
                  </p>
                </div>
                <Link href="/admin/marques" className="admin-menu-tab__edit">
                  Modifier
                </Link>
                {/* Pas de suppression : l'onglet suit la liste des marques. */}
                <span className="admin-menu-tab__spacer" />
              </li>
            );
          }
          const rayonIndex = categoryRows.findIndex((row) => row.id === tab.id);
          return (
            <li key={tab.id} className="admin-menu-tab">
              <div className="admin-menu-tab__order">
                <form action={moveMenuTab}>
                  <input type="hidden" name="categoryId" value={tab.id} />
                  <input type="hidden" name="direction" value="haut" />
                  <button
                    type="submit"
                    className="admin-row__delete"
                    disabled={rayonIndex === 0}
                    aria-label={`Monter ${tab.title}`}
                  >
                    <span aria-hidden>↑</span>
                  </button>
                </form>
                <form action={moveMenuTab}>
                  <input type="hidden" name="categoryId" value={tab.id} />
                  <input type="hidden" name="direction" value="bas" />
                  <button
                    type="submit"
                    className="admin-row__delete"
                    disabled={rayonIndex === categoryRows.length - 1}
                    aria-label={`Descendre ${tab.title}`}
                  >
                    <span aria-hidden>↓</span>
                  </button>
                </form>
              </div>
              <div className="admin-menu-tab__body">
                <p className="admin-menu-tab__title">
                  <span className="admin-menu-tab__rank">{index + 1}</span>
                  {tab.title}
                </p>
                <p className="admin-menu-tab__links">
                  {tab.links.length > 0
                    ? tab.links.join(" · ")
                    : "Pas de liens : l'onglet mène directement à la page."}
                </p>
              </div>
              <Link href={`/admin/rayons/${tab.slug}`} className="admin-menu-tab__edit">
                Modifier
              </Link>
              <form action={deleteCategory}>
                <input type="hidden" name="categoryId" value={tab.id} />
                {/* Même règle que l'action : un onglet ne se supprime que
                    vide, sinon ses liens et ses produits partiraient avec. */}
                <button
                  type="submit"
                  className="admin-row__delete"
                  disabled={tab.links.length > 0 || tab.productCount > 0}
                  aria-label={`Supprimer ${tab.title}`}
                  title={
                    tab.links.length > 0 || tab.productCount > 0
                      ? `${tab.title} n'est pas vide : retirez d'abord ses liens et rangez ses produits ailleurs.`
                      : `Supprimer ${tab.title}`
                  }
                >
                  <IconTrash />
                </button>
              </form>
            </li>
          );
        })}
      </ol>

      <section className="admin-card" aria-labelledby="nouvel-onglet">
        <h2 id="nouvel-onglet" className="admin-card__title">
          Ajouter un onglet
        </h2>
        <CategoryCreateForm />
      </section>
    </div>
  );
}
