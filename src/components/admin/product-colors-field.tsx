"use client";

import { moveItem } from "@/components/admin/use-drag-reorder";
import type { ColorDraft } from "@/lib/products/stock-grid";

/**
 * Couleurs d'une fiche.
 *
 * Facultatives : une pièce qui n'existe qu'en une teinte n'en déclare
 * aucune, et la fiche se comporte comme avant. Dès qu'on en ajoute une, le
 * stock se saisit couleur par couleur et chaque photo peut être rattachée à
 * sa couleur.
 */
export function ProductColorsField({
  value,
  onChange,
}: {
  value: ColorDraft[];
  onChange: (colors: ColorDraft[]) => void;
}) {
  function update(key: string, patch: Partial<ColorDraft>) {
    onChange(value.map((color) => (color.key === key ? { ...color, ...patch } : color)));
  }

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Couleurs <span className="admin-badge">facultatif</span>
      </legend>

      {value.length > 0 && (
        <ul className="admin-colors">
          {value.map((color, index) => (
            <li key={color.key} className="admin-color">
              <input
                type="color"
                className="admin-color__swatch"
                aria-label={`Teinte de la couleur ${index + 1}`}
                value={color.hex}
                onChange={(event) => update(color.key, { hex: event.target.value })}
              />
              <input
                className="admin-field__input"
                aria-label={`Nom de la couleur ${index + 1}`}
                placeholder="Rose poudré"
                value={color.name}
                onChange={(event) => update(color.key, { name: event.target.value })}
              />
              <div className="admin-thumb__actions">
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label={`Monter ${color.name || `la couleur ${index + 1}`}`}
                  onClick={() => onChange(moveItem(value, index, index - 1))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label={`Descendre ${color.name || `la couleur ${index + 1}`}`}
                  onClick={() => onChange(moveItem(value, index, index + 1))}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="admin-thumb__icon"
                  aria-label={`Retirer ${color.name || `la couleur ${index + 1}`}`}
                  onClick={() => onChange(value.filter((entry) => entry.key !== color.key))}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="admin-button admin-button--ghost admin-button--small admin-colors__add"
        onClick={() =>
          onChange([
            ...value,
            // Clé provisoire : le serveur la remplace par l'identifiant réel.
            { key: `nouvelle-${crypto.randomUUID()}`, name: "", hex: "#d8d8d8" },
          ])
        }
      >
        + Ajouter une couleur
      </button>

      <p className="admin-field__hint">
        Une seule fiche pour toutes les couleurs d&apos;un article : chaque
        couleur a son stock, ses photos et, si besoin, son prix. Laisser vide
        pour un article en une seule couleur.
      </p>
    </fieldset>
  );
}
