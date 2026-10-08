import type { Metadata } from "next";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDetail } from "@/components/sections/cart-detail";
import { getCart } from "@/lib/queries/cart";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
  title: "Mon panier | Droopy's",
  // Une page panier n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  return (
    <>
      <SiteAnnouncement />
      <SiteHeader />

      <main className="section-main">
        <CartDetail lines={await getCart()} />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
