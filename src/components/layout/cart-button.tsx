"use client";

import { IconCart } from "@/components/ui/icons";
import { useCartDrawer } from "@/components/layout/cart-drawer-context";

/**
 * Icône du panier dans l'en-tête. C'est un `<button>` et non un lien : le clic
 * ouvre le tiroir sans quitter la page. Le lien vers /panier vit dans le
 * tiroir, à sa place — l'utilisateur voit d'abord son panier, puis décide.
 */
export function CartButton({ count = 0 }: { count?: number }) {
  const { isOpen, open } = useCartDrawer();

  return (
    <>
      <button
        type="button"
        className="icon-link-nav"
        aria-label={
          count > 0
            ? `Mon panier, ${count} article${count > 1 ? "s" : ""}`
            : "Mon panier, vide"
        }
        aria-expanded={isOpen}
        aria-controls="tiroir-panier"
        onClick={open}
      >
        <IconCart />
      </button>
      {count > 0 && (
        <span
          // La pastille est décorative : le compte est déjà dans l'aria-label
          // du bouton, l'annoncer deux fois alourdirait la lecture.
          aria-hidden
          className="box-badge-round absolute -top-1 -right-1 min-w-4"
        >
          {count}
        </span>
      )}
    </>
  );
}
