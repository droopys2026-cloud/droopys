import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandForm } from "@/components/admin/brand-form";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Nouvelle marque | Admin Droopy's" };

export default async function AdminNouvelleMarquePage() {
  await requireAdmin();

  return (
    <div className="admin-page">
      <Link href="/admin/marques" className="admin-back">
        <span aria-hidden>←</span> Retour aux marques
      </Link>

      <AdminPageHeader
        title="Nouvelle marque"
        lead="Une marque enregistrée ici apparaît dans la bande d'accueil et obtient sa page."
      />

      <BrandForm />
    </div>
  );
}
