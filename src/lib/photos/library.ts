import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { generatedPhotos } from "@/db/schema";
import { deleteImages } from "@/lib/images/upload";
import type { GeneratedPhoto } from "@/lib/photos/gemini";
import { GENERATED_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Bibliothèque des photos générées (Admin → Photos IA).
 *
 * Chaque photo y entre dès que Google la rend, avant même que la fiche soit
 * enregistrée : elle est payée, elle doit pouvoir être retrouvée.
 */

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function keepGeneratedPhoto(
  photo: GeneratedPhoto,
  meta: { shot: string; brand: string; productName: string },
): Promise<void> {
  const extension = EXTENSIONS[photo.mimeType] ?? "jpg";
  const month = new Date().toISOString().slice(0, 7);
  const path = `${month}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(GENERATED_BUCKET)
    .upload(path, Buffer.from(photo.base64, "base64"), { contentType: photo.mimeType, upsert: false });
  if (error) throw new Error(`Photo IA non archivée : ${error.message}`);

  const { data } = supabaseAdmin.storage.from(GENERATED_BUCKET).getPublicUrl(path);
  await db.insert(generatedPhotos).values({ url: data.publicUrl, ...meta });
}

export function listGeneratedPhotos() {
  return db.select().from(generatedPhotos).orderBy(desc(generatedPhotos.createdAt));
}

export async function removeGeneratedPhoto(id: string): Promise<void> {
  const [row] = await db
    .delete(generatedPhotos)
    .where(eq(generatedPhotos.id, id))
    .returning({ url: generatedPhotos.url });
  if (row) await deleteImages(GENERATED_BUCKET, [row.url]);
}
