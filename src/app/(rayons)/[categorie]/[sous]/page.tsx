import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmptyCollection } from "@/components/sections/empty-collection";
import { ProductGrid } from "@/components/sections/product-grid";
import {
  getSubcategory,
  listProductsForSubcategory,
  listSubcategoryPaths,
} from "@/lib/queries/taxonomy";

type PageProps = { params: Promise<{ categorie: string; sous: string }> };

/**
 * Page d'un sous-rayon : /fille/robes.
 *
 * C'est la destination des liens de deuxième niveau du menu. Les paramètres
 * viennent de la base et non d'une liste écrite à la main : un sous-rayon
 * ajouté dans l'admin a sa page dès la reconstruction suivante.
 */
export async function generateStaticParams() {
  return listSubcategoryPaths();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorie, sous } = await params;
  const subcategory = await getSubcategory(categorie, sous);
  if (!subcategory) return {};

  return {
    title: `${subcategory.title} ${subcategory.categoryTitle} | Droopy's`,
    description: subcategory.intro ?? undefined,
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { categorie, sous } = await params;
  const subcategory = await getSubcategory(categorie, sous);
  if (!subcategory) notFound();

  const products = await listProductsForSubcategory(subcategory.id);

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader
        backdrop={subcategory.imageUrl ?? undefined}
        backdropClassName={subcategory.imageClassName ?? undefined}
        title={subcategory.title}
      />

      <main className="section-main min-h-[50vh]">
        {products.length > 0 ? (
          <ProductGrid title={subcategory.title} products={products} />
        ) : (
          <EmptyCollection />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
