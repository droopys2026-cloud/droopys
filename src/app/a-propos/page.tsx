import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { ShopPhotos } from "@/components/sections/shop-photos";
import { SHOPS } from "@/lib/shops";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

const SLUG = "a-propos";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function Page() {
  // L'unique boutique ouverte : sa photo montre le magasin dont parle la page.
  return (
    <ContentPageView page={await getContentPage(SLUG)}>
      <ShopPhotos photos={SHOPS[0].photos} />
    </ContentPageView>
  );
}
