import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PromoForm } from "@/components/admin/promo-form";
import { requireAdmin } from "@/lib/auth";
import { listPromoProductOptions } from "@/lib/queries/admin-catalog";

export const metadata: Metadata = { title: "Nouveau code promo | Admin Droopy's" };

export default async function AdminNouveauCodePromoPage() {
  await requireAdmin();
  const products = await listPromoProductOptions();

  return (
    <div className="admin-page">
      <Link href="/admin/codes-promo" className="admin-back">
        <span aria-hidden>←</span> Retour aux codes promo
      </Link>
      <AdminPageHeader title="Nouveau code promo" />
      <PromoForm products={products} />
    </div>
  );
}
