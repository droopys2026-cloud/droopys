import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin | Droopys",
  // L'admin n'a rien à faire dans un index de moteur de recherche.
  robots: { index: false, follow: false },
};

/**
 * Coquille de l'espace d'administration : barre latérale fixe à gauche,
 * contenu défilant à droite. Les styles vivent dans `@/styles/admin.css`,
 * à part du reste du site — l'admin est sombre, la boutique est claire.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
