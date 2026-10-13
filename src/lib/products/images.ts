import "server-only";

import { deleteImages } from "@/lib/images/upload";
import { PRODUCT_BUCKET, supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Photos produit : le bucket est fixé ici, une fois, plutôt que répété par
 * chaque appelant. Une action d'administration ne choisit pas où ranger ses
 * images, elle dit seulement de quelle fiche elles sont.
 */

/** Formats et poids acceptés — les mêmes que la règle du bucket (`scripts/storage.mts`). */
const ACCEPTED = ["image/webp", "image/jpeg", "image/png", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024;
/** Au-delà, c'est une erreur de manipulation, pas une fiche produit. */
const MAX_PHOTOS = 20;

export type PhotoUpload = {
  /** Adresse où le navigateur dépose le fichier, valable deux heures. */
  signedUrl: string;
  /** Adresse publique de la photo une fois déposée. */
  publicUrl: string;
};

/**
 * Prépare le dépôt direct des photos, du navigateur au stockage.
 *
 * Les photos ne passent plus par l'enregistrement de la fiche : Vercel coupe
 * toute requête au-delà de 4,5 Mo, et quatre photos de 2000 px suffisaient à
 * la dépasser — la boutique tombait alors sur une page d'erreur de Vercel,
 * sans rien dans nos journaux. Ici, seul un descriptif des fichiers transite ;
 * le stockage revérifie lui-même format et poids au dépôt.
 */
export async function createProductPhotoUploads(
  files: { type: string; size: number }[],
): Promise<PhotoUpload[]> {
  if (files.length > MAX_PHOTOS) throw new Error(`${MAX_PHOTOS} photos au plus par enregistrement.`);
  const batch = Date.now();

  return Promise.all(
    files.map(async (file, index) => {
      if (!ACCEPTED.includes(file.type)) throw new Error("Format de photo refusé : attendus WebP, JPEG, PNG ou AVIF.");
      if (file.size > MAX_BYTES) throw new Error("Une photo dépasse 8 Mo.");

      // Horodatage et rang dans le nom : republier sous le même nom
      // remplacerait l'ancienne photo, que les caches serviraient encore.
      const extension = file.type.split("/")[1] ?? "webp";
      const path = `fiches/${batch}-${index}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
      const { data, error } = await supabaseAdmin.storage.from(PRODUCT_BUCKET).createSignedUploadUrl(path);
      if (error) throw new Error(`Dépôt impossible : ${error.message}`);
      return {
        signedUrl: data.signedUrl,
        publicUrl: supabaseAdmin.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl,
      };
    }),
  );
}

/** Vrai pour une photo déposée dans le bucket des produits — jamais une adresse quelconque. */
export function isProductPhotoUrl(url: string): boolean {
  const prefix = supabaseAdmin.storage.from(PRODUCT_BUCKET).getPublicUrl("").data.publicUrl;
  return url.startsWith(prefix) && !url.slice(prefix.length).includes("..");
}

export const deleteProductImages = (urls: string[]) =>
  deleteImages(PRODUCT_BUCKET, urls);
