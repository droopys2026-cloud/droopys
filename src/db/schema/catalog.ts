import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Catalogue : marques, rayons, produits, images et stock par taille.
 *
 * Le schéma reprend le vocabulaire déjà employé par le front (`@/types/product`,
 * `@/types/product-draft`) plutôt que d'en inventer un second : un champ de la
 * fiche produit se retrouve sous le même nom en base, au passage snake_case
 * près qu'impose Postgres.
 */

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Sert d'URL de rayon : /marques/stone-island. */
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** Logotype officiel en SVG. Absent, on retombe sur le nom composé. */
  logoUrl: text("logo_url"),
  /**
   * Rapport largeur/hauteur du viewBox du SVG, recopié du fichier et non
   * arrondi : il sert à donner la même surface à l'écran à des logotypes de
   * proportions très différentes (voir `lib/brands.ts`).
   */
  logoRatio: real("logo_ratio"),
  /** Ordre d'affichage dans la bande de marques. */
  position: integer("position").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** bebe, fille, garcon… Sert d'URL de rayon : /fille. */
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  /** Titre affiché en grand dans l'en-tête, s'il diffère du nom du rayon. */
  headline: text("headline"),
  eyebrow: text("eyebrow"),
  intro: text("intro"),
  imageUrl: text("image_url"),
  hoverImageUrl: text("hover_image_url"),
  /** Recadrages relevés au pixel près, propres à chaque photo. */
  imageClassName: text("image_class_name"),
  backdropClassName: text("backdrop_class_name"),
  position: integer("position").notNull().default(0),
});

/**
 * Sous-rayons : le deuxième niveau du menu et de l'URL, /fille/robes.
 *
 * Ils sont une table et non une colonne de texte sur le produit, parce qu'ils
 * sont d'abord des **destinations** : un lien de menu pointe vers une ligne
 * d'ici. Un sous-rayon saisi librement sur chaque fiche donnerait « Robes »,
 * « robes » et « Robe » pour la même page, et un menu qui promet un rayon vide.
 */
export const subcategories = pgTable(
  "subcategories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    /** Deuxième segment de l'URL : robes, manteaux, 2-6-ans. */
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    intro: text("intro"),
    /** Photo posée en fond d'en-tête, et reprise par les visuels du menu. */
    imageUrl: text("image_url"),
    imageClassName: text("image_class_name"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    // Unique par rayon et non globalement : /fille/manteaux et
    // /garcon/manteaux sont deux pages légitimes.
    uniqueIndex("subcategories_category_slug_key").on(
      table.categoryId,
      table.slug,
    ),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Identifiant d'URL, stable et lisible : /produits/robe-lin-ecru. */
    slug: text("slug").notNull(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    name: text("name").notNull(),

    /** Prix en centimes : jamais de flottant sur la monnaie. */
    priceCents: integer("price_cents").notNull(),
    /** Prix barré, présent seulement si le produit est en promotion. */
    compareAtPriceCents: integer("compare_at_price_cents"),
    /** Référence fournisseur, imprimée en bas de fiche. */
    reference: text("reference"),

    categoryId: uuid("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    /**
     * Sous-rayon (robes, manteaux…), tel qu'il figure au menu principal.
     * `set null` et non `cascade` : supprimer un sous-rayon range ses pièces
     * ailleurs, il ne les efface pas du catalogue.
     */
    subcategoryId: uuid("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null",
    }),

    /**
     * Descriptif en points, une ligne par point. En jsonb plutôt qu'en table
     * fille : ces lignes n'ont ni identité ni requête propre, elles ne sont
     * jamais lues autrement qu'avec le produit.
     */
    description: jsonb("description").$type<string[]>().notNull().default([]),
    composition: text("composition"),
    care: text("care"),
    madeIn: text("made_in"),

    /** « Notre mannequin mesure 1 m 75 et porte une taille 36. » */
    modelNote: text("model_note"),
    measurements: jsonb("measurements")
      .$type<{ label: string; value: string }[]>()
      .notNull()
      .default([]),
    /**
     * Conseil de taille propre à la pièce. C'est le renseignement qui évite
     * le plus de retours, d'où sa place juste sous le sélecteur de taille.
     */
    sizeAdvice: text("size_advice"),

    /** Étiquette affichée en pastille sur l'image (« Nouveau », « -30 % »). */
    badge: text("badge"),

    /** Faux tant que la fiche est un brouillon : invisible côté boutique. */
    published: boolean("published").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Le slug est l'adresse de la fiche : deux produits au même slug, c'est
    // une page qui en cache une autre. L'unicité est donc une règle métier,
    // pas une commodité d'index.
    uniqueIndex("products_slug_key").on(table.slug),
  ],
);

/**
 * Couleurs d'une fiche. Facultatives : une pièce sans couleur n'en a aucune
 * ligne, et tout le reste fonctionne comme avant.
 *
 * Une table plutôt qu'un libellé répété sur chaque déclinaison : la couleur a
 * ses propres photos et sa teinte de pastille, et la renommer ne doit pas
 * obliger à retoucher chaque taille.
 */
export const productColors = pgTable(
  "product_colors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Nom affiché : « Rose poudré ». */
    name: text("name").notNull(),
    /** Forme d'URL du nom, pour `?couleur=rose-poudre`. */
    slug: text("slug").notNull(),
    /** Teinte de la pastille, `#rrggbb`. */
    hex: text("hex").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    // Deux « Rose » sur une fiche : la cliente ne saurait pas lequel choisir,
    // et l'adresse `?couleur=rose` désignerait deux couleurs.
    uniqueIndex("product_colors_product_slug_key").on(
      table.productId,
      table.slug,
    ),
  ],
);

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  /**
   * Couleur que la photo montre. Vide : photo commune, affichée quelle que
   * soit la couleur choisie (détail de matière, étiquette…).
   */
  colorId: uuid("color_id").references(() => productColors.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  /** Texte alternatif. Vide, le rendu retombe sur « marque — nom ». */
  alt: text("alt"),
  /**
   * Ordre de saisie. La première image fait la carte, la deuxième son
   * survol, toutes font la galerie de la fiche.
   */
  position: integer("position").notNull().default(0),
});

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Couleur de la déclinaison ; vide pour une pièce sans couleur. */
    colorId: uuid("color_id").references(() => productColors.id, {
      onDelete: "cascade",
    }),
    /** Taille telle qu'affichée : « 4 ans », « 38 », « 6 mois ». */
    size: text("size").notNull(),
    /** Quantité en stock. 0 = taille affichée mais indisponible. */
    quantity: integer("quantity").notNull().default(0),
    /**
     * Prix propre à cette déclinaison, en centimes. Vide : prix du produit.
     * Lire le prix par `variantPriceCents`, jamais ce champ seul.
     */
    priceCents: integer("price_cents"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    // Une taille ne peut apparaître qu'une fois par couleur, sinon le stock
    // se répartit sur deux lignes et aucune n'est la vérité. `nulls not
    // distinct` : sans lui, deux « 8 ans » sans couleur passeraient, Postgres
    // tenant deux vides pour différents.
    unique("product_variants_product_color_size_key")
      .on(table.productId, table.colorId, table.size)
      .nullsNotDistinct(),
  ],
);

/**
 * Relations pour l'API de requêtes de Drizzle (`db.query.…`).
 *
 * Elles ne créent aucune contrainte en base — les clés étrangères ci-dessus
 * s'en chargent. Elles disent seulement à Drizzle comment charger un produit
 * avec sa marque, ses images et ses tailles en une requête au lieu de quatre.
 */
export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    products: many(products),
  }),
);

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
  images: many(productImages),
  variants: many(productVariants),
  colors: many(productColors),
}));

export const productColorsRelations = relations(productColors, ({ one }) => ({
  product: one(products, {
    fields: [productColors.productId],
    references: [products.id],
  }),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    color: one(productColors, {
      fields: [productVariants.colorId],
      references: [productColors.id],
    }),
  }),
);
