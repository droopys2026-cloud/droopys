import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { products, productVariants } from "@/db/schema/catalog";
import { customers } from "@/db/schema/customers";
import { withdrawals } from "@/db/schema/withdrawals";

/**
 * Commandes.
 *
 * Deux règles tiennent tout le reste :
 *
 * 1. Les montants sont en centimes, jamais en flottant.
 * 2. Chaque ligne **fige** ce qui a été payé — nom, marque, taille, prix
 *    unitaire. Si le produit change de nom ou de prix demain, la commande
 *    d'hier ne change pas avec lui. Le lien vers le produit n'existe que pour
 *    le confort de l'admin ; il peut être rompu sans invalider la commande.
 */

/** Les libellés français vivent dans `ORDER_STATUSES` (`@/types/order`). */
export const orderStatus = pgEnum("order_status", [
  "a-preparer",
  "expediee",
  "livree",
  "retour",
  "annulee",
  "remboursee",
]);

/**
 * Mode de livraison choisi au tunnel. Le retrait en boutique n'a pas
 * d'adresse d'expédition : c'est ce champ qui le dit, pas une adresse vide.
 */
export const deliveryMethod = pgEnum("delivery_method", ["domicile", "retrait", "relais"]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Numéro lisible, celui que le client cite : DR-2026-0001. */
  reference: text("reference").notNull().unique(),
  placedAt: timestamp("placed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  status: orderStatus("status").notNull().default("a-preparer"),

  /**
   * Compte qui a passé la commande, s'il était connecté. `set null` : un
   * client qui supprime son compte ne fait pas disparaître ses commandes,
   * qui restent des pièces comptables.
   */
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  /** Saisi au tunnel : le transporteur appelle quand il ne trouve pas. */
  customerPhone: text("customer_phone"),
  deliveryMethod: deliveryMethod("delivery_method").notNull().default("domicile"),
  /**
   * Service choisi au tunnel (`mondial-relay-relais`…) et tranche Sendcloud
   * payée : c'est avec eux que l'étiquette sera créée. Vides pour un retrait.
   */
  shippingService: text("shipping_service"),
  shippingMethodId: integer("shipping_method_id"),
  /** Point relais Sendcloud, pour une livraison en relais. */
  servicePointId: integer("service_point_id"),
  /** Adresse figée à la commande, une ligne par élément. */
  shippingAddress: jsonb("shipping_address")
    .$type<string[]>()
    .notNull()
    .default([]),

  shippingCents: integer("shipping_cents").notNull().default(0),
  /** Moyen de paiement tel qu'annoncé au client. */
  payment: text("payment").notNull(),

  /** Numéro de suivi, rempli à la création de l'étiquette Sendcloud. */
  trackingNumber: text("tracking_number"),
  /** Page de suivi du transporteur, donnée par Sendcloud. */
  trackingUrl: text("tracking_url"),
  /** Colis Sendcloud : c'est par lui qu'on réimprime l'étiquette. */
  sendcloudParcelId: integer("sendcloud_parcel_id"),
  labelCreatedAt: timestamp("label_created_at", { withTimezone: true }),
  /** Étiquette de test (lettre non affranchie) : à ne pas déposer. */
  labelIsTest: boolean("label_is_test"),

  /** Identifiant de session Stripe, pour rapprocher un paiement d'un litige. */
  stripeSessionId: text("stripe_session_id"),

  /**
   * Total déjà remboursé depuis l'admin, en centimes. Un remboursement peut
   * être partiel (un seul article retourné) : le reste à rembourser se
   * calcule à partir de ce cumul, pour ne jamais rendre plus que le payé.
   */
  refundedCents: integer("refunded_cents").notNull().default(0),
  /** Dernier remboursement. */
  refundedAt: timestamp("refunded_at", { withTimezone: true }),
});

export const orderLines = pgTable("order_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  // `set null` et non `cascade` : supprimer un produit du catalogue ne doit
  // jamais effacer une ligne de commande — c'est une pièce comptable.
  productId: uuid("product_id").references(() => products.id, {
    onDelete: "set null",
  }),
  variantId: uuid("variant_id").references(() => productVariants.id, {
    onDelete: "set null",
  }),

  productName: text("product_name").notNull(),
  brand: text("brand"),
  /** Nom de la couleur au moment de l'achat ; vide pour une pièce sans couleur. */
  color: text("color"),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
});

/** Relations pour l'API de requêtes (`db.query.orders.findFirst({ with })`). */
export const ordersRelations = relations(orders, ({ many }) => ({
  lines: many(orderLines),
  withdrawals: many(withdrawals),
}));

export const orderLinesRelations = relations(orderLines, ({ one }) => ({
  order: one(orders, {
    fields: [orderLines.orderId],
    references: [orders.id],
  }),
  /** Le produit d'origine, s'il existe encore — pour estimer le poids du colis. */
  product: one(products, {
    fields: [orderLines.productId],
    references: [products.id],
  }),
}));
