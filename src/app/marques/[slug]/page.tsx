import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmptyCollection } from "@/components/sections/empty-collection";
import { ProductGrid } from "@/components/sections/product-grid";
import {
  getBrandBySlug,
  listBrands,
  listProductsOfBrand,
} from "@/lib/queries/catalog";

type PageProps = { params: Promise<{ slug: string }> };

/** Une page statique par marque, générée à la compilation. */
export async function generateStaticParams() {
  return (await listBrands()).map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};

  return {
    title: `${brand.name} enfant | Droopy's`,
    description: `La sélection ${brand.name} chez Droopy's : vêtements, chaussures et accessoires de la naissance à 16 ans.`,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const products = await listProductsOfBrand(brand.slug);

  return (
    <>
      <SiteAnnouncement />
      {/* Titre fixe : le texte défilant a été retiré des pages marques à la
          demande de la boutique, la page va droit aux articles. */}
      <SiteHeader title={brand.name} />

      <main className="section-main">
        {products.length > 0 ? (
          <div className="subsection-gray">
            <ProductGrid
              title={
                products.length === 1
                  ? `1 article ${brand.name}`
                  : `${products.length} articles ${brand.name}`
              }
              products={products}
            />
          </div>
        ) : (
          <EmptyCollection />
        )}
      </main>

      <SiteFooter />
    </>
  );
}
