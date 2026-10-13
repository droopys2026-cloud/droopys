"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

const idSchema = z.object({ id: z.string().uuid() });

/**
 * Marque un message comme traité, ou le rouvre. Un seul bouton qui bascule :
 * « traité » par erreur se corrige sans passer par la base.
 */
export async function toggleContactMessageHandled(formData: FormData) {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return;

  const message = await db.query.contactMessages.findFirst({
    where: eq(contactMessages.id, parsed.data.id),
    columns: { handledAt: true },
  });
  if (!message) return;

  await db
    .update(contactMessages)
    .set({ handledAt: message.handledAt ? null : new Date() })
    .where(eq(contactMessages.id, parsed.data.id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}
