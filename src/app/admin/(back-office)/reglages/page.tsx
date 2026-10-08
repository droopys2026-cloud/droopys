import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth";
import { getShopSettings } from "@/lib/queries/settings";

export const metadata: Metadata = { title: "Réglages | Admin Droopy's" };

export default async function AdminReglagesPage() {
  await requireAdmin();

  const settings = await getShopSettings();

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Réglages"
        lead="Coordonnées, livraison, paiement, retours, newsletter et réseaux — ce que la boutique affiche partout."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
