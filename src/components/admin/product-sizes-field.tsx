"use client";

import { useState } from "react";
import { SIZE_SCALES, getSizeScale } from "@/lib/sizes";

/** Une taille proposée et son stock. */
export type SizeStock = { size: string; quantity: number };

/**
 * Tailles et stock d'une fiche.
 *
 * Les tailles se choisissent dans un barème, elles ne se tapent pas : une
 * saisie libre finit toujours par produire « 4 », « 4A » et « 4 ANS » côte à
 * côte, et le filtre par taille ne marche plus.
 */
export function ProductSizesField({
  value,
  onChange,
}: {
  value: SizeStock[];
  onChange: (sizes: SizeStock[]) => void;
}) {
  const [picker, setPicker] = useState(value.length === 0);
  const [scaleId, setScaleId] = useState(SIZE_SCALES[0]?.id ?? "");

  function toggle(size: string) {
    const chosen = value.some((entry) => entry.size === size);
    onChange(
      chosen
        ? value.filter((entry) => entry.size !== size)
        : [...value, { size, quantity: 0 }],
    );
  }

  function setQuantity(size: string, quantity: number) {
    onChange(
      value.map((entry) =>
        entry.size === size ? { ...entry, quantity } : entry,
      ),
    );
  }

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Tailles et stock{" "}
        <span className="admin-badge admin-badge--required">obligatoire</span>
      </legend>

      <div className="admin-sizes-head">
        <p className="admin-field__label">
          {value.length === 0
            ? "Aucune taille choisie"
            : `${value.length} taille${value.length > 1 ? "s" : ""} proposée${value.length > 1 ? "s" : ""}`}
        </p>
        <button
          type="button"
          className="admin-button admin-button--ghost admin-button--small"
          aria-expanded={picker}
          onClick={() => setPicker(!picker)}
        >
          {picker ? "Fermer" : "Choisir les tailles"}
        </button>
      </div>

      {picker && (
        <div className="admin-picker">
          <div className="admin-picker__tabs">
            {SIZE_SCALES.map((scale) => (
              <button
                key={scale.id}
                type="button"
                className="admin-picker__tab"
                aria-pressed={scaleId === scale.id}
                onClick={() => setScaleId(scale.id)}
              >
                {scale.label}
              </button>
            ))}
          </div>

          <ul className="admin-picker__grid">
            {getSizeScale(scaleId)?.sizes.map((size) => (
              <li key={size}>
                <button
                  type="button"
                  className="admin-chip"
                  aria-pressed={value.some((entry) => entry.size === size)}
                  onClick={() => toggle(size)}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {value.length > 0 && (
        /* Un vrai tableau : deux colonnes titrées valent mieux qu'un champ nu
           à côté d'une taille — on doit voir d'un coup ce qui est en stock et
           ce qui ne l'est pas. */
        <table className="admin-stock">
          <thead>
            <tr>
              <th scope="col">Taille</th>
              <th scope="col">Stock</th>
              <th scope="col">
                <span className="sr-only">Retirer</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {value.map((entry) => (
              <tr key={entry.size}>
                <td className="admin-stock__size">{entry.size}</td>
                <td>
                  <div className="admin-stock__cell">
                    <input
                      type="number"
                      min={0}
                      className="admin-size__input"
                      aria-label={`Stock pour la taille ${entry.size}`}
                      placeholder="0"
                      value={entry.quantity === 0 ? "" : entry.quantity}
                      onChange={(event) =>
                        setQuantity(
                          entry.size,
                          Math.max(0, Number(event.target.value) || 0),
                        )
                      }
                    />
                    <span
                      className={
                        entry.quantity > 0
                          ? "admin-stock__state"
                          : "admin-stock__state admin-stock__state--out"
                      }
                    >
                      {entry.quantity > 0 ? "en stock" : "rupture"}
                    </span>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-thumb__icon"
                    aria-label={`Retirer la taille ${entry.size}`}
                    onClick={() => toggle(entry.size)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="admin-field__hint">
        Une taille à 0 s&apos;affiche en rupture ; une taille non choisie
        n&apos;est pas proposée du tout.
      </p>
    </fieldset>
  );
}
