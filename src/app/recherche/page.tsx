import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchPanel } from "@/components/sections/search-panel";
import { Newsletter } from "@/components/sections/newsletter";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";
import { searchProducts } from "@/lib/search";

export const metadata: Metadata = {
  title: "Recherche | Droopys",
  // Une page de résultats n'apporte rien à un index : elle change à chaque
  // requête et duplique le catalogue.
  robots: { index: false, follow: true },
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: PageProps) {
  const raw = (await searchParams).q;
  // Un paramètre répété (?q=a&q=b) arrive en tableau : on ne garde que le
  // premier plutôt que de laisser passer « a,b » dans le champ.
  const query = (Array.isArray(raw) ? raw[0] : (raw ?? "")).trim();

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} title="Recherche" />

      <main className="section-main min-h-[50vh]">
        <SearchPanel query={query} results={searchProducts(query)} />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
