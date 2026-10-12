import type { OrderStatus } from "@/types/order";

/**
 * Libellés d'état côté client. Distincts de ceux de l'admin (`ORDER_STATUSES`) :
 * « À préparer » est une consigne pour la boutique, pas une information pour
 * celui qui attend son colis.
 */
export const CUSTOMER_STATUS_LABELS: Record<OrderStatus, string> = {
  "a-preparer": "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  retour: "Retour en cours",
  annulee: "Annulée",
  remboursee: "Remboursée",
};
