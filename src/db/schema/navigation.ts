import { relations, sql } from "drizzle-orm";
import { check, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { brands, subcategories } from "./catalog";

/**
 * Menu principal : rubriques, colonnes, liens, visuels.
 *
 * Quatre tables et non un arbre auto-référent à colonne `kind`. Un arbre
 * générique laisserait rattacher un lien directement à une rubrique, sans
 * colonne : un état que le rendu ne sait pas dessiner et que rien
 * n'empêcherait d'écrire. Ici il n'est pas représentable.
 */

/** Une rubrique de la barre : « Fille 2-16 ans ». Sans colonne, simple lien. */
export const navSections = pgTable("nav_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull(),
  /** Adresse de la rubrique elle-même, reprise au bas du panneau. */
  href: text("href").notNull(),
  position: integer("position").notNull().default(0),
});

export const navColumns = pgTable("nav_columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => navSections.id, { onDelete: "cascade" }),
  /** Intitulé de colonne. Une chaîne vide rend une colonne sans titre. */
  title: text("title").notNull(),
  /** Lien « voir tout » en gras qui clôt la colonne, quand elle en a un. */
  allLabel: text("all_label"),
  allHref: text("all_href"),
  position: integer("position").notNull().default(0),
});

export const navLinks = pgTable("nav_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  columnId: uuid("column_id")
    .notNull()
    .references(() => navColumns.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  /**
   * Adresse libre et non une clé étrangère : le menu doit pouvoir mener à un
   * sous-rayon, à une marque, à une page d'aide ou à un lien de campagne. Le
   * jour où un lien pointe dans le vide, c'est une page 404, pas une donnée
   * corrompue — la contrainte coûterait plus qu'elle ne rapporte.
   */
  href: text("href").notNull(),
  position: integer("position").notNull().default(0),
});

/**
 * Visuel mis en avant à droite d'un panneau.
 *
 * Il ne porte ni titre, ni adresse, ni image : les trois sont lus sur sa
 * cible. Un visuel ne peut donc pas annoncer « Robes » et mener ailleurs, ni
 * montrer une photo que la page d'arrivée n'a pas.
 */
export const navFeatures = pgTable(
  "nav_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => navSections.id, { onDelete: "cascade" }),
    subcategoryId: uuid("subcategory_id").references(() => subcategories.id, {
      onDelete: "cascade",
    }),
    brandId: uuid("brand_id").references(() => brands.id, {
      onDelete: "cascade",
    }),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    // Exactement une cible. Deux colonnes nullables sans cette contrainte
    // laisseraient écrire un visuel qui ne montre rien, ou qui montre deux
    // choses — et c'est le rendu qui aurait à trancher, trop tard.
    check(
      "nav_features_one_target",
      sql`(${table.subcategoryId} is not null)::int + (${table.brandId} is not null)::int = 1`,
    ),
  ],
);

export const navSectionsRelations = relations(navSections, ({ many }) => ({
  columns: many(navColumns),
  features: many(navFeatures),
}));

export const navColumnsRelations = relations(navColumns, ({ one, many }) => ({
  section: one(navSections, {
    fields: [navColumns.sectionId],
    references: [navSections.id],
  }),
  links: many(navLinks),
}));

export const navLinksRelations = relations(navLinks, ({ one }) => ({
  column: one(navColumns, {
    fields: [navLinks.columnId],
    references: [navColumns.id],
  }),
}));

export const navFeaturesRelations = relations(navFeatures, ({ one }) => ({
  section: one(navSections, {
    fields: [navFeatures.sectionId],
    references: [navSections.id],
  }),
  subcategory: one(subcategories, {
    fields: [navFeatures.subcategoryId],
    references: [subcategories.id],
  }),
  brand: one(brands, {
    fields: [navFeatures.brandId],
    references: [brands.id],
  }),
}));
