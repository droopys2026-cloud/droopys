"use client";

import { useActionState } from "react";
import {
  createCategory,
  type CategoryFormState,
} from "@/app/admin/(back-office)/rayons/actions";

/**
 * Ajout d'un rayon : un seul champ, comme pour un sous-rayon. L'adresse se
 * déduit du nom et ne se saisit pas, pour ne jamais diverger de lui.
 */
export function CategoryCreateForm() {
  const [state, action, pending] = useActionState<CategoryFormState, FormData>(
    createCategory,
    {},
  );

  return (
    <form className="admin-form" action={action}>
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
        <label className="admin-field__label" htmlFor="nouveau-rayon">
          Nom du nouvel onglet
        </label>
        <input
          id="nouveau-rayon"
          name="title"
          required
          maxLength={80}
          className="admin-field__input"
          placeholder="Maillots de bain"
        />
        <p className="admin-field__hint">
          Il s&apos;ajoute à la fin du menu et devient une page du site :
          « Maillots de bain » donne /maillots-de-bain.
        </p>
      </div>

      <button type="submit" className="admin-button" disabled={pending}>
        {pending ? "Ajout…" : "Ajouter l'onglet"}
      </button>
    </form>
  );
}
