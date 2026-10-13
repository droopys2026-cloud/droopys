import { prepareProductPhotoUploads } from "@/app/admin/(back-office)/produits/actions";

/**
 * Dépose des photos dans le stockage, depuis le navigateur, et rend leurs
 * adresses publiques dans l'ordre reçu.
 *
 * Chaque fichier part seul, directement chez Supabase, sur une adresse signée
 * préparée par le serveur : la fiche n'emporte plus que des adresses, et ne
 * bute plus sur la limite de 4,5 Mo par requête de Vercel. Le corps reprend
 * celui de `uploadToSignedUrl` de `@supabase/storage-js`.
 */
export async function uploadProductPhotos(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];

  const prepared = await prepareProductPhotoUploads(
    files.map((file) => ({ type: file.type, size: file.size })),
  );
  if (prepared.status === "error") throw new Error(prepared.message);

  await Promise.all(
    prepared.uploads.map(async ({ signedUrl }, index) => {
      const body = new FormData();
      body.append("cacheControl", "3600");
      body.append("", files[index]);
      const response = await fetch(signedUrl, { method: "PUT", body });
      if (!response.ok) {
        throw new Error(
          `La photo ${index + 1} a été refusée par le stockage (${response.status}). Vérifiez son format et son poids (8 Mo au plus).`,
        );
      }
    }),
  );

  return prepared.uploads.map((upload) => upload.publicUrl);
}
