"use client";

import { useState } from "react";
import Link from "next/link";
import { WishlistButton } from "@/components/product/wishlist-button";

/**
 * Choix de la taille, puis ajout au panier.
 *
 * L'état du stock est écrit, pas seulement suggéré par un grisé : une taille
 * épuisée le dit, une taille qui s'épuise le dit aussi. Un client ne devine
 * pas qu'un bouton pâle veut dire « plus disponible ».
 *
 * Le bouton porte le motif de son inactivité (« Choisissez une taille ») au
 * lieu de rester muet : c'est la question la plus fréquente d'une fiche
 * produit dont le bouton ne réagit pas.
 */
export function SizePicker({
  sizes,
  productName,
  sizeAdvice,
}: {
  sizes: { size: string; quantity: number }[];
  productName: string;
  /** Conseil propre à la pièce, saisi à l'admin. */
  sizeAdvice?: string;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const selected = sizes.find((entry) => entry.size === chosen);

  return (
    <div className="size-picker">
      <div className="size-picker__head">
        <span className="text-caption-muted">Taille</span>
        <Link href="/aide/tailles" className="link-underline-sm">
          Guide des tailles
        </Link>
      </div>

      <ul className="size-picker__list">
        {sizes.map(({ size, quantity }) => {
          const soldOut = quantity <= 0;
          return (
            <li key={size}>
              <button
                type="button"
                className="size-chip"
                aria-pressed={chosen === size}
                disabled={soldOut}
                onClick={() => setChosen(size)}
              >
                {size}
                {soldOut && <span className="size-chip__out">épuisé</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {sizeAdvice && <p className="text-caption-muted m-0">{sizeAdvice}</p>}

      {/* Le message suit la taille choisie : il n'apparaît que lorsqu'il a
          quelque chose à dire, et disparaît sinon. */}
      {selected && selected.quantity > 0 && selected.quantity <= 3 && (
        <p className="size-picker__warning">
          {selected.quantity === 1
            ? "Dernière pièce dans cette taille"
            : `Plus que ${selected.quantity} pièces dans cette taille`}
        </p>
      )}

      <div className="product-buy-row">
        <button type="button" className="link-cta-block" disabled={!chosen}>
          {chosen ? "Ajouter au panier" : "Choisissez une taille"}
        </button>
        <WishlistButton productName={productName} />
      </div>
    </div>
  );
}
