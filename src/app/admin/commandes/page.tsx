import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderList } from "@/components/admin/order-list";

export const metadata: Metadata = { title: "Commandes | Admin Droopys" };

export default function AdminCommandesPage() {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Commandes"
        lead="Ce qu'il y a à préparer, à expédier et à suivre."
      />
      <OrderList />
    </div>
  );
}
