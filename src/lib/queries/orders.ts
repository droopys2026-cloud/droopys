import "server-only";

import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { orderLines, orders } from "@/db/schema";
import type { OrderStatus } from "@/types/order";

/**
 * Lecture des commandes.
 *
 * Aucune vente n'a encore eu lieu : ces fonctions rendent des listes vides,
 * et c'est la bonne réponse. Les écrire maintenant évite qu'un tableau soit
 * bâti sur des données de démonstration puis refait le jour de la première
 * commande — le moment où on a le moins envie de toucher à ce code.
 */

export type OrderRow = {
  id: string;
  reference: string;
  placedAt: Date;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  shippingCents: number;
  payment: string;
  trackingNumber: string | null;
  /** Total payé : lignes plus port, figé à la commande. */
  totalCents: number;
  lineCount: number;
};

export type OrderFilters = { q?: string; etat?: string };

const ORDER_STATUS_IDS = [
  "a-preparer",
  "expediee",
  "livree",
  "retour",
  "annulee",
  "remboursee",
] as const;

function asStatus(value: string | undefined): OrderStatus | undefined {
  return ORDER_STATUS_IDS.find((id) => id === value);
}

export const listOrders = cache(
  async (filters: OrderFilters = {}): Promise<OrderRow[]> => {
    const conditions: SQL[] = [];

    const status = asStatus(filters.etat);
    if (status) conditions.push(eq(orders.status, status));

    const q = filters.q?.trim();
    if (q) {
      const pattern = `%${q}%`;
      const search = or(
        ilike(orders.reference, pattern),
        ilike(orders.customerName, pattern),
        ilike(orders.customerEmail, pattern),
      );
      if (search) conditions.push(search);
    }

    return db
      .select({
        id: orders.id,
        reference: orders.reference,
        placedAt: orders.placedAt,
        status: orders.status,
        customerName: orders.customerName,
        customerEmail: orders.customerEmail,
        shippingCents: orders.shippingCents,
        payment: orders.payment,
        trackingNumber: orders.trackingNumber,
        // Le total est recalculé depuis les lignes figées, pas stocké : une
        // colonne « total » et des lignes peuvent diverger, deux vérités pour
        // un même montant, et c'est toujours la mauvaise qu'on affiche.
        //
        // Les noms de tables sont écrits en toutes lettres et non interpolés :
        // dans un fragment `sql` de projection, Drizzle rend les colonnes
        // **sans préfixe**, et `where "order_id" = "id"` compare alors la
        // ligne à elle-même au lieu de la rattacher à sa commande. Le compte
        // revient à zéro sans que rien n'échoue — un bug qui ne se voit qu'à
        // l'écran.
        totalCents: sql<number>`(
          coalesce((
            select sum(l.unit_price_cents * l.quantity)
            from order_lines l where l.order_id = "orders"."id"
          ), 0) + "orders"."shipping_cents"
        )::int`,
        lineCount: sql<number>`(
          select count(*) from order_lines l where l.order_id = "orders"."id"
        )::int`,
      })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.placedAt));
  },
);

export const getOrder = cache(async (id: string) =>
  db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      lines: { orderBy: [asc(orderLines.productName)] },
      withdrawals: { orderBy: (row, { asc: ascending }) => [ascending(row.createdAt)] },
    },
  }),
);

/** Nombre de commandes par état, pour les compteurs des filtres. */
export const countOrdersByStatus = cache(async () => {
  const rows = await db
    .select({ status: orders.status, total: count() })
    .from(orders)
    .groupBy(orders.status);

  return new Map(rows.map((row) => [row.status, row.total]));
});

export type CustomerRow = {
  email: string;
  name: string;
  orderCount: number;
  spentCents: number;
  lastOrderAt: Date;
};

/**
 * Les clients, déduits des commandes.
 *
 * Il n'y a pas de table `customers`, et c'est volontaire : tant que la
 * boutique n'a pas de comptes clients, un client **est** l'ensemble de ses
 * commandes. Créer la table avant d'avoir des comptes obligerait à la tenir
 * synchronisée avec les commandes, pour rien.
 */
export const listCustomers = cache(async (): Promise<CustomerRow[]> => {
  return db
    .select({
      email: orders.customerEmail,
      // Le nom le plus récent l'emporte : c'est celui de la dernière commande,
      // donc le plus à jour en cas de changement.
      name: sql<string>`(array_agg(${orders.customerName} order by ${orders.placedAt} desc))[1]`,
      orderCount: sql<number>`count(*)::int`,
      spentCents: sql<number>`coalesce(sum(coalesce((
        select sum(l.unit_price_cents * l.quantity)
        from order_lines l where l.order_id = "orders"."id"
      ), 0) + "orders"."shipping_cents"), 0)::int`,
      lastOrderAt: sql<Date>`max(${orders.placedAt})`,
    })
    .from(orders)
    .groupBy(orders.customerEmail)
    .orderBy(desc(sql`max(${orders.placedAt})`));
});
