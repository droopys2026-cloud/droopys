"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  addToCart,
  type CartActionState,
} from "@/app/actions/cart";
import { useCartDrawer } from "@/components/layout/cart-drawer-context";
import { ColorPicker } from "@/components/product/color-picker";
import { useProductVariant } from "@/components/product/product-variant-context";
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
  productId,
  productName,
  sizeAdvice,
}: {
  productId: string;
  productName: string;
  /** Conseil propre à la pièce, saisi à l'admin. */
  sizeAdvice?: string;
}) {
  // Tailles de la couleur choisie, et la déclinaison retenue : partagées avec
  // le prix et la galerie (voir `ProductVariantProvider`).
  const { sizes, chosen: selected, chooseSize } = useProductVariant();
  const chosen = selected?.variantId ?? null;
  const { open: openCart } = useCartDrawer();
  // Après un ajout réussi, le tiroir du panier s'ouvre : la cliente voit ce
  // qu'elle vient d'ajouter, le total, et le chemin vers la commande, sans
  // quitter la fiche. « Acheter maintenant » n'en a pas besoin — l'action
  // redirige vers le tunnel avant de revenir ici.
  const [state, action, pending] = useActionState<CartActionState, FormData>(
    async (previous, formData) => {
      const result = await addToCart(previous, formData);
      if (result.added) openCart();
      return result;
    },
    {},
  );

  return (
    <form action={action} className="size-picker">
      {/* La taille choisie voyage par son identifiant de variante : c'est lui
          qui porte à la fois le produit, la couleur et la taille, donc le
          stock et le prix. */}
      <input type="hidden" name="variantId" value={chosen ?? ""} />
      <ColorPicker />
      <div className="size-picker__head">
        <span className="text-caption-muted">Taille</span>
        <Link href="/aide/tailles" className="link-underline-sm">
          Guide des tailles
        </Link>
      </div>

      <ul className="size-picker__list">
        {sizes.map(({ variantId, size, quantity }) => {
          const soldOut = quantity <= 0;
          return (
            <li key={variantId}>
              <button
                type="button"
                className="size-chip"
                aria-pressed={chosen === variantId}
                disabled={soldOut}
                onClick={() => chooseSize(variantId)}
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

      {state.error && (
        <p role="alert" className="size-picker__warning">
          {state.error}
        </p>
      )}

      {/* La confirmation reste aussi sur la fiche : une fois le tiroir refermé,
          elle dit encore que l'ajout a eu lieu. */}
      {state.added && !state.error && (
        <p role="status" className="size-picker__added">
          Ajouté au panier. <Link href="/panier">Voir mon panier</Link>
        </p>
      )}

      <div className="product-buy-row">
        <button
          type="submit"
          className="link-cta-block"
          disabled={!chosen || pending}
        >
          {!chosen
            ? "Choisissez une taille"
            : pending
              ? "Ajout…"
              : "Ajouter au panier"}
        </button>
        <WishlistButton productId={productId} productName={productName} />
      </div>

      {/* Deuxième bouton du même formulaire : il envoie la même taille, avec
          l'intention de passer directement au paiement. */}
      <button
        type="submit"
        name="intent"
        value="acheter"
        className="account-button-outline"
        disabled={!chosen || pending}
      >
        Acheter maintenant
      </button>
    </form>
  );
}
