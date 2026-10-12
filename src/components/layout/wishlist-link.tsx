"use client";

import Link from "next/link";
import { useWishlist } from "@/components/product/wishlist-provider";
import { IconWishlist } from "@/components/ui/icons";

/**
 * Icône des favoris dans l'en-tête, avec la même pastille que le panier.
 *
 * Le nombre vient du contexte des favoris : il suit chaque cœur cliqué sur
 * la page, sans rechargement. Il apparaît un instant après la page, le temps
 * que la liste soit chargée (voir `WishlistProvider`).
 */
export function WishlistLink() {
  const { count } = useWishlist();

  return (
    <>
      <Link
        href="/favoris"
        className="icon-link-nav"
        aria-label={
          count > 0 ? `Mes favoris, ${count} article${count > 1 ? "s" : ""}` : "Mes favoris"
        }
      >
        <IconWishlist />
      </Link>
      {count > 0 && (
        // Décorative : le nombre est déjà dans l'aria-label du lien.
        <span aria-hidden className="cart-count">
          {count}
        </span>
      )}
    </>
  );
}
