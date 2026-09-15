import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductFilters } from "@/components/admin/product-filters";

export const metadata: Metadata = { title: "Produits | Admin Droopys" };

export default function AdminProduitsPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Produits"
        lead="Le catalogue : références, prix, stock et photos."
        action={
          <Link href="/admin/produits/nouveau" className="admin-button">
            Ajouter un produit
          </Link>
        }
      />

      <ProductFilters />
    </div>
  );
}
