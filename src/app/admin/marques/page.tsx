import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandList } from "@/components/admin/brand-list";

export const metadata: Metadata = { title: "Marques | Admin Droopys" };

export default function AdminMarquesPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Marques"
        lead="Les maisons distribuées par Droopys. Chaque marque a sa page en boutique."
        action={
          <Link href="/admin/marques/nouvelle" className="admin-button">
            Ajouter une marque
          </Link>
        }
      />

      <BrandList />
    </div>
  );
}
