import { statusLabel, type OrderStatus } from "@/types/order";

/**
 * État d'une commande en pastille de couleur, le même partout dans l'admin.
 * La couleur aide à balayer une liste ; le libellé reste écrit, pour qui ne
 * distingue pas les couleurs.
 */
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`admin-badge admin-status admin-status--${status}`}>{statusLabel(status)}</span>;
}
