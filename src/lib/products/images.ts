import "server-only";

import { deleteImages, uploadImages } from "@/lib/images/upload";
import { PRODUCT_BUCKET } from "@/lib/supabase/admin";

/**
 * Photos produit : le bucket est fixé ici, une fois, plutôt que répété par
 * chaque appelant. Une action d'administration ne choisit pas où ranger ses
 * images, elle dit seulement de quelle fiche elles sont.
 */
export { ImageUploadError } from "@/lib/images/upload";

export const uploadProductImages = (files: File[], slug: string) =>
  uploadImages(PRODUCT_BUCKET, slug, files);

export const deleteProductImages = (urls: string[]) =>
  deleteImages(PRODUCT_BUCKET, urls);
