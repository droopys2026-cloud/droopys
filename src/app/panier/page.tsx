import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDetail } from "@/components/sections/cart-detail";
import { Newsletter } from "@/components/sections/newsletter";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Mon panier | Droopys",
  // Une page panier n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} />

      <main className="section-main">
        <CartDetail lines={DEMO_CART_LINES} />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
