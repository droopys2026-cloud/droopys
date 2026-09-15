import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminEmpty } from "@/components/admin/admin-empty";

export const metadata: Metadata = { title: "Clients | Admin Droopys" };

export default function AdminClientsPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Clients"
        lead="Les comptes créés sur la boutique et leur historique."
      />

      {/* Aucune donnée n'est branchée : la page annonce l'état plutôt que
          d'afficher un tableau vide, qu'on prendrait pour un bug. */}
      <AdminEmpty
        title="Aucun client"
        text="Les comptes créés en boutique apparaîtront ici."
      />
    </div>
  );
}
