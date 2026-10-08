import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

/**
 * Invalide les deux mondes après une écriture sur la taxonomie : la boutique
 * lit un cache étiqueté, l'admin lit la base sans cache. Oublier l'un des
 * deux laisse l'un des deux sur des valeurs périmées.
 *
 * Dans un module à part et non dans un fichier d'actions : un fichier
 * `"use server"` ne peut exporter que des fonctions asynchrones.
 */
export function revalidateTaxonomy(categorySlug: string) {
  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/menu");
  revalidatePath("/admin/rayons");
  revalidatePath(`/admin/rayons/${categorySlug}`);
  revalidatePath(`/${categorySlug}`);
}
