import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmpty } from "@/components/admin/admin-empty";

export const metadata: Metadata = { title: "Aide | Admin Droopy's" };

export default function AdminAidePage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Aide"
        lead="Comment utiliser l'espace d'administration."
      />

      {/* Aucune donnée n'est branchée : la page annonce l'état plutôt que
          d'afficher un tableau vide, qu'on prendrait pour un bug. */}
      <AdminEmpty
        title="Documentation à venir"
        text="Cette page réunira les procédures courantes de la boutique."
      />
    </div>
  );
}
