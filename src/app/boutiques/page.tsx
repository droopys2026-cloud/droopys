import type { Metadata } from "next";
import { ContentPageView } from "@/components/layout/content-page-view";
import { ShopList } from "@/components/sections/shop-list";
import { contentMetadata, contentPage } from "@/lib/content-pages";

const SLUG = "boutiques";

export const metadata: Metadata = contentMetadata(SLUG);

export default function BoutiquesPage() {
  // Colonne élargie : la fiche de boutique est une grille, pas de la prose.
  return (
    <ContentPageView page={contentPage(SLUG)} wide>
      <ShopList />
    </ContentPageView>
  );
}
