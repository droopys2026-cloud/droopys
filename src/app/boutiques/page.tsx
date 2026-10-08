import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { ShopList } from "@/components/sections/shop-list";
import { contentMetadata, getContentPage } from "@/lib/queries/content";

const SLUG = "boutiques";

export function generateMetadata(): Promise<Metadata> {
  return contentMetadata(SLUG);
}

export default async function BoutiquesPage() {
  // Colonne élargie : la fiche de boutique est une grille, pas de la prose.
  return (
    <ContentPageView page={await getContentPage(SLUG)} wide>
      <ShopList />
    </ContentPageView>
  );
}
