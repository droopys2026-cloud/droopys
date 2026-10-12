import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { BrandStatement } from "@/components/sections/brand-statement";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { ProductRail } from "@/components/sections/product-rail";
import { Editorial } from "@/components/sections/editorial";
import { Newsletter } from "@/components/sections/newsletter";
import { KlarnaBand } from "@/components/sections/klarna-band";
import { BabySetsBand } from "@/components/sections/baby-sets-band";
import { SocialCard } from "@/components/sections/social-card";
import { getHomeRails } from "@/lib/queries/rails";
import { getShopSettings } from "@/lib/queries/settings";
import { socialLinks } from "@/lib/social";

/**
 * Page d'accueil. Elle n'assemble que des sections : toute la mise en forme
 * vit dans les composants, pour que l'ordre des blocs se relise d'un coup.
 */
export default async function HomePage() {
  const [[creators, trends, history], { reseaux }] = await Promise.all([
    getHomeRails(),
    getShopSettings(),
  ]);

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader />

      <main className="section-main">
        <Hero />

        <BrandStatement text="Droopy's, les grandes marques de la naissance à 16 ans" />

        {creators && (
          <div className="subsection-gray">
            <ProductRail rail={creators} />
          </div>
        )}

        <BabySetsBand />

        {trends && <ProductRail rail={trends} />}

        <BrandsStrip />

        <Editorial
          eyebrow="Notre maison"
          title="À propos de "
          titleAccent="Droopy's"
          body="Stone Island, C.P. Company, Moncler, Lanvin, Burberry… Nous réunissons les maisons que les enfants portent vraiment, de la naissance à 16 ans — vêtements, chaussures et accessoires compris."
          image="/imgdress/petitmoncler.webp"
          imageClassName="object-[50%_22%]"
          ctaLabel="Découvrir la boutique"
          ctaHref="/a-propos"
        />

        {history && (
          <div className="subsection-tight">
            <ProductRail rail={history} />
          </div>
        )}

        <Newsletter />

        <KlarnaBand />
      </main>

      <SiteFooter />

      {/* Carte fixée en bas à droite : réseaux sociaux de la boutique, tels
          que saisis dans Admin → Réglages. Sans compte renseigné, rien. */}
      <SocialCard links={socialLinks(reseaux)} image="/imgdress/connexion.webp" />
    </>
  );
}
