import "server-only";

import { and, asc, desc, eq, or, sql, type SQL } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";
import { db } from "@/db";
import { orderLines, orders } from "@/db/schema";

/**
 * Commandes vues depuis l'espace client.
 *
 * Un client voit les commandes passées connecté (`customer_id`) **et** celles
 * passées en invité avec son adresse — mais seulement si cette adresse est
 * confirmée. Sans cette condition, s'inscrire avec l'e-mail de quelqu'un
 * d'autre suffirait à lire ses commandes, adresse de livraison comprise.
 */
function ownedBy(user: User): SQL {
  const byAccount = eq(orders.customerId, user.id);
  if (!user.email || !user.email_confirmed_at) return byAccount;

  // Comparaison sans casse : Stripe rend l'adresse telle que saisie.
  const byEmail = sql`lower(${orders.customerEmail}) = ${user.email.toLowerCase()}`;
  return or(byAccount, byEmail) ?? byAccount;
}

export type CustomerOrderSummary = {
  reference: string;
  placedAt: Date;
  status: (typeof orders.$inferSelect)["status"];
  totalCents: number;
  lineCount: number;
};

export async function listCustomerOrders(
  user: User,
  limit?: number,
): Promise<CustomerOrderSummary[]> {
  const query = db
    .select({
      reference: orders.reference,
      placedAt: orders.placedAt,
      status: orders.status,
      // Total recalculé depuis les lignes figées : voir `queries/orders`.
      totalCents: sql<number>`(
        coalesce((
          select sum(l.unit_price_cents * l.quantity)
          from order_lines l where l.order_id = "orders"."id"
        ), 0) - "orders"."discount_cents" + "orders"."shipping_cents"
      )::int`,
      lineCount: sql<number>`(
        select coalesce(sum(l.quantity), 0) from order_lines l where l.order_id = "orders"."id"
      )::int`,
    })
    .from(orders)
    .where(ownedBy(user))
    .orderBy(desc(orders.placedAt));

  return limit ? query.limit(limit) : query;
}

/**
 * Une commande par sa référence, **si elle appartient au client**. La
 * propriété est dans la clause `where` : une référence devinée ne rend rien,
 * exactement comme une référence inexistante.
 */
export async function getCustomerOrder(user: User, reference: string) {
  return db.query.orders.findFirst({
    where: and(eq(orders.reference, reference), ownedBy(user)),
    with: { lines: { orderBy: [asc(orderLines.productName)] } },
  });
}
