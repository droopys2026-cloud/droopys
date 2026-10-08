"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { SubcategoryFormState } from "@/app/admin/(back-office)/rayons/actions";
import { updateSubcategory } from "@/app/admin/(back-office)/rayons/[categorie]/[sous]/actions";
import { MAX_EDGE, toWebp } from "@/lib/images/to-webp";

export type SubcategoryFormValues = {
  id: string;
  title: string;
  intro: string | null;
  imageUrl: string | null;
};

/**
 * Fiche d'un sous-rayon : nom, chapô, photo.
 *
 * La photo est convertie en WebP dans le navigateur avant l'envoi, comme
 * celles des produits. Elle est jointe à la `FormData` au moment de l'envoi et
 * non par un `<input type="file">` : le fichier envoyé n'est pas celui choisi,
 * c'est sa conversion.
 */
export function SubcategoryForm({
  categorySlug,
  subcategory,
}: {
  categorySlug: string;
  subcategory: SubcategoryFormValues;
}) {
  const [state, action, pending] = useActionState<SubcategoryFormState, FormData>(
    updateSubcategory,
    {},
  );

  const [photo, setPhoto] = useState<{ file: File; previewUrl: string } | null>(
    null,
  );
  const [failed, setFailed] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setFailed(null);
    try {
      const converted = await toWebp(file);
      setPhoto({ file: converted, previewUrl: URL.createObjectURL(converted) });
    } catch {
      setFailed(`« ${file.name} » n'a pas pu être converti.`);
    }
  }

  function submit(formData: FormData) {
    if (photo) formData.set("photo", photo.file);
    action(formData);
  }

  const preview = photo?.previewUrl ?? subcategory.imageUrl;

  return (
    <form className="admin-form" action={submit}>
      <input type="hidden" name="subcategoryId" value={subcategory.id} />

      {state.errors && state.errors.length > 0 && (
        <div role="alert" className="admin-form__error">
          <ul>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="titre">
          Nom
        </label>
        <input
          id="titre"
          name="title"
          required
          maxLength={80}
          className="admin-field__input"
          defaultValue={subcategory.title}
        />
        <p className="admin-field__hint">
          L&apos;adresse reste /{categorySlug}/… : renommer ne la déplace pas,
          pour ne casser ni les liens partagés ni le menu.
        </p>
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="intro">
          Chapô <span className="admin-badge">facultatif</span>
        </label>
        <textarea
          id="intro"
          name="intro"
          rows={3}
          className="admin-field__input"
          defaultValue={subcategory.intro ?? ""}
        />
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="photo">
          Photo <span className="admin-badge">facultatif</span>
        </label>

        {preview && (
          <Image
            src={preview}
            alt=""
            width={240}
            height={160}
            /* L'aperçu local est une URL blob : l'optimiseur de Next ne sait
               pas la lire, et n'a rien à optimiser sur un fichier déjà converti. */
            unoptimized={Boolean(photo)}
            className="admin-preview"
          />
        )}

        <input
          id="photo"
          type="file"
          accept="image/*"
          className="admin-field__input"
          onChange={(event) => pick(event.target.files?.[0])}
        />
        <p className="admin-field__hint">
          Convertie en WebP et ramenée à {MAX_EDGE} px dans le navigateur. Elle
          sert d&apos;en-tête à la page et de visuel au menu.
        </p>
        {failed && <p className="admin-uploader__error">{failed}</p>}

        {subcategory.imageUrl && !photo && (
          <label className="admin-toggle">
            <input type="checkbox" name="removeImage" />
            <span>Retirer la photo actuelle</span>
          </label>
        )}
      </div>

      <button type="submit" className="admin-button" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
