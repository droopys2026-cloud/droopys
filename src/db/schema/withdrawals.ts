import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { orders } from "./orders";

/**
 * Demandes de rétractation reçues par la fonction « Se rétracter du contrat
 * ici » (directive (UE) 2023/2673, en vigueur depuis le 19 juin 2026).
 *
 * Chaque demande est gardée telle quelle, avec sa date : c'est la preuve que
 * la rétractation a été exercée, et à quel moment — le délai légal se juge sur
 * cette date, pas sur celle où la boutique l'a lue. Les articles sont
 * recopiés, comme les lignes de commande : la demande ne doit pas changer si
 * la fiche produit change.
 */
export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** `set null` : la demande survit à la commande, c'est une pièce à garder. */
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  orderReference: text("order_reference").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  /** Articles concernés, figés : « Moncler — Doudoune Maya, taille 8 ans, ×1 ». */
  items: jsonb("items").$type<{ lineId: string; label: string; quantity: number }[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** Traitée par la boutique (remboursement fait) : vide tant que non traitée. */
  handledAt: timestamp("handled_at", { withTimezone: true }),
});

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  order: one(orders, { fields: [withdrawals.orderId], references: [orders.id] }),
}));
