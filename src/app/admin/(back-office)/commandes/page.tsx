import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderList } from "@/components/admin/order-list";
import { requireAdmin } from "@/lib/auth";
import { countOrdersByStatus, listOrders } from "@/lib/queries/orders";

export const metadata: Metadata = { title: "Commandes | Admin Droopy's" };

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function single(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

export default async function AdminCommandesPage({ searchParams }: PageProps) {
  await requireAdmin();

  const params = await searchParams;
  const filters = { q: single(params.q), etat: single(params.etat) };

  const [rows, counts] = await Promise.all([
    listOrders(filters),
    countOrdersByStatus(),
  ]);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Commandes"
        lead="Ce qu'il y a à préparer, à expédier et à suivre."
      />
      <OrderList rows={rows} filters={filters} counts={counts} />
    </div>
  );
}
