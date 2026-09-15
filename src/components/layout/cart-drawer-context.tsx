"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * État d'ouverture du tiroir du panier.
 *
 * Pourquoi un contexte plutôt qu'un `useState` local : l'icône du panier
 * existe DEUX fois dans la page — une dans l'en-tête complet, une dans la
 * barre collante. Les deux doivent piloter le même tiroir, et il ne doit y
 * avoir qu'un seul panneau dans le DOM. L'état vit donc au-dessus des deux.
 */
type CartDrawerValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartDrawerContext = createContext<CartDrawerValue | null>(null);

export function CartDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Références stables : sans elles, chaque rendu de l'en-tête donnerait de
  // nouvelles fonctions et rerendrait tous les consommateurs pour rien.
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <CartDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer(): CartDrawerValue {
  const value = useContext(CartDrawerContext);
  if (!value) {
    throw new Error(
      "useCartDrawer doit être appelé sous <CartDrawerProvider> (posé par SiteHeader).",
    );
  }
  return value;
}
