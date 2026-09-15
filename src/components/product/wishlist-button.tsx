"use client";

import { useState } from "react";
import { IconWishlist } from "@/components/ui/icons";

/**
 * Bouton favori de la fiche produit.
 *
 * Frère du bouton d'ajout au panier, jamais enfant : deux actions imbriquées
 * rendent l'une des deux inatteignable au clavier.
 *
 * `aria-pressed` porte l'état, et l'intitulé change avec lui — une icône
 * pleine ne dit rien à qui ne voit pas l'écran. Rien n'est encore conservé :
 * la liste d'envies attend la base.
 */
export function WishlistButton({ productName }: { productName: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      className="product-wishlist"
      aria-pressed={saved}
      aria-label={
        saved
          ? `Retirer ${productName} de mes favoris`
          : `Ajouter ${productName} à mes favoris`
      }
      onClick={() => setSaved((current) => !current)}
    >
      <IconWishlist />
    </button>
  );
}
