import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PromoForm } from "@/components/admin/promo-form";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { listPromoProductOptions } from "@/lib/queries/admin-catalog";

export const metadata: Metadata = { title: "Modifier un code promo | Admin Droopy's" };

type PageProps = { params: Promise<{ id: string }> };

/** `AAAA-MM-JJ` du jour de fin, heure de Paris — la forme du champ date. */
function parisDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(date);
}

export default async function AdminCodePromoPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  // Un identifiant mal formé est une 404, pas une erreur de base.
  if (!z.string().uuid().safeParse(id).success) notFound();

  const [promo, products] = await Promise.all([
    db.query.promoCodes.findFirst({
      where: eq(promoCodes.id, id),
      with: { products: { columns: { productId: true } } },
    }),
    listPromoProductOptions(),
  ]);
  if (!promo) notFound();

  return (
    <div className="admin-page">
      <Link href="/admin/codes-promo" className="admin-back">
        <span aria-hidden>←</span> Retour aux codes promo
      </Link>
      <AdminPageHeader
        title={promo.code}
        lead={`${promo.uses} utilisation${promo.uses > 1 ? "s" : ""}`}
      />
      <PromoForm
        products={products}
        promo={{
          id: promo.id,
          code: promo.code,
          kind: promo.kind,
          value: promo.value,
          scope: promo.scope,
          productIds: promo.products.map((entry) => entry.productId),
          endsOn: promo.endsAt ? parisDay(promo.endsAt) : "",
          maxUses: promo.maxUses,
          minSubtotalCents: promo.minSubtotalCents,
          oncePerCustomer: promo.oncePerCustomer,
          active: promo.active,
          announce: promo.announce,
          announcement: promo.announcement,
        }}
      />
    </div>
  );
}
