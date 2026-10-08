import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import {
  listBrandOptions,
  listCategoryOptions,
  listSubcategoryOptions,
} from "@/lib/queries/admin-catalog";

export const metadata: Metadata = { title: "Nouveau produit | Admin Droopy's" };

export default async function AdminNouveauProduitPage() {
  await requireAdmin();

  const [brands, categories, subcategories] = await Promise.all([
    listBrandOptions(),
    listCategoryOptions(),
    listSubcategoryOptions(),
  ]);

  return (
    <div className="admin-page">
      {/* Retour au catalogue, au-dessus du titre : c'est là qu'on le cherche
          quand on s'est trompé de page, avant même d'avoir lu le titre. */}
      <Link href="/admin/produits" className="admin-back">
        <span aria-hidden>←</span> Retour aux produits
      </Link>

      <AdminPageHeader
        title="Nouveau produit"
        lead="Fiche complète : identité, classement, tailles, descriptif et photos."
      />

      <ProductForm
        brands={brands}
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
