import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductFilters } from "@/components/admin/product-filters";
import { ProductList } from "@/components/admin/product-list";
import { requireAdmin } from "@/lib/auth";
import {
  listAdminProducts,
  listBrandOptions,
  listCategoryOptions,
} from "@/lib/queries/admin-catalog";

export const metadata: Metadata = { title: "Produits | Admin Droopy's" };

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/** Un paramètre répété (?q=a&q=b) arrive en tableau : on ne garde que le premier. */
function single(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

export default async function AdminProduitsPage({ searchParams }: PageProps) {
  await requireAdmin();

  const params = await searchParams;
  const filters = {
    q: single(params.q),
    brand: single(params.brand),
    category: single(params.category),
    etat: single(params.etat),
  };

  const [rows, brands, categories] = await Promise.all([
    listAdminProducts(filters),
    listBrandOptions(),
    listCategoryOptions(),
  ]);

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

      <ProductFilters
        filters={filters}
        brands={brands}
        categories={categories}
      />

      <ProductList
        rows={rows}
        narrowed={Object.values(filters).some(Boolean)}
        query={filters.q}
      />
    </div>
  );
}
