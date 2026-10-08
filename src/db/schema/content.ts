import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { ContentBlock } from "@/types/content-page";

/**
 * Pages de contenu : aide, à propos, services, informations légales.
 *
 * Le pari de `@/types/content-page` se tient jusqu'ici : la page est décrite
 * en blocs, donc modifiable par un formulaire au lieu d'un déploiement. Les
 * blocs restent en jsonb — leur forme est une union discriminée que Postgres
 * ne saurait pas contraindre, et c'est Zod qui la valide à l'entrée.
 */

export const contentGroup = pgEnum("content_group", [
  "aide",
  "a-propos",
  "services",
  "legal",
]);

export const contentPages = pgTable("content_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Chemin sans barre oblique initiale : « aide/livraison ». */
  slug: text("slug").notNull().unique(),
  group: contentGroup("group").notNull(),
  title: text("title").notNull(),
  /** Chapô : une à deux phrases, sert aussi de meta description. */
  lead: text("lead").notNull(),
  imageUrl: text("image_url"),
  imageClassName: text("image_class_name"),
  /** Vrai pour afficher un sommaire des intertitres (pages longues). */
  toc: boolean("toc").notNull().default(false),
  /**
   * Faux pour retirer la page des colonnes du pied de page. Elle reste
   * publiée et atteignable : c'est un choix d'affichage, pas une dépublication.
   */
  footer: boolean("footer").notNull().default(true),
  blocks: jsonb("blocks").$type<ContentBlock[]>().notNull().default([]),
  /**
   * Date de dernière mise à jour. Obligatoire en pratique sur les pages
   * légales : une CGV sans date n'est pas opposable.
   */
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
