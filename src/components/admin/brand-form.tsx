"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createBrand,
  type BrandFormState,
} from "@/app/admin/(back-office)/marques/actions";

/**
 * Création d'une marque.
 *
 * L'adresse de la page n'est pas saisie : elle est dérivée du nom par le
 * serveur, qui garantit aussi son unicité. Un champ « slug » libre à côté
 * d'un champ « nom » finit toujours par produire les deux qui se contredisent.
 */
export function BrandForm() {
  const [state, action, pending] = useActionState<BrandFormState, FormData>(
    createBrand,
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
        <label className="admin-field__label" htmlFor="nom">
          Nom de la marque
        </label>
        <input
          id="nom"
          name="name"
          type="text"
          required
          autoFocus
          className="admin-field__input"
          placeholder="Stone Island"
        />
        <p className="admin-field__hint">
          L&apos;adresse de la page en découle : « Stone Island » donne
          /marques/stone-island.
        </p>
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="logo">
          Logotype (SVG) <span className="admin-badge">facultatif</span>
        </label>
        <input
          id="logo"
          name="logoUrl"
          type="text"
          className="admin-field__input"
          placeholder="/logos/stone-island.svg"
        />
        <p className="admin-field__hint">
          Sans logotype, la bande de marques affiche le nom composé — préférable
          à un logo redessiné à la main.
        </p>
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="ratio">
          Rapport du logotype <span className="admin-badge">facultatif</span>
        </label>
        <input
          id="ratio"
          name="logoRatio"
          type="text"
          inputMode="decimal"
          className="admin-field__input"
          placeholder="2.74"
        />
        <p className="admin-field__hint">
          Largeur ÷ hauteur du <code>viewBox</code> du SVG, recopié sans
          l&apos;arrondir. Il donne à tous les logotypes la même surface à
          l&apos;écran, quelles que soient leurs proportions.
        </p>
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link href="/admin/marques" className="admin-button admin-button--ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
