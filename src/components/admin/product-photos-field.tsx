"use client";

import Image from "next/image";
import {
  ImageUploader,
  type UploadedImage,
} from "@/components/admin/image-uploader";
import { moveItem, useDragReorder } from "@/components/admin/use-drag-reorder";
import {
  PhotoGenerator,
  type GenerationReference,
} from "@/components/admin/photo-generator";

/**
 * Photos d'une fiche.
 *
 * Deux listes distinctes, et c'est volontaire : les photos **déjà en ligne**
 * (une fiche qu'on modifie) et celles **en attente d'envoi**. Les mélanger
 * obligerait à retéléverser l'existant à chaque enregistrement.
 */
export function ProductPhotosField({
  kept,
  onKeptChange,
  pending,
  onPendingChange,
  selectedId,
  onSelect,
  generationEnabled,
}: {
  kept: string[];
  onKeptChange: (urls: string[]) => void;
  pending: UploadedImage[];
  onPendingChange: (images: UploadedImage[]) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Vrai quand la clé Gemini est configurée. */
  generationEnabled: boolean;
}) {
  const keptDragProps = useDragReorder((from, to) => onKeptChange(moveItem(kept, from, to)));

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Photos{" "}
        <span className="admin-badge admin-badge--required">obligatoire</span>
      </legend>

      {kept.length > 0 && (
        <>
          <p className="admin-field__label">Photos en ligne</p>
          <ul className="admin-uploader__list">
            {kept.map((url, index) => (
              <li key={url} className="admin-thumb" {...keptDragProps(index)}>
                <span className="admin-thumb__pick">
                  <Image
                    src={url}
                    alt=""
                    width={120}
                    height={160}
                    draggable={false}
                    className="admin-thumb__image"
                  />
                </span>
                <div className="admin-thumb__meta">
                  <span className="admin-thumb__name">
                    {index === 0 ? "Photo principale" : `Photo ${index + 1}`}
                  </span>
                  <span className="admin-thumb__size">déjà en ligne</span>
                </div>
                <div className="admin-thumb__actions">
                  <button
                    type="button"
                    className="admin-thumb__icon"
                    aria-label="Monter"
                    onClick={() => onKeptChange(moveItem(kept, index, index - 1))}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-thumb__icon"
                    aria-label="Descendre"
                    onClick={() => onKeptChange(moveItem(kept, index, index + 1))}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="admin-thumb__icon"
                    aria-label="Retirer"
                    onClick={() =>
                      onKeptChange(kept.filter((_, i) => i !== index))
                    }
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="admin-field__hint">
            Retirer une photo ici la supprime du stockage à
            l&apos;enregistrement.
          </p>
        </>
      )}

      <ImageUploader
        images={pending}
        onChange={onPendingChange}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      <PhotoGenerator
        enabled={generationEnabled}
        references={generationReferences(pending, kept, selectedId)}
        onGenerated={(photos) => {
          let next = [...pending];
          const added: UploadedImage[] = [];
          for (const { image, replaces } of photos) {
            const old = next.find((entry) => entry.id === replaces);
            if (old) {
              // Refaite : la nouvelle prend la place de l'ancienne, au même
              // rang, et l'aperçu de l'ancienne est libéré.
              URL.revokeObjectURL(old.previewUrl);
              next = next.map((entry) =>
                entry.id === replaces ? image : entry,
              );
            } else {
              added.push(image);
            }
          }
          // Les photos du studio passent devant les photos brutes de
          // l'article : la première fait la carte, la deuxième son survol.
          onPendingChange([...added, ...next]);
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
  pending: UploadedImage[],
  kept: string[],
  selectedId: string | null,
): GenerationReference[] {
  const fromFile = (image: UploadedImage): GenerationReference => ({
    kind: "file",
    file: image.file,
    label: image.name,
  });
  const selected = pending.find((image) => image.id === selectedId);
  const others = pending.filter((image) => image !== selected);
  const originals = others.filter((image) => !isGenerated(image)).map(fromFile);
  const online: GenerationReference[] = kept.map((url, index) => ({
    kind: "url",
    url,
    label: index === 0 ? "la photo principale" : `la photo ${index + 1}`,
  }));
  const generated = others.filter(isGenerated).map(fromFile);

  const preferred =
    originals.length > 0 ? originals : online.length > 0 ? online : generated;
  return [...(selected ? [fromFile(selected)] : []), ...preferred].slice(
    0,
    MAX_REFERENCES,
  );
}

const MAX_REFERENCES = 2;

/** Les photos rendues par l'IA portent un identifiant « ia-… ». */
function isGenerated(image: UploadedImage): boolean {
  return image.id.startsWith("ia-");
}
