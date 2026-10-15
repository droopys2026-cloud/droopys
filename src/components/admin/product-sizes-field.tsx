"use client";

import { useState } from "react";
import { SIZE_SCALES, getSizeScale } from "@/lib/sizes";
import type { ColorDraft, StockCell } from "@/lib/products/stock-grid";

/**
 * Tailles, stock et prix d'une fiche.
 *
 * Les tailles se choisissent dans un barème, elles ne se tapent pas : une
 * saisie libre finit toujours par produire « 4 », « 4A » et « 4 ANS » côte à
 * côte, et le filtre par taille ne marche plus. Elles sont communes à toutes
 * les couleurs ; le stock et le prix, eux, se saisissent par couleur.
 */
export function ProductSizesField({
  sizes,
  onSizesChange,
  colors,
  stock,
  onStockChange,
}: {
  sizes: string[];
  onSizesChange: (sizes: string[]) => void;
  colors: ColorDraft[];
  /** Déjà aligné sur `colors` × `sizes` par le formulaire. */
  stock: StockCell[];
  onStockChange: (stock: StockCell[]) => void;
}) {
  const [picker, setPicker] = useState(sizes.length === 0);
  const [scaleId, setScaleId] = useState(SIZE_SCALES[0]?.id ?? "");

  function toggle(size: string) {
    onSizesChange(
      sizes.includes(size) ? sizes.filter((entry) => entry !== size) : [...sizes, size],
    );
  }

  function setCell(target: StockCell, patch: Partial<StockCell>) {
    onStockChange(
      stock.map((cell) =>
        cell.colorKey === target.colorKey && cell.size === target.size
          ? { ...cell, ...patch }
          : cell,
      ),
    );
  }

  // Un tableau par couleur, ou un seul sans couleur. Empilés plutôt qu'en
  // grille couleur × taille : une grille déborde dès trois couleurs sur un
  // téléphone, et c'est souvent de là que la boutique met à jour son stock.
  const groups: { key: string | null; title?: string; hex?: string }[] =
    colors.length > 0
      ? colors.map((color, index) => ({
          key: color.key,
          title: color.name || `Couleur ${index + 1}`,
          hex: color.hex,
        }))
      : [{ key: null }];

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Tailles et stock{" "}
        <span className="admin-badge admin-badge--required">obligatoire</span>
      </legend>

      <div className="admin-sizes-head">
        <p className="admin-field__label">
          {sizes.length === 0
            ? "Aucune taille choisie"
            : `${sizes.length} taille${sizes.length > 1 ? "s" : ""} proposée${sizes.length > 1 ? "s" : ""}`}
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
                  aria-pressed={sizes.includes(size)}
                  onClick={() => toggle(size)}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sizes.length > 0 &&
        groups.map((group) => (
          <div key={group.key ?? "sans-couleur"} className="admin-stock-group">
            {group.title && (
              <p className="admin-stock-group__title">
                <span
                  className="admin-stock-group__swatch"
                  style={{ backgroundColor: group.hex }}
                  aria-hidden
                />
                {group.title}
              </p>
            )}
            {/* Un vrai tableau : des colonnes titrées valent mieux qu'un champ
                nu à côté d'une taille — on doit voir d'un coup ce qui est en
                stock et ce qui ne l'est pas. */}
            <table className="admin-stock">
              <thead>
                <tr>
                  <th scope="col">Taille</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Prix (€)</th>
                  <th scope="col">
                    <span className="sr-only">Retirer</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stock
                  .filter((cell) => cell.colorKey === group.key)
                  .map((cell) => {
                    const of = `${cell.size}${group.title ? `, ${group.title}` : ""}`;
                    return (
                      <tr key={cell.size}>
                        <td className="admin-stock__size">{cell.size}</td>
                        <td>
                          <div className="admin-stock__cell">
                            <input
                              type="number"
                              min={0}
                              className="admin-size__input"
                              aria-label={`Stock pour la taille ${of}`}
                              placeholder="0"
                              value={cell.quantity === 0 ? "" : cell.quantity}
                              onChange={(event) =>
                                setCell(cell, {
                                  quantity: Math.max(0, Number(event.target.value) || 0),
                                })
                              }
                            />
                            <span
                              className={
                                cell.quantity > 0
                                  ? "admin-stock__state"
                                  : "admin-stock__state admin-stock__state--out"
                              }
                            >
                              {cell.quantity > 0 ? "en stock" : "rupture"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <input
                            inputMode="decimal"
                            className="admin-size__input admin-size__input--price"
                            aria-label={`Prix pour la taille ${of}`}
                            placeholder="prix fiche"
                            value={cell.price}
                            onChange={(event) => setCell(cell, { price: event.target.value })}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-thumb__icon"
                            aria-label={`Retirer la taille ${cell.size}`}
                            onClick={() => toggle(cell.size)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}

      <p className="admin-field__hint">
        Une taille à 0 s&apos;affiche en rupture ; une taille non choisie
        n&apos;est pas proposée du tout. Prix vide : la taille prend le prix de
        la fiche.
      </p>
    </fieldset>
  );
}
