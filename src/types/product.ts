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
  /**
   * Couleurs proposées, dans l'ordre de l'admin. Absent pour une pièce sans
   * couleur. `images` vient déjà composé : photos de la couleur, puis photos
   * communes — la fiche n'a qu'à l'afficher.
   */
  colors?: ProductColor[];
  /**
   * Déclinaisons proposées (taille, et couleur s'il y en a) et stock de
   * chacune. `variantId` est ce que le panier enregistre : il porte à la fois
   * le produit, la couleur et la taille, là où le triplet de libellés
   * demanderait une recherche à chaque geste.
   */
  sizes?: ProductSize[];
  /** Descriptif en points, une ligne par point. */
  description?: string[];
  composition?: string;
  care?: string;
  madeIn?: string;
  measurements?: { label: string; value: string }[];
  reference?: string;
  /** Rayon et sous-rayon — fil d'Ariane et collections similaires. */
  categorySlug?: string;
  /**
   * Slug et titre, et non le seul titre : le fil d'Ariane doit pouvoir mener
   * à la page du sous-rayon, et un titre ne fait pas une adresse.
   */
  subcategory?: { slug: string; title: string };
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

export type ProductColor = {
  id: string;
  /** Forme d'URL du nom : `?couleur=rose-poudre`. */
  slug: string;
  name: string;
  /** Teinte de la pastille, `#rrggbb`. */
  hex: string;
  images: string[];
};

export type ProductSize = {
  variantId: string;
  size: string;
  quantity: number;
  /** Couleur de la déclinaison ; absente pour une pièce sans couleur. */
  colorId?: string;
  /** Prix effectif en centimes — déjà résolu, propre ou hérité du produit. */
  priceCents: number;
  /**
   * Vrai quand la déclinaison a son propre prix. Le prix barré du produit
   * ne s'y applique pas : il a été fixé contre le prix du produit, pas
   * contre celui-ci.
   */
  ownPrice: boolean;
};

/** Regroupement éditorial affiché en carrousel horizontal. */
export type ProductRail = {
  title: string;
  /** Empattement inséré dans le titre, à la manière du design de référence. */
  titleAccent?: string;
  href: string;
  products: Product[];
};
