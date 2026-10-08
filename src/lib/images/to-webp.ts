/**
 * Conversion d'une image en WebP **dans le navigateur**, avant tout envoi.
 *
 * On téléverse alors un fichier deux à cinq fois plus léger, et le serveur n'a
 * aucun travail d'image à faire. La conversion passe par un canvas — donc par
 * une décompression complète — ce qui écarte les métadonnées EXIF au passage.
 *
 * Le grand côté est ramené à 2000 px : au-delà, une photo de boutique ne gagne
 * rien à l'écran et coûte du stockage à chaque affichage.
 */
/** Grand côté après redimensionnement — affiché dans l'interface de dépôt. */
export const MAX_EDGE = 2000;
const QUALITY = 0.86;

export async function toWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponible");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  if (!blob) throw new Error("Conversion WebP impossible");

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}
