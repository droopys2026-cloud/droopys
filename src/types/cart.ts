import type { Product } from "@/types/product";

/**
 * Une ligne de panier. Le même produit choisi en deux tailles donne deux
 * lignes distinctes, d'où un `id` propre à la ligne : le `Product.id` ne
 * suffirait pas à les départager.
 */
export type CartLine = {
  id: string;
  product: Product;
  /** Taille choisie, telle qu'affichée (« 4 ans », « 38 »…). */
  size: string;
  quantity: number;
};
