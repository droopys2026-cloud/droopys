"use client";

import { createContext, use, useCallback, useEffect, useState, useTransition } from "react";
import { loadWishlist, toggleWishlist } from "@/app/actions/wishlist";

type WishlistContextValue = {
  isSaved: (productId: string) => boolean;
  toggle: (productId: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Favoris du visiteur, partagés par tous les cœurs de la page.
 *
 * La liste est chargée **après** l'affichage, par une action serveur, plutôt
 * que lue dans la mise en page racine : la lire là rendrait chaque page du
 * site dynamique, catalogue compris, pour colorer quelques icônes. Les cœurs
 * s'allument donc un instant après la page — un écart acceptable.
 *
 * Le clic est optimiste : le cœur change tout de suite, et revient en arrière
 * si le serveur refuse.
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const [, startTransition] = useTransition();

  useEffect(() => {
    loadWishlist()
      .then((loaded) => setIds(new Set(loaded)))
      .catch((error: unknown) => console.error("Favoris non chargés :", error));
  }, []);

  const toggle = useCallback((productId: string) => {
    const flip = (current: Set<string>) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    };

    setIds(flip);
    startTransition(async () => {
      try {
        const { saved } = await toggleWishlist(productId);
        setIds((current) => {
          if (current.has(productId) === saved) return current;
          return flip(current);
        });
      } catch (error) {
        console.error("Favori non enregistré :", error);
        setIds(flip);
      }
    });
  }, []);

  const isSaved = useCallback((productId: string) => ids.has(productId), [ids]);

  return <WishlistContext value={{ isSaved, toggle }}>{children}</WishlistContext>;
}

export function useWishlist(): WishlistContextValue {
  const context = use(WishlistContext);
  if (!context) throw new Error("useWishlist doit être utilisé sous WishlistProvider.");
  return context;
}
