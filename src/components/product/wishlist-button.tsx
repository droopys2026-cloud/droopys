"use client";

import { useWishlist } from "@/components/product/wishlist-provider";
import { IconWishlist } from "@/components/ui/icons";

/**
 * Bouton favori, sur la fiche comme sur les cartes.
 *
 * Toujours frère du lien ou du bouton voisin, jamais enfant : deux actions
 * imbriquées rendent l'une des deux inatteignable au clavier.
 *
 * `aria-pressed` porte l'état, et l'intitulé change avec lui — une icône
 * pleine ne dit rien à qui ne voit pas l'écran.
 */
export function WishlistButton({
  productId,
  productName,
  className = "product-wishlist",
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(productId);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Retirer ${productName} de mes favoris`
          : `Ajouter ${productName} à mes favoris`
      }
      onClick={() => toggle(productId)}
    >
      <IconWishlist />
    </button>
  );
}
