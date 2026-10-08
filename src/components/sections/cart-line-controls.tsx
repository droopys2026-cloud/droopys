"use client";

import { removeCartLine, updateCartLine } from "@/app/actions/cart";
import { MAX_QUANTITY } from "@/lib/cart/limits";

/**
 * Quantité et retrait d'une ligne de panier.
 *
 * Les deux gestes sont des formulaires distincts et non un champ qui
 * s'enregistre tout seul : une quantité qui part à chaque frappe envoie trois
 * requêtes pour taper « 12 », et laisse le client dans le doute sur ce qui a
 * été retenu. Ici on voit ce qu'on change, et on le valide.
 *
 * Sans JavaScript, les deux fonctionnent encore — ce sont de vrais `<form>`.
 */
export function CartLineControls({
  variantId,
  quantity,
  stock,
  label,
  onRemove,
  onQuantity,
}: {
  variantId: string;
  quantity: number;
  /** Stock réel de la taille : on ne propose pas plus que ce qui existe. */
  stock: number;
  label: string;
  /** Appelés avant l'envoi, pour un affichage optimiste (tiroir du panier). */
  onRemove?: () => void;
  onQuantity?: (quantity: number) => void;
}) {
  const max = Math.min(stock, MAX_QUANTITY);

  return (
    <div className="cart-line__controls">
      <form
        action={async (formData) => {
          onQuantity?.(Number(formData.get("quantity")));
          await updateCartLine(formData);
        }}
        className="cart-line__quantity"
      >
        <input type="hidden" name="variantId" value={variantId} />
        <label className="sr-only" htmlFor={`quantite-${variantId}`}>
          Quantité pour {label}
        </label>
        <select
          id={`quantite-${variantId}`}
          name="quantity"
          defaultValue={quantity}
          className="cart-line__select"
        >
          {Array.from({ length: max }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <button type="submit" className="link-underline-sm">
          Mettre à jour
        </button>
      </form>

      <form
        action={async (formData) => {
          onRemove?.();
          await removeCartLine(formData);
        }}
      >
        <input type="hidden" name="variantId" value={variantId} />
        <button type="submit" className="link-underline-sm">
          Retirer<span className="sr-only"> {label}</span>
        </button>
      </form>
    </div>
  );
}
