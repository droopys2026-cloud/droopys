import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { products } from "./catalog";

/**
 * Comptes clients.
 *
 * L'identité (e-mail, mot de passe, liaison Google) vit dans Supabase Auth ;
 * ces tables ne portent que ce que la boutique sait du client en plus. L'e-mail
 * n'est **pas** recopié ici : deux exemplaires d'une même adresse finissent
 * toujours par diverger, et c'est Supabase qui sait si elle est confirmée.
 */

/**
 * Un client, identifié par l'`id` de `auth.users`.
 *
 * Pas de clé étrangère vers `auth.users` : ce schéma appartient à Supabase et
 * drizzle-kit n'a pas à le connaître. La ligne est créée à la première
 * connexion confirmée (`ensureCustomer`), pas par un trigger SQL — une règle
 * de plus cachée dans la base, c'est une règle qu'on oublie.
 */
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customerAddresses = pgTable(
  "customer_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    /** Nom du destinataire : ce n'est pas forcément le titulaire du compte. */
    fullName: text("full_name").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    postalCode: text("postal_code").notNull(),
    city: text("city").notNull(),
    /** Code ISO à deux lettres, comme ceux qu'accepte le paiement Stripe. */
    country: text("country").notNull().default("FR"),
    phone: text("phone"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Une seule adresse par défaut par client, imposée par la base : deux
    // requêtes simultanées ne peuvent pas en laisser deux cochées.
    uniqueIndex("customer_addresses_default_key")
      .on(table.customerId)
      .where(sql`${table.isDefault}`),
  ],
);

/**
 * Favoris d'un client. La clé primaire composée interdit le doublon : ajouter
 * deux fois la même pièce ne crée pas deux lignes.
 */
export const wishlistItems = pgTable(
  "wishlist_items",
  {
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.customerId, table.productId] })],
);

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(customerAddresses),
  wishlist: many(wishlistItems),
}));

export const customerAddressesRelations = relations(
  customerAddresses,
  ({ one }) => ({
    customer: one(customers, {
      fields: [customerAddresses.customerId],
      references: [customers.id],
    }),
  }),
);

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  customer: one(customers, {
    fields: [wishlistItems.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));
