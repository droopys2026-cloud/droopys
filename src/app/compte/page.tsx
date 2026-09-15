import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AccountPanel } from "@/components/sections/account-panel";
import { Newsletter } from "@/components/sections/newsletter";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";

export const metadata: Metadata = {
  title: "Mon compte | Droopys",
  // Espace personnel : rien à indexer, comme le panier.
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      <SiteHeader cartLines={DEMO_CART_LINES} title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <AccountPanel />
        <Newsletter />
      </main>

      <SiteFooter />
    </>
  );
}
