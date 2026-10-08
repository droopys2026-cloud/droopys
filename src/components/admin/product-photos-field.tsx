"use client";

import Image from "next/image";
import {
  ImageUploader,
  type UploadedImage,
} from "@/components/admin/image-uploader";
import { GENERATION_MODES } from "@/lib/photo-prompts";

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
}: {
  kept: string[];
  onKeptChange: (urls: string[]) => void;
  pending: UploadedImage[];
  onPendingChange: (images: UploadedImage[]) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
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
              <li key={url} className="admin-thumb">
                <span className="admin-thumb__pick">
                  <Image
                    src={url}
                    alt=""
                    width={120}
                    height={160}
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
                    onClick={() => onKeptChange(move(kept, index, -1))}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="admin-thumb__icon"
                    aria-label="Descendre"
                    onClick={() => onKeptChange(move(kept, index, 1))}
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
            Retirer une photo ici la supprime du stockage à l&apos;enregistrement.
          </p>
        </>
      )}

      <ImageUploader
        images={pending}
        onChange={onPendingChange}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      {/* Trois boutons, trois IA : un packshot et une photo portée ne
          demandent pas la même chose, et une seule IA qui ferait les deux les
          ferait mal toutes les deux. */}
      <div className="admin-generate">
        <p className="admin-field__label">Générer une photo</p>
        <div className="admin-generate__actions">
          {GENERATION_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              className="admin-button admin-button--ghost admin-button--small"
              disabled
              title="Aucun fournisseur d'images n'est encore branché."
            >
              {mode.label}
              <span className="admin-generate__hint">{mode.hint}</span>
            </button>
          ))}
        </div>
        <p className="admin-field__hint">
          Les prompts sont prêts (voir <code>@/lib/photo-prompts</code>) mais
          aucun fournisseur d&apos;images n&apos;est branché : les boutons
          restent inactifs plutôt que de faire semblant.
        </p>
      </div>
    </fieldset>
  );
}

/** Déplace un élément d'un rang, sans sortir du tableau. */
function move<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
