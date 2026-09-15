/** Modèle produit minimal, partagé par les cartes, les rails et le panier. */
export type Product = {
  id: string;
  /** Identifiant d'URL, stable et lisible : /produits/robe-lin-ecru */
  slug: string;
  brand: string;
  name: string;
  /** Prix en centimes : on évite les flottants sur la monnaie. */
  priceCents: number;
  /** Prix barré, présent seulement si le produit est en promotion. */
  compareAtPriceCents?: number;
  imageUrl?: string;
  /** Seconde vue, affichée au survol de la carte. */
  hoverImageUrl?: string;
  /**
   * Galerie de la fiche produit, dans l'ordre de saisie à l'admin. Elle est
   * distincte de `imageUrl` : la carte n'a besoin que de deux vues, la fiche
   * les veut toutes. Vide, la fiche retombe sur les deux vues de la carte.
   */
  images?: string[];
  /** Tailles proposées et stock de chacune. */
  sizes?: { size: string; quantity: number }[];
  /** Descriptif en points, une ligne par point. */
  description?: string[];
  composition?: string;
  care?: string;
  madeIn?: string;
  measurements?: { label: string; value: string }[];
  reference?: string;
  /** Rayon et sous-rayon — fil d'Ariane et collections similaires. */
  categorySlug?: string;
  subcategory?: string;
  /** « Notre mannequin mesure 1 m 75 et porte une taille 36. » */
  modelNote?: string;
  /**
   * Conseil de taille propre à la pièce (« Prendre votre taille habituelle »,
   * « Taille petit, prendre une taille au-dessus »). C'est le renseignement
   * qui évite le plus de retours, d'où sa place juste sous le sélecteur.
   */
  sizeAdvice?: string;
  /** Étiquette affichée en pastille sur l'image (« Nouveau », « -30 % »). */
  badge?: string;
};

/** Regroupement éditorial affiché en carrousel horizontal. */
export type ProductRail = {
  title: string;
  /** Empattement inséré dans le titre, à la manière du design de référence. */
  titleAccent?: string;
  href: string;
  products: Product[];
};
