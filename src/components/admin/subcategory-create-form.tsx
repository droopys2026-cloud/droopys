"use client";

import { useActionState } from "react";
import {
  createSubcategory,
  type SubcategoryFormState,
} from "@/app/admin/(back-office)/rayons/actions";

/**
 * Ajout d'un sous-rayon : un seul champ.
 *
 * Le slug n'est pas saisi mais dérivé du nom. Deux champs pour une même chose
 * invitent à les désaccorder, et c'est l'adresse publique qui en pâtirait.
 */
export function SubcategoryCreateForm({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const [state, action, pending] = useActionState<SubcategoryFormState, FormData>(
    createSubcategory,
    {},
  );

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="categorySlug" value={categorySlug} />

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
        <label className="admin-field__label" htmlFor="nouveau-sous-rayon">
          Nom du sous-rayon
        </label>
        <input
          id="nouveau-sous-rayon"
          name="title"
          required
          maxLength={80}
          className="admin-field__input"
          placeholder="Robes"
        />
        <p className="admin-field__hint">
          L&apos;adresse se déduit du nom : « Robes » donne /{categorySlug}
          /robes.
        </p>
      </div>

      <button type="submit" className="admin-button" disabled={pending}>
        {pending ? "Ajout…" : "Ajouter le sous-rayon"}
      </button>
    </form>
  );
}
