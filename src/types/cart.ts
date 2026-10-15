import type { Product } from "@/types/product";

/**
 * Une ligne de panier. Le même produit choisi en deux tailles donne deux
 * lignes distinctes, d'où un `id` propre à la ligne : le `Product.id` ne
 * suffirait pas à les départager.
 */
export type CartLine = {
  id: string;
  product: Product;
  /** Couleur choisie (« Rose poudré ») ; absente pour une pièce sans couleur. */
  color?: string;
  /** Taille choisie, telle qu'affichée (« 4 ans », « 38 »…). */
  size: string;
  /**
   * Prix unitaire de la déclinaison, en centimes. C'est lui qui fait les
   * totaux, pas `product.priceCents` : une taille peut avoir son propre prix.
   */
  unitPriceCents: number;
  quantity: number;
  /**
   * Stock restant de cette taille. Il accompagne la ligne plutôt que d'être
   * rechargé au moment d'afficher le sélecteur de quantité : sans lui, le
   * panier proposerait d'en commander dix quand il en reste deux.
   */
  stock: number;
};
