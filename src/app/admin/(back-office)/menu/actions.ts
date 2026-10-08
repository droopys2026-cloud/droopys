"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import { swapTargets } from "@/lib/navigation/ordering";

/**
 * Déplace un onglet du menu d'un cran.
 *
 * Un onglet *est* un rayon : on échange donc la position de deux rayons, ce
 * qui change d'un coup l'ordre du menu et celui de la liste des rayons — les
 * deux ne peuvent pas diverger.
 */
export async function moveMenuTab(formData: FormData) {
  await requireAdmin();

  const parsed = z
    .object({ categoryId: z.string().uuid(), direction: z.enum(["haut", "bas"]) })
    .safeParse({
      categoryId: formData.get("categoryId") ?? "",
      direction: formData.get("direction") ?? "",
    });
  if (!parsed.success) return;

  const rows = await db
    .select({ id: categories.id, position: categories.position })
    .from(categories)
    .orderBy(asc(categories.position));

  const swap = swapTargets(rows, parsed.data.categoryId, parsed.data.direction);
  if (!swap) return;

  await db.update(categories).set({ position: swap.other.position }).where(eq(categories.id, swap.current.id));
  await db.update(categories).set({ position: swap.current.position }).where(eq(categories.id, swap.other.id));

  // Le menu est dans l'en-tête de toutes les pages : c'est le cache du
  // catalogue qu'on invalide, pas une page en particulier.
  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/menu");
  revalidatePath("/admin/rayons");
}
