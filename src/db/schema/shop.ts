import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Réglages de boutique et inscriptions à la lettre d'information.
 */

/**
 * Réglages, en lignes clé/valeur plutôt qu'en colonnes.
 *
 * Ce sont les valeurs répétées partout — seuil de livraison offerte, e-mail
 * de contact, moyens de paiement affichés. Une ligne par réglage évite une
 * migration à chaque champ ajouté au formulaire ; le prix à payer est que la
 * forme de la valeur n'est pas garantie par Postgres, donc chaque réglage
 * est relu par un schéma Zod avant usage (`@/lib/settings`).
 */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  /**
   * Date de désinscription. Renseignée plutôt que la ligne supprimée : on
   * doit pouvoir prouver qu'un désabonnement a bien été honoré.
   */
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
});
