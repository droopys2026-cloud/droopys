import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrandStatement } from "@/components/sections/brand-statement";
import { ProductRail } from "@/components/sections/product-rail";
import { BRANDS, getBrand } from "@/lib/brands";
import { DEMO_CART_LINES, HOME_RAILS } from "@/lib/placeholder-data";

type PageProps = { params: Promise<{ slug: string }> };

/** Une page statique par marque, générée à la compilation. */
export function generateStaticParams() {
  return BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};

  return {
    title: `${brand.name} enfant | Droopys`,
    description: `La sélection ${brand.name} chez Droopys : vêtements, chaussures et accessoires de la naissance à 16 ans.`,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  // Tant que le catalogue n'est pas branché, on réutilise les rails de
  // démonstration en les rattachant à la marque affichée.
  const rail = {
    ...HOME_RAILS[0],
    title: "La sélection ",
    titleAccent: brand.name,
    href: `/marques/${brand.slug}`,
    products: HOME_RAILS[0].products.map((product) => ({
      ...product,
      brand: brand.name,
    })),
  };

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} />

      <main className="section-main">
        <BrandStatement text={`${brand.name} enfant`} />
        <div className="subsection-gray">
          <ProductRail rail={rail} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
