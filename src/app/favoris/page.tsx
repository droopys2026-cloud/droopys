import type { Metadata } from "next";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WishlistEmpty } from "@/components/sections/wishlist-empty";
import { ProductGrid } from "@/components/sections/product-grid";
import { ProductRail } from "@/components/sections/product-rail";
import { Newsletter } from "@/components/sections/newsletter";
import { listProductsByIds } from "@/lib/queries/catalog";
import { getHomeRails } from "@/lib/queries/rails";
import { getCurrentUser } from "@/lib/supabase/server";
import { getWishlistIds } from "@/lib/wishlist/ids";

export const metadata: Metadata = {
  title: "Mes favoris | Droopy's",
  // Liste personnelle : rien à indexer.
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const [ids, user, [nouveautes]] = await Promise.all([
    getWishlistIds(),
    getCurrentUser(),
    getHomeRails(),
  ]);
  const products = await listProductsByIds(ids);

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mes favoris" />

      <main className="section-main min-h-[50vh]">
        {products.length > 0 ? (
          <ProductGrid title="Mes favoris" products={products} />
        ) : (
          <WishlistEmpty signedIn={Boolean(user)} />
        )}
        {/* Une page vide sans issue fait sortir du site : le rail des
            nouveautés donne quelque chose à mettre en favori. */}
        {products.length === 0 && nouveautes && <ProductRail rail={nouveautes} />}
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
