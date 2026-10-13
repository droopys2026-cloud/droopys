import "server-only";

import { desc, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

/**
 * Messages de contact pour l'admin : les non traités d'abord, puis du plus
 * récent au plus ancien — ce qui attend une réponse ne doit pas glisser sous
 * ce qui est réglé.
 */
export async function listContactMessages() {
  return db
    .select()
    .from(contactMessages)
    .orderBy(sql`${contactMessages.handledAt} is null desc`, desc(contactMessages.createdAt));
}

/** Nombre de messages en attente, pour la pastille de la barre latérale. */
export async function countPendingContactMessages(): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(isNull(contactMessages.handledAt));
  return row?.count ?? 0;
}
