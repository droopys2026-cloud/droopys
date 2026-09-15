import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = { title: "Réglages | Admin Droopys" };

export default function AdminReglagesPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Réglages"
        lead="Coordonnées, livraison, paiement, retours, newsletter et réseaux — ce que la boutique affiche partout."
      />
      <SettingsForm />
    </div>
  );
}
