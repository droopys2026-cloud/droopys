"use client";

import Image from "next/image";
import {
  ImageUploader,
  formatBytes,
  type UploadedImage,
} from "@/components/admin/image-uploader";
import { moveItem, useDragReorder } from "@/components/admin/use-drag-reorder";
import {
  PhotoGenerator,
  type GenerationReference,
} from "@/components/admin/photo-generator";
import type { ColorDraft } from "@/lib/products/stock-grid";

/**
 * Une photo de la fiche : déjà en ligne (fiche qu'on modifie), ou en attente
 * d'envoi (déposée, ou générée par l'IA). `key` l'identifie dans la liste —
 * l'adresse pour l'une, l'identifiant local pour l'autre.
 */
export type ProductPhoto =
  | { kind: "online"; key: string; url: string }
  | { kind: "pending"; key: string; image: UploadedImage };

export function onlinePhoto(url: string): ProductPhoto {
  return { kind: "online", key: url, url };
}

export function pendingPhoto(image: UploadedImage): ProductPhoto {
  return { kind: "pending", key: image.id, image };
}

/**
 * Photos d'une fiche, en une seule liste : celles déjà en ligne, celles
 * déposées et celles générées par l'IA se rangent ensemble, dans l'ordre de
 * la boutique — la première fait la carte, la deuxième son survol. On les
 * réordonne en les glissant.
 *
 * Seul l'enregistrement les distingue encore : une photo en attente part
 * d'abord vers le stockage, une photo en ligne y est déjà.
 */
export function ProductPhotosField({
  photos,
  onChange,
  selectedKey,
  onSelect,
  generationEnabled,
  colors,
  photoColors,
  onPhotoColorChange,
}: {
  photos: ProductPhoto[];
  onChange: (photos: ProductPhoto[]) => void;
  /** Photo dont part la génération par l'IA. */
  selectedKey: string | null;
  onSelect: (key: string) => void;
  /** Vrai quand la clé Gemini est configurée. */
  generationEnabled: boolean;
  colors: ColorDraft[];
  /** Couleur de chaque photo, par `key`. Absente : photo commune à toutes les couleurs. */
  photoColors: Record<string, string>;
  onPhotoColorChange: (photoKey: string, colorKey: string | null) => void;
}) {
  const { listProps, itemProps } = useDragReorder((from, to) =>
    onChange(moveItem(photos, from, to)),
  );

  function remove(photo: ProductPhoto) {
    if (photo.kind === "pending") URL.revokeObjectURL(photo.image.previewUrl);
    onChange(photos.filter((entry) => entry.key !== photo.key));
  }

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Photos{" "}
        <span className="admin-badge admin-badge--required">obligatoire</span>
      </legend>

      {photos.length > 0 && (
        <>
          <ul className="admin-uploader__list" {...listProps}>
            {photos.map((photo, index) => {
              const label = index === 0 ? "Photo principale" : `Photo ${index + 1}`;
              return (
                <li
                  key={photo.key}
                  className="admin-thumb"
                  aria-current={selectedKey === photo.key ? "true" : undefined}
                  {...itemProps(index)}
                >
                  <span className="admin-thumb__rank" aria-hidden>
                    {index + 1}
                  </span>
                  {/* La vignette choisit la photo dont part l'IA ; on la
                      glisse pour la ranger. Alt + flèches au clavier. */}
                  <button
                    type="button"
                    className="admin-thumb__pick"
                    aria-label={`${label} — choisir comme référence pour l'IA. Alt + flèches pour la déplacer.`}
                    onClick={() => onSelect(photo.key)}
                  >
                    {photo.kind === "online" ? (
                      <Image
                        src={photo.url}
                        alt=""
                        width={200}
                        height={300}
                        draggable={false}
                        className="admin-thumb__image"
                      />
                    ) : (
                      // Aperçu local (blob:) : `next/image` n'apporte rien et
                      // exigerait de déclarer un domaine.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.image.previewUrl}
                        alt=""
                        draggable={false}
                        className="admin-thumb__image"
                      />
                    )}
                  </button>

                  <div className="admin-thumb__meta">
                    <span className="admin-thumb__name">{label}</span>
                    <span className="admin-thumb__size">
                      {photo.kind === "online"
                        ? "déjà en ligne"
                        : isGenerated(photo.image)
                          ? "générée par l'IA"
                          : `${formatBytes(photo.image.originalBytes)} → ${formatBytes(photo.image.webpBytes)} en WebP`}
                    </span>
                    {colors.length > 0 && (
                      <select
                        className="admin-thumb__color"
                        aria-label={`Couleur de la ${label.toLowerCase()}`}
                        value={photoColors[photo.key] ?? ""}
                        onChange={(event) =>
                          onPhotoColorChange(photo.key, event.target.value || null)
                        }
                      >
                        <option value="">Toutes</option>
                        {colors.map((color, colorIndex) => (
                          <option key={color.key} value={color.key}>
                            {color.name || `Couleur ${colorIndex + 1}`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <button
                    type="button"
                    data-no-drag
                    className="admin-thumb__remove"
                    aria-label={`Retirer la ${label.toLowerCase()}`}
                    onClick={() => remove(photo)}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="admin-field__hint">
            Glissez une photo pour la changer de place (appui long sur
            téléphone). La première fait la carte produit, la deuxième
            s&apos;affiche au survol.
          </p>
        </>
      )}

      <ImageUploader
        onAdd={(images) => onChange([...photos, ...images.map(pendingPhoto)])}
      />

      <PhotoGenerator
        enabled={generationEnabled}
        references={generationReferences(photos, selectedKey)}
        onGenerated={(generated) => {
          let next = [...photos];
          const added: ProductPhoto[] = [];
          for (const { image, replaces } of generated) {
            const old = next.find((entry) => entry.key === replaces);
            if (old) {
              // Refaite : la nouvelle prend la place de l'ancienne, au même
              // rang et avec sa couleur, et l'aperçu de l'ancienne est libéré.
              if (old.kind === "pending") URL.revokeObjectURL(old.image.previewUrl);
              next = next.map((entry) => (entry.key === replaces ? pendingPhoto(image) : entry));
              const colorKey = photoColors[old.key];
              if (colorKey) onPhotoColorChange(image.id, colorKey);
            } else {
              added.push(pendingPhoto(image));
            }
          }
          // Les photos du studio passent en tête : la première fait la carte,
          // la deuxième son survol. On les déplace ensuite à la main au besoin.
          onChange([...added, ...next]);
        }}
      />
    </fieldset>
  );
}

/**
 * Les photos dont l'IA part, deux au plus (face et dos, typiquement), par
 * ordre de préférence :
 * 1. celle qu'on a cliquée ;
 * 2. les photos réelles déposées ;
 * 3. les photos déjà en ligne de la fiche ;
 * 4. à défaut, les photos générées présentes.
 *
 * Les photos générées passent en dernier — refaire une image à partir d'une
 * image refaite fait dériver le rendu —, mais elles restent un recours : si
 * on a retiré la photo d'origine pour ne garder que les générées, le bouton
 * ne doit pas se griser sans raison visible.
 */
function generationReferences(
  photos: ProductPhoto[],
  selectedKey: string | null,
): GenerationReference[] {
  const toReference = (photo: ProductPhoto): GenerationReference => {
    const index = photos.indexOf(photo);
    const label = index === 0 ? "la photo principale" : `la photo ${index + 1}`;
    return photo.kind === "online"
      ? { kind: "url", url: photo.url, label }
      : { kind: "file", file: photo.image.file, label };
  };
  const selected = photos.find((photo) => photo.key === selectedKey);
  const others = photos.filter((photo) => photo !== selected);
  const pending = others.flatMap((photo) => (photo.kind === "pending" ? [photo] : []));
  const originals = pending.filter((photo) => !isGenerated(photo.image));
  const online = others.filter((photo) => photo.kind === "online");
  const generated = pending.filter((photo) => isGenerated(photo.image));

  const preferred =
    originals.length > 0 ? originals : online.length > 0 ? online : generated;
  return [...(selected ? [selected] : []), ...preferred]
    .slice(0, MAX_REFERENCES)
    .map(toReference);
}

const MAX_REFERENCES = 2;

/** Les photos rendues par l'IA portent un identifiant « ia-… ». */
function isGenerated(image: UploadedImage): boolean {
  return image.id.startsWith("ia-");
}
