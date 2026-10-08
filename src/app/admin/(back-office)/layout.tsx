import type { Metadata } from "next";
import { AdminPageTransition } from "@/components/admin/admin-page-transition";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin | Droopy's",
  // L'admin n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

/**
 * Coquille de l'espace d'administration : barre latérale fixe à gauche,
 * contenu défilant à droite. Les styles vivent dans `@/styles/admin.css`,
 * à part du reste du site — l'admin est sombre, la boutique est claire.
 *
 * La vérification de session est ici **et** dans chaque action : une mise en
 * page protège ce qu'elle rend, pas ce qu'on appelle directement.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="admin-shell">
      <AdminSidebar email={user.email ?? ""} />
      <main className="admin-main">
        <AdminPageTransition>{children}</AdminPageTransition>
      </main>
    </div>
  );
}
