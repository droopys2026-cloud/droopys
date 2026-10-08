import type { Metadata } from "next";
import Link from "next/link";
import { asc, count, eq } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { BrandList } from "@/components/admin/brand-list";
import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Marques | Admin Droopy's" };

export default async function AdminMarquesPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: brands.id,
      slug: brands.slug,
      name: brands.name,
      productCount: count(products.id),
    })
    .from(brands)
    .leftJoin(products, eq(products.brandId, brands.id))
    .groupBy(brands.id)
    .orderBy(asc(brands.position));

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Marques"
        lead="Les maisons distribuées par Droopy's. Chaque marque a sa page en boutique."
        action={
          <Link href="/admin/marques/nouvelle" className="admin-button">
            Ajouter une marque
          </Link>
        }
      />

      <BrandList rows={rows} />
    </div>
  );
}
