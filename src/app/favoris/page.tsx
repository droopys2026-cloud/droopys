import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WishlistEmpty } from "@/components/sections/wishlist-empty";
import { ProductRail } from "@/components/sections/product-rail";
import { Newsletter } from "@/components/sections/newsletter";
import { DEMO_CART_LINES, HOME_RAILS } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Mes favoris | Droopys",
  // Liste personnelle : rien à indexer.
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} title="Mes favoris" />

      <main className="section-main min-h-[50vh]">
        <WishlistEmpty />
        {/* Une page vide sans issue fait sortir du site : le rail des
            nouveautés donne quelque chose à mettre en favori. */}
        <ProductRail rail={HOME_RAILS[0]} />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
