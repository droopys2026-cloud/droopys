import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PromoList } from "@/components/admin/promo-list";
import { db } from "@/db";
import { promoCodeProducts, promoCodes } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Codes promo | Admin Droopy's" };

export default async function AdminCodesPromoPage() {
  await requireAdmin();

  const rows = await db
    .select({
      id: promoCodes.id,
      code: promoCodes.code,
      kind: promoCodes.kind,
      value: promoCodes.value,
      scope: promoCodes.scope,
      endsAt: promoCodes.endsAt,
      maxUses: promoCodes.maxUses,
      uses: promoCodes.uses,
      active: promoCodes.active,
      announce: promoCodes.announce,
      productCount: count(promoCodeProducts.productId),
    })
    .from(promoCodes)
    .leftJoin(promoCodeProducts, eq(promoCodeProducts.promoCodeId, promoCodes.id))
    .groupBy(promoCodes.id)
    .orderBy(desc(promoCodes.createdAt));

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Codes promo"
        lead="Des remises sur tout le site ou sur quelques produits. Les articles déjà soldés n'en profitent jamais."
        action={
          <Link href="/admin/codes-promo/nouveau" className="admin-button">
            Créer un code
          </Link>
        }
      />

      <PromoList rows={rows} now={new Date()} />
    </div>
  );
}
