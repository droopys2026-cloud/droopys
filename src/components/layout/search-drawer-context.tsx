"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * État d'ouverture du tiroir de recherche.
 *
 * Même raison que pour le panier (voir `cart-drawer-context`) : l'icône de
 * recherche existe deux fois — en-tête complet et barre collante — et les deux
 * doivent piloter un tiroir unique. L'état vit donc au-dessus des deux.
 */
type SearchDrawerValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const SearchDrawerContext = createContext<SearchDrawerValue | null>(null);

export function SearchDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SearchDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </SearchDrawerContext.Provider>
  );
}

export function useSearchDrawer(): SearchDrawerValue {
  const value = useContext(SearchDrawerContext);
  if (!value) {
    throw new Error(
      "useSearchDrawer doit être appelé sous <SearchDrawerProvider> (posé par SiteHeader).",
    );
  }
  return value;
}
