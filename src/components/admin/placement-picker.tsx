"use client";

import { useActionState, useState } from "react";
import type { SubcategoryFormState } from "@/app/admin/(back-office)/rayons/actions";
import { setPlacements } from "@/app/admin/(back-office)/rayons/[categorie]/[sous]/actions";

export type PlacementCandidate = {
  id: string;
  name: string;
  brand: string;
  published: boolean;
};

/**
 * Composition de la sélection d'un sous-rayon.
 *
 * Le filtre agit sur la liste affichée, jamais sur les cases cochées : les
 * articles déjà retenus qui sortent du filtre restent envoyés, en champs
 * cachés. Un filtre qui vide la sélection est le meilleur moyen de perdre
 * vingt minutes de travail sans s'en rendre compte.
 */
export function PlacementPicker({
  subcategoryId,
  candidates,
  selected,
}: {
  subcategoryId: string;
  candidates: PlacementCandidate[];
  /** Identifiants déjà placés, dans l'ordre de la sélection. */
  selected: string[];
}) {
  const [state, action, pending] = useActionState<SubcategoryFormState, FormData>(
    setPlacements,
    {},
  );

  const [chosen, setChosen] = useState<string[]>(selected);
  const [filter, setFilter] = useState("");

  const needle = filter.trim().toLowerCase();
  const shown = needle
    ? candidates.filter((candidate) =>
        `${candidate.brand} ${candidate.name}`.toLowerCase().includes(needle),
      )
    : candidates;

  const hidden = chosen.filter(
    (id) => !shown.some((candidate) => candidate.id === id),
  );

  function toggle(id: string) {
    setChosen((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }

  return (
    <form className="admin-form" action={action}>
      <input type="hidden" name="subcategoryId" value={subcategoryId} />
      {hidden.map((id) => (
        <input key={id} type="hidden" name="productIds" value={id} />
      ))}

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
        <label className="admin-field__label" htmlFor="filtre-articles">
          Filtrer par marque ou par nom
        </label>
        <input
          id="filtre-articles"
          type="search"
          className="admin-field__input"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Moncler, parka…"
        />
        <p className="admin-field__hint">
          {chosen.length} article{chosen.length > 1 ? "s" : ""} dans la
          sélection. Un article coché apparaît sur cette page sans quitter son
          rayon d&apos;origine.
        </p>
      </div>

      <ul className="admin-picker">
        {shown.map((candidate) => (
          <li key={candidate.id}>
            <label className="admin-toggle">
              <input
                type="checkbox"
                name="productIds"
                value={candidate.id}
                checked={chosen.includes(candidate.id)}
                onChange={() => toggle(candidate.id)}
              />
              <span>
                {candidate.brand} — {candidate.name}
                {!candidate.published && (
                  <span className="admin-badge"> brouillon</span>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="admin-field__hint">Aucun article ne correspond.</p>
      )}

      <button type="submit" className="admin-button" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer la sélection"}
      </button>
    </form>
  );
}
