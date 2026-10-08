/**
 * Menu principal, tel que les composants le consomment.
 *
 * Cette forme est celle du rendu, pas celle de la base : les quatre tables de
 * `@/db/schema/navigation` sont recomposées en un arbre par
 * `@/lib/queries/navigation`. Les composants n'ont ainsi rien à savoir des
 * jointures, et la forme n'a pas changé depuis l'époque où le menu était une
 * constante — c'est ce qui a permis de le brancher sans les réécrire.
 */

export type NavLink = { label: string; href: string };

/** Une colonne de liens, éventuellement close par un lien « voir tout ». */
export type NavColumn = { title: string; links: NavLink[]; allLink?: NavLink };

/**
 * Article mis en avant à droite du panneau, choisi automatiquement (les
 * derniers articles publiés du rayon) — voir `@/lib/queries/navigation`.
 */
export type NavFeature = {
  title: string;
  href: string;
  imageUrl?: string;
  /** Marque de l'article, au-dessus du nom. */
  brand: string;
  priceCents: number;
};

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
  features?: NavFeature[];
};
