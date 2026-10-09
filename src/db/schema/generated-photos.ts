import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Photos générées par l'IA depuis la fiche produit (Admin → Photos IA).
 *
 * Gardées dès leur création, indépendamment de la fiche : chaque photo est
 * payée à Google, et une fiche qu'on n'enregistre pas — ou une photo qu'on
 * retire de la fiche — ne doit pas la faire disparaître. Marque et nom sont
 * ceux saisis au moment de la génération, pour la retrouver.
 */
export const generatedPhotos = pgTable("generated_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** URL publique dans le bucket `photos-ia`. */
  url: text("url").notNull(),
  /** Prise de vue : « porte », « detail »… — voir `GenerationMode`. */
  shot: text("shot").notNull(),
  brand: text("brand").notNull().default(""),
  productName: text("product_name").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
