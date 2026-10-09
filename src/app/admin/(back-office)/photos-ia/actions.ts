"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { removeGeneratedPhoto } from "@/lib/photos/library";

/** Supprime une photo de la bibliothèque, et son fichier du stockage. */
export async function deleteGeneratedPhoto(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("photoId"));
  if (!id.success) return;
  await removeGeneratedPhoto(id.data);
  revalidatePath("/admin/photos-ia");
}
