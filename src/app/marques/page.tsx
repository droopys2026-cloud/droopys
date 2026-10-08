import type { Metadata } from "next";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrandIndex } from "@/components/sections/brand-index";
import { countProductsByBrand, listBrands } from "@/lib/queries/catalog";

export const metadata: Metadata = {
  title: "Toutes les marques | Droopy's",
  description:
    "Les maisons distribuées par Droopy's pour les enfants de la naissance à 16 ans.",
};

export default async function BrandsIndexPage() {
  const [brands, counts] = await Promise.all([listBrands(), countProductsByBrand()]);
  const countOf = new Map(counts.map((row) => [row.brandId, row.total]));

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Nos marques" />

      <main className="section-main">
        <BrandIndex
          brands={brands.map((brand) => ({
            slug: brand.slug,
            name: brand.name,
            logoUrl: brand.logoUrl,
            logoRatio: brand.logoRatio,
            productCount: countOf.get(brand.id) ?? 0,
          }))}
        />
      </main>

      <SiteFooter />
    </>
  );
}
