import type { Metadata } from "next";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDetail } from "@/components/sections/cart-detail";
import { promoLines } from "@/lib/cart/totals";
import { getCart } from "@/lib/queries/cart";
import { getCartPromo } from "@/lib/queries/promo";
import { getCurrentUser } from "@/lib/supabase/server";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
  title: "Mon panier | Droopy's",
  // Une page panier n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const [lines, user] = await Promise.all([getCart(), getCurrentUser()]);
  const promo = lines.length > 0 ? await getCartPromo(promoLines(lines), { customerId: user?.id, email: user?.email }) : null;

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader />

      <main className="section-main">
        <CartDetail lines={lines} promo={promo} />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
