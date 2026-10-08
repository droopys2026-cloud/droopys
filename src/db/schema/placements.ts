import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { products, subcategories } from "./catalog";

/**
 * Placements éditoriaux : le même article rangé dans plusieurs sous-rayons.
 *
 * `products.subcategory_id` dit **d'où vient** une pièce — le rayon d'âge où
 * elle a été saisie, et le seul qui figure sur sa fiche. Une doudoune garçon
 * doit pourtant aussi se trouver sous /manteaux/doudounes, sans cesser d'être
 * une pièce du rayon garçon. Un second champ ne suffirait pas : rien ne dit
 * qu'il n'y aura jamais qu'une seule mise en avant.
 *
 * Le contenu de cette table est choisi à la main dans l'administration. C'est
 * une décision de vitrine, pas une propriété de l'article : aucune règle
 * automatique ne la remplit.
 */
export const productPlacements = pgTable(
  "product_placements",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    subcategoryId: uuid("subcategory_id")
      .notNull()
      .references(() => subcategories.id, { onDelete: "cascade" }),
    /** Ordre dans la sélection : la vitrine se compose, elle ne se subit pas. */
    position: integer("position").notNull().default(0),
  },
  (table) => [
    // Clé composite : un article placé deux fois au même endroit n'est pas un
    // article mis en avant deux fois, c'est une ligne en trop.
    primaryKey({ columns: [table.productId, table.subcategoryId] }),
  ],
);

export const productPlacementsRelations = relations(
  productPlacements,
  ({ one }) => ({
    product: one(products, {
      fields: [productPlacements.productId],
      references: [products.id],
    }),
    subcategory: one(subcategories, {
      fields: [productPlacements.subcategoryId],
      references: [subcategories.id],
    }),
  }),
);
