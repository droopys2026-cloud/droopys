/**
 * Les marques distribuées par Droopys.
 * Le `slug` sert d'URL de rayon (/marques/stone-island) ; le libellé garde
 * la casse et la ponctuation officielles de chaque maison.
 */
export type Brand = {
  name: string;
  slug: string;
  /**
   * Logotype officiel en SVG, sous /public/logos.
   * Absent pour les maisons dont aucun vectoriel libre n'a été retrouvé
   * (Paul & Shark, Gertrude, Karl Lagerfeld) : on retombe alors sur le nom
   * composé, qui reste préférable à un logo redessiné à la main.
   */
  logo?: string;
  /**
   * Rapport largeur/hauteur du `viewBox` du fichier. Recopié du SVG, pas
   * arrondi. Il sert à donner à tous les logotypes la même surface à l'écran
   * (voir `logoBox` plus bas) : sans lui, un alignement sur la hauteur ferait
   * paraître Givenchy — dix fois plus large que haut — trois fois plus gros
   * que l'écusson presque carré de C.P. Company.
   */
  logoRatio?: number;
};

export const BRANDS: Brand[] = [
  {
    name: "Stone Island",
    slug: "stone-island",
    logo: "/logos/stone-island.svg",
    logoRatio: 619.94476 / 226,
  },
  {
    name: "C.P. Company",
    slug: "cp-company",
    logo: "/logos/cp-company.svg",
    logoRatio: 1419.4 / 890.4,
  },
  { name: "Paul & Shark", slug: "paul-and-shark" },
  {
    name: "Moncler",
    slug: "moncler",
    logo: "/logos/moncler.svg",
    logoRatio: 354.33 / 85.04,
  },
  { name: "Gertrude", slug: "gertrude" },
  {
    name: "Lanvin",
    slug: "lanvin",
    logo: "/logos/lanvin.svg",
    logoRatio: 899.544 / 113.098,
  },
  {
    name: "Givenchy",
    slug: "givenchy",
    logo: "/logos/givenchy.svg",
    logoRatio: 696.4771 / 67.9924,
  },
  {
    name: "Burberry",
    slug: "burberry",
    logo: "/logos/burberry.svg",
    logoRatio: 412.48 / 65.27,
  },
  {
    name: "Lacoste",
    slug: "lacoste",
    logo: "/logos/lacoste.svg",
    logoRatio: 121.4976 / 18.284178,
  },
  {
    name: "Chloé",
    slug: "chloe",
    logo: "/logos/chloe.svg",
    logoRatio: 638 / 196.58,
  },
  { name: "Karl Lagerfeld", slug: "karl-lagerfeld" },
  {
    name: "Zadig & Voltaire",
    slug: "zadig-et-voltaire",
    logo: "/logos/zadig-et-voltaire.svg",
    logoRatio: 907.49 / 124.52,
  },
];

/**
 * Taille d'affichage d'un logotype, à surface constante.
 *
 * Tous les logotypes couvrent la même aire `area` : `largeur × hauteur` est
 * identique d'une maison à l'autre, seule la répartition change. C'est ce que
 * l'œil lit comme « la même taille », là où une hauteur commune ou une largeur
 * commune donne toujours un logo écrasant et un logo minuscule.
 *
 * `area` est en pixels carrés : 5700 donne un écusson C.P. Company d'environ
 * 60 px de haut et un Givenchy d'environ 240 px de large.
 */
export function logoBox(ratio: number, area: number) {
  return {
    width: Math.round(Math.sqrt(area * ratio)),
    height: Math.round(Math.sqrt(area / ratio)),
  };
}

/** Recherche une marque par son slug d'URL. `undefined` si elle n'existe pas. */
export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((brand) => brand.slug === slug);
}
