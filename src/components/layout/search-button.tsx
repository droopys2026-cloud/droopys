"use client";

import { IconSearch } from "@/components/ui/icons";
import { useSearchDrawer } from "@/components/layout/search-drawer-context";

/**
 * Icône de recherche de l'en-tête. Comme celle du panier, c'est un `<button>`
 * et non un lien : le clic ouvre un tiroir sans quitter la page. La page
 * `/recherche` reste au bout du formulaire, pour une liste de résultats
 * complète et partageable.
 */
export function SearchButton() {
  const { isOpen, open } = useSearchDrawer();

  return (
    <button
      type="button"
      className="icon-button-muted-border"
      aria-label="Rechercher"
      aria-expanded={isOpen}
      aria-controls="tiroir-recherche"
      onClick={open}
    >
      <IconSearch />
    </button>
  );
}
