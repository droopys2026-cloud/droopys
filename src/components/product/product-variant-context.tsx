"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProductColor, ProductSize } from "@/types/product";

/**
 * Couleur et taille choisies sur la fiche.
 *
 * Trois blocs en dépendent et ne se touchent pas dans la page — la galerie à
 * gauche, le prix et le sélecteur à droite, séparés par du rendu serveur. Un
 * contexte les relie sans faire passer toute la fiche côté client.
 */
type ProductVariantState = {
  colors?: ProductColor[];
  /** Couleur choisie ; absente pour une pièce sans couleur. */
  color?: ProductColor;
  /** Tailles de la couleur choisie (toutes, sans couleur). */
  sizes: ProductSize[];
  /** Déclinaison choisie, ou `null` tant qu'aucune taille ne l'est. */
  chosen: ProductSize | null;
  chooseColor: (colorId: string) => void;
  chooseSize: (variantId: string) => void;
};

const ProductVariantContext = createContext<ProductVariantState | null>(null);

export function ProductVariantProvider({
  colors,
  sizes,
  children,
}: {
  colors?: ProductColor[];
  sizes: ProductSize[];
  children: ReactNode;
}) {
  const [colorId, setColorId] = useState(colors?.[0]?.id);
  const [variantId, setVariantId] = useState<string | null>(null);

  // `?couleur=` est lu après l'hydratation et non par la page : la fiche
  // reste pré-rendue, une seule fois pour toutes les couleurs. Un lien
  // partagé s'ouvre donc sur la première couleur, puis bascule aussitôt.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("couleur");
    const match = colors?.find((color) => color.slug === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setColorId(match.id);
  }, [colors]);

  const color = colors?.find((entry) => entry.id === colorId);
  const colorSizes = color ? sizes.filter((entry) => entry.colorId === color.id) : sizes;
  const chosen = colorSizes.find((entry) => entry.variantId === variantId) ?? null;

  function chooseColor(id: string) {
    const next = colors?.find((entry) => entry.id === id);
    if (!next) return;
    setColorId(id);
    // La taille suit si elle existe en stock dans la nouvelle couleur : on
    // compare des couleurs pour une taille donnée, pas l'inverse.
    const sameSize = sizes.find(
      (entry) => entry.colorId === id && entry.size === chosen?.size && entry.quantity > 0,
    );
    setVariantId(sameSize?.variantId ?? null);

    // L'adresse suit la couleur, pour qu'un lien copié ouvre la bonne.
    const url = new URL(window.location.href);
    url.searchParams.set("couleur", next.slug);
    window.history.replaceState(window.history.state, "", url);
  }

  return (
    <ProductVariantContext.Provider
      value={{
        colors,
        color,
        sizes: colorSizes,
        chosen,
        chooseColor,
        chooseSize: setVariantId,
      }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant(): ProductVariantState {
  const state = useContext(ProductVariantContext);
  if (!state) {
    throw new Error("useProductVariant hors de <ProductVariantProvider>.");
  }
  return state;
}
