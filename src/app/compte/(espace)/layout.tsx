import { AccountNav } from "@/components/account/account-nav";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { requireCustomer } from "@/lib/auth";

/**
 * Coquille de l'espace client : menu à gauche, page à droite.
 *
 * `requireCustomer` est appelée ici **et** dans chaque page et action : la
 * mise en page protège ce qu'elle rend, pas une action appelée directement.
 */
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireCustomer();

  return (
    <>
      <SiteAnnouncement />
      <SiteHeader title="Mon compte" />

      <main className="section-main min-h-[50vh]">
        <div className="container-page pt-13 pb-14">
          <div className="account-shell">
            <AccountNav />
            <div className="account-content">{children}</div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
