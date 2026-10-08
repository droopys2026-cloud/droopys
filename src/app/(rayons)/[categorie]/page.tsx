import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmptyCollection } from "@/components/sections/empty-collection";
import { ProductGrid } from "@/components/sections/product-grid";
import {
  getCategoryBySlug,
  listCategories,
  listProductsForCategory,
} from "@/lib/queries/catalog";

type PageProps = { params: Promise<{ categorie: string }> };

/**
 * Une page par rayon connu au moment de la construction. Un rayon créé
 * ensuite dans l'admin se rend à la première visite : les paramètres
 * dynamiques restent permis.
 */
export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ categorie: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category) return {};

  return {
    title: `${category.headline ?? category.title} | Droopy's`,
    description: category.intro ?? undefined,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorie } = await params;
  const category = await getCategoryBySlug(categorie);
  if (!category) notFound();

  const products = await listProductsForCategory(category.slug);

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader
        backdrop={category.imageUrl ?? undefined}
        backdropClassName={category.backdropClassName ?? undefined}
        title={category.headline ?? category.title}
      />

      <main className="section-main min-h-[50vh]">
        {/* Un rayon sans article annonce son état plutôt que d'afficher une
            grille vide, qu'on prendrait pour un chargement qui n'aboutit pas. */}
        {products.length > 0 ? (
          <ProductGrid
            title={category.headline ?? category.title}
            products={products}
          />
        ) : (
          <EmptyCollection />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
