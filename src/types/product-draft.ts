/**
 * Fiche produit complète, telle que l'admin la saisit.
 *
 * Le modèle suit ce qu'une fiche de boutique de luxe affiche réellement :
 * un descriptif en points, les mesures du mannequin, la composition et
 * l'entretien. Chaque champ est optionnel sauf ceux qui font la fiche
 * (marque, nom, prix) : on doit pouvoir enregistrer un brouillon.
 */
export type SizeStock = {
  size: string;
  /** Quantité en stock. 0 = affichée mais indisponible. */
  quantity: number;
};

export type ProductDraft = {
  brandSlug: string;
  name: string;
  /** Prix en centimes : jamais de flottant sur la monnaie. */
  priceCents: number;
  compareAtPriceCents?: number;
  /** Référence fournisseur, imprimée en bas de fiche. */
  reference?: string;

  /** Rayon (bebe, fille, garcon…) et sous-rayon (robes, manteaux…). */
  categorySlug: string;
  /** Identifiant d'une ligne de `subcategories`, jamais une saisie libre. */
  subcategoryId?: string;

  sizeScaleId: string;
  stock: SizeStock[];

  /** Descriptif en points, une ligne par point. */
  description: string;
  madeIn?: string;
  composition?: string;
  care?: string;

  /** Mesures : « Notre mannequin porte une taille 36 et mesure 172 cm. » */
  modelNote?: string;
  measurements?: { label: string; value: string }[];

  published: boolean;
};
