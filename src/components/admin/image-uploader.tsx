"use client";

import { useRef, useState } from "react";
import { MAX_EDGE, toWebp } from "@/lib/images/to-webp";

/**
 * Dépôt d'images d'un produit.
 *
 * Chaque fichier est converti en WebP dans le navigateur avant tout envoi —
 * voir `@/lib/images/to-webp`.
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

function formatBytes(bytes: number): string {
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} Mo`
    : `${Math.round(bytes / 1000)} ko`;
}

export function ImageUploader({
  images,
  onChange,
  selectedId,
  onSelect,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  /** Photo sur laquelle portent les actions de génération. */
  selectedId?: string | null;
  onSelect?: (id: string) => void;
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
              id: `${file.name}-${file.size}-${images.length}-${Math.round(webp.size)}`,
              name: webp.name,
              previewUrl: URL.createObjectURL(webp),
              file: webp,
              originalBytes: file.size,
              webpBytes: webp.size,
            };
          }),
      );
      onChange([...images, ...converted]);
    } catch {
      setError(
        "Une image n'a pas pu être convertie. Réessayez avec un autre fichier.",
      );
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(id: string) {
    const image = images.find((item) => item.id === id);
    if (image) URL.revokeObjectURL(image.previewUrl);
    onChange(images.filter((item) => item.id !== id));
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
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

      {images.length > 0 && (
        <ul className="admin-uploader__list">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="admin-thumb"
              aria-current={selectedId === image.id ? "true" : undefined}
            >
              {/* La vignette sélectionne la photo : les boutons de génération
                  agissent sur celle qui est choisie. Grand aperçu — on juge
                  une photo de fiche produit sur ce qu'on en voit. */}
              <button
                type="button"
                className="admin-thumb__pick"
                aria-label={`Choisir la photo ${index + 1} comme référence`}
                onClick={() => onSelect?.(image.id)}
              >
                {/* `next/image` n'apporte rien sur un blob local, et
                    exigerait de déclarer un domaine. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewUrl}
                  alt=""
                  className="admin-thumb__image"
                />
              </button>

              <div className="admin-thumb__meta">
                <span className="admin-thumb__name">
                  {index === 0 ? "Photo principale" : `Photo ${index + 1}`}
                </span>
                <span className="admin-thumb__size">
                  {formatBytes(image.originalBytes)} →{" "}
                  {formatBytes(image.webpBytes)} en WebP
                </span>
              </div>

              <div className="admin-thumb__actions">
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label="Monter"
                  onClick={() => move(index, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label="Descendre"
                  onClick={() => move(index, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label="Retirer"
                  onClick={() => remove(image.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
