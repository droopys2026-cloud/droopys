import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Messages laissés par le formulaire de contact, traités dans Admin →
 * Messages clients.
 *
 * Gardés en base et non seulement envoyés par e-mail : un e-mail se perd dans
 * une boîte partagée, une liste avec un état « traité » se suit à plusieurs.
 */
export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  /** Facultatif dans le formulaire : `null` si non renseigné. */
  phone: text("phone"),
  subject: text("subject").notNull(),
  /** Numéro de commande cité par le client, tel que saisi — non vérifié. */
  orderReference: text("order_reference"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  /** Traité par la boutique (réponse faite) : vide tant que non traité. */
  handledAt: timestamp("handled_at", { withTimezone: true }),
});
