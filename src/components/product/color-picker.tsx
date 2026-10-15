"use client";

import { useProductVariant } from "@/components/product/product-variant-context";

/**
 * Pastilles de couleur, au-dessus des tailles.
 *
 * Le nom de la couleur choisie est écrit à côté du titre : une pastille seule
 * ne dit pas « bleu nuit » ou « marine », et c'est le nom qu'on retrouvera
 * dans le panier et sur la commande.
 */
export function ColorPicker() {
  const { colors, color, sizes, chooseColor } = useProductVariant();
  if (!colors || colors.length === 0) return null;

  return (
    <div className="color-picker">
      <p className="text-caption-muted m-0">
        Couleur{color && <span className="color-picker__name"> : {color.name}</span>}
      </p>
      <ul className="color-picker__list">
        {colors.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="color-swatch"
              aria-pressed={entry.id === color?.id}
              aria-label={entry.name}
              title={entry.name}
              onClick={() => chooseColor(entry.id)}
            >
              {/* La teinte est une donnée saisie à l'admin, pas un jeton du
                  thème : elle ne peut venir que d'un style en ligne. */}
              <span className="color-swatch__fill" style={{ backgroundColor: entry.hex }} />
            </button>
          </li>
        ))}
      </ul>
      {/* Une couleur entièrement épuisée reste choisissable — ses photos
          restent utiles —, mais on le dit tout de suite. */}
      {color && sizes.length > 0 && sizes.every((entry) => entry.quantity <= 0) && (
        <p className="size-picker__warning m-0">Cette couleur est épuisée.</p>
      )}
    </div>
  );
}
