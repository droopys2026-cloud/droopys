import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Envoi et suppression d'images dans le stockage Supabase.
 *
 * Le navigateur convertit déjà les images en WebP et les redimensionne, mais
 * cette conversion n'est pas une garantie : un formulaire peut être appelé
 * sans passer par nos pages. Type et poids sont donc revérifiés ici, du côté
 * qui ne peut pas être contourné.
 *
 * Le bucket est un paramètre et non une constante du module : photos de
 * produits et photos de rayon n'ont pas la même durée de vie, et la purge des
 * unes ne doit jamais pouvoir atteindre les autres.
 */

/** Doit rester aligné sur les buckets créés par `scripts/storage.mts`. */
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED = ["image/webp", "image/jpeg", "image/png", "image/avif"];

export class ImageUploadError extends Error {}

/**
 * Téléverse les fichiers et rend leurs URL publiques, dans l'ordre reçu.
 *
 * Le chemin porte un horodatage : republier une photo sous le même nom
 * remplacerait la précédente, et les caches — celui du CDN comme celui du
 * navigateur — continueraient à servir l'ancienne pendant des heures.
 */
export async function uploadImages(
  bucket: string,
  folder: string,
  files: File[],
): Promise<string[]> {
  const urls: string[] = [];

  for (const [index, file] of files.entries()) {
    if (!ACCEPTED.includes(file.type)) {
      throw new ImageUploadError(
        `Format refusé pour « ${file.name} » : attendus WebP, JPEG, PNG ou AVIF.`,
      );
    }
    if (file.size > MAX_BYTES) {
      throw new ImageUploadError(
        `« ${file.name} » dépasse 8 Mo. Réduisez la photo avant de l'envoyer.`,
      );
    }

    const extension = file.type.split("/")[1] ?? "webp";
    const path = `${folder}/${Date.now()}-${index}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) {
      throw new ImageUploadError(
        `Envoi impossible pour « ${file.name} » : ${error.message}`,
      );
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return urls;
}

/**
 * Supprime des images du stockage.
 *
 * Les URL publiques sont retraduites en chemins de bucket ; une URL qui ne
 * vient pas du bucket visé est ignorée plutôt que rejetée — une fiche peut
 * encore porter une image servie depuis `public/`, héritée du catalogue de
 * départ.
 */
export async function deleteImages(
  bucket: string,
  urls: string[],
): Promise<void> {
  const marker = `/${bucket}/`;
  const paths = urls
    .map((url) => {
      const at = url.indexOf(marker);
      return at === -1 ? null : url.slice(at + marker.length);
    })
    .filter((path): path is string => path !== null);

  if (paths.length === 0) return;

  const { error } = await supabaseAdmin.storage.from(bucket).remove(paths);
  // Un fichier orphelin coûte quelques kilo-octets ; une fiche qu'on ne peut
  // pas supprimer parce que son image résiste coûte bien plus cher.
  if (error) console.error("Suppression d'images incomplète :", error.message);
}
