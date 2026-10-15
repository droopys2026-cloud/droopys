"use client";

import { useRef, useState } from "react";
import { MAX_EDGE, toWebp } from "@/lib/images/to-webp";

/**
 * Zone de dépôt des photos d'un produit.
 *
 * Elle ne fait qu'ajouter : chaque fichier est converti en WebP dans le
 * navigateur avant tout envoi (voir `@/lib/images/to-webp`), puis rejoint la
 * liste unique des photos de la fiche, où il se range comme les autres.
 */
export type UploadedImage = {
  id: string;
  name: string;
  /** URL d'aperçu locale — à révoquer quand l'image est retirée. */
  previewUrl: string;
  file: File;
  originalBytes: number;
  webpBytes: number;
};

export function formatBytes(bytes: number): string {
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} Mo`
    : `${Math.round(bytes / 1000)} ko`;
}

export function ImageUploader({
  onAdd,
}: {
  /** Photos converties, à ajouter en fin de liste. */
  onAdd: (images: UploadedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setError(null);

    try {
      const converted = await Promise.all(
        Array.from(fileList)
          .filter((file) => file.type.startsWith("image/"))
          .map(async (file) => {
            const webp = await toWebp(file);
            return {
              // Aléatoire et non dérivé du fichier : le même fichier déposé
              // deux fois doit donner deux vignettes distinctes.
              id: `${file.name}-${crypto.randomUUID()}`,
              name: webp.name,
              previewUrl: URL.createObjectURL(webp),
              file: webp,
              originalBytes: file.size,
              webpBytes: webp.size,
            };
          }),
      );
      onAdd(converted);
    } catch {
      setError(
        "Une image n'a pas pu être convertie. Réessayez avec un autre fichier.",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-uploader">
      <div
        className="admin-uploader__drop"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          void addFiles(event.dataTransfer.files);
        }}
      >
        <p className="admin-uploader__text">
          Glissez vos photos ici, ou
          <button
            type="button"
            className="admin-uploader__pick"
            onClick={() => inputRef.current?.click()}
          >
            parcourez vos fichiers
          </button>
        </p>
        <p className="admin-uploader__note">
          Converties en WebP et ramenées à {MAX_EDGE} px dans le navigateur,
          avant l&apos;envoi.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => void addFiles(event.target.files)}
        />
      </div>

      {busy && <p className="admin-form__note">Conversion en cours…</p>}
      {error && <p className="admin-uploader__error">{error}</p>}
    </div>
  );
}
