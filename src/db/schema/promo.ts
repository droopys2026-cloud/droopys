import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "./catalog";

/**
 * Codes promo, saisis dans Admin → Codes promo.
 *
 * Le site calcule la remise (`@/lib/promo/discount`) et Stripe l'applique
 * telle quelle, sous forme de coupon à usage unique : voir
 * docs/superpowers/specs/2026-10-17-codes-promo-design.md pour le pourquoi.
 */
export const promoKind = pgEnum("promo_kind", ["percent", "amount"]);
export const promoScope = pgEnum("promo_scope", ["site", "products"]);

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** En majuscules, tel que la cliente le tape une fois normalisé : « BLACK20 ». */
    code: text("code").notNull(),
    kind: promoKind("kind").notNull(),
    /** Pourcentage (1 à 100) ou montant en centimes, selon `kind`. */
    value: integer("value").notNull(),
    scope: promoScope("scope").notNull(),
    /** Vide : sans date de fin. */
    endsAt: timestamp("ends_at", { withTimezone: true }),
    /** Vide : utilisations illimitées. */
    maxUses: integer("max_uses"),
    /** Minimum d'achat (articles, avant remise), en centimes. Vide : aucun. */
    minSubtotalCents: integer("min_subtotal_cents"),
    /** Une seule commande par adresse e-mail. */
    oncePerCustomer: boolean("once_per_customer").notNull().default(false),
    /** Commandes payées avec ce code — incrémenté par le webhook Stripe. */
    uses: integer("uses").notNull().default(0),
    /** L'interrupteur de l'admin : faux, le code est refusé sans être supprimé. */
    active: boolean("active").notNull().default(true),
    /** Annoncé dans la bande noire du site, à la place du message des réglages. */
    announce: boolean("announce").notNull().default(false),
    /** Message de la bande ; vide, il est composé à partir du code. */
    announcement: text("announcement"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Deux codes identiques : impossible de savoir lequel appliquer.
    uniqueIndex("promo_codes_code_key").on(table.code),
  ],
);

/** Produits visés par un code de portée « certains produits ». */
export const promoCodeProducts = pgTable(
  "promo_code_products",
  {
    promoCodeId: uuid("promo_code_id")
      .notNull()
      .references(() => promoCodes.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.promoCodeId, table.productId] })],
);

export const promoCodesRelations = relations(promoCodes, ({ many }) => ({
  products: many(promoCodeProducts),
}));

export const promoCodeProductsRelations = relations(promoCodeProducts, ({ one }) => ({
  promoCode: one(promoCodes, {
    fields: [promoCodeProducts.promoCodeId],
    references: [promoCodes.id],
  }),
  product: one(products, {
    fields: [promoCodeProducts.productId],
    references: [products.id],
  }),
}));
