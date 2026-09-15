import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { BrandStatement } from "@/components/sections/brand-statement";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Toutes les marques | Droopys",
  description:
    "Les maisons distribuées par Droopys pour les enfants de la naissance à 16 ans.",
};

export default function BrandsIndexPage() {
  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} />

      <main className="section-main">
        <BrandStatement text="Toutes nos marques" />
        <BrandsStrip />
      </main>

      <SiteFooter />
    </>
  );
}
