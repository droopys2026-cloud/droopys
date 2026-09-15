import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { BrandStatement } from "@/components/sections/brand-statement";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { ProductRail } from "@/components/sections/product-rail";
import { Editorial } from "@/components/sections/editorial";
import { Newsletter } from "@/components/sections/newsletter";
import { KlarnaBand } from "@/components/sections/klarna-band";
import { DEMO_CART_LINES, HOME_RAILS } from "@/lib/placeholder-data";

/**
 * Page d'accueil. Elle n'assemble que des sections : toute la mise en forme
 * vit dans les composants, pour que l'ordre des blocs se relise d'un coup.
 */
export default function HomePage() {
  const [creators, trends, history] = HOME_RAILS;

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} />

      <main className="section-main">
        <Hero />

        <BrandStatement text="Droopys, les grandes marques de la naissance à 16 ans" />

        <div className="subsection-gray">
          <ProductRail rail={creators} />
        </div>

        <ProductRail rail={trends} />

        <BrandsStrip />

        <Editorial
          eyebrow="Notre maison"
          title="À propos de "
          titleAccent="Droopys"
          body="Stone Island, C.P. Company, Moncler, Lanvin, Burberry… Nous réunissons les maisons que les enfants portent vraiment, de la naissance à 16 ans — vêtements, chaussures et accessoires compris."
          image="/imgdress/petitmoncler.webp"
          imageClassName="object-[50%_22%]"
          ctaLabel="Découvrir la boutique"
          ctaHref="/a-propos"
        />

        <div className="subsection-tight">
          <ProductRail rail={history} />
        </div>

        <Newsletter />

        <KlarnaBand />
      </main>

      <SiteFooter />
    </>
  );
}
