import { BRANDS } from "../src/lib/brands";


/**
 * Catalogue de démonstration, versé en base par `scripts/seed.mts`.
 *
 * Il vit dans `scripts/` et non dans `src/` : ce n'est plus une donnée du
 * site, seulement la matière d'un remplissage initial. Les marques, elles,
 * sont réelles — elles viennent de `src/lib/brands`.
 *
 * Le type est local et volontairement plus lâche que `Product` : une fiche de
 * semis n'a pas d'identifiant de variante, ceux-ci naissent de l'insertion.
 */
export type DemoProduct = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  priceCents: number;
  compareAtPriceCents?: number;
  imageUrl?: string;
  hoverImageUrl?: string;
  images?: string[];
  sizes?: { size: string; quantity: number }[];
  description?: string[];
  composition?: string;
  care?: string;
  madeIn?: string;
  measurements?: { label: string; value: string }[];
  reference?: string;
  categorySlug?: string;
  /** Slug du sous-rayon, deuxième segment de son URL : « manteaux ». */
  subcategorySlug?: string;
  modelNote?: string;
  sizeAdvice?: string;
  badge?: string;
};

type DemoRail = { title: string; titleAccent?: string; href: string; products: DemoProduct[] };
function makeProducts(prefix: string, labels: string[]): DemoProduct[] {
  return labels.map((label, index) => {
    const brand = BRANDS[index % BRANDS.length];
    const hasPhoto = brand.slug === "cp-company";
    return {
      id: `${prefix}-${index + 1}`,
      slug: `${prefix}-${index + 1}`,
      brand: brand.name,
      name: label,
      priceCents: 8900 + index * 3000,
      imageUrl: hasPhoto ? "/imgdress/petitgas2.webp" : undefined,
      hoverImageUrl: hasPhoto ? "/imgdress/petitgas.webp" : undefined,
      // Les rails servent aussi de catalogue à la fiche produit : sans
      // tailles, la fiche s'ouvre sur un bouton d'achat impossible à activer.
      // Le stock varie d'un article à l'autre pour que les états « épuisé »
      // et « dernière pièce » soient visibles sans les mettre en scène.
      sizes: DEMO_SIZES.map((size, rank) => ({
        size,
        quantity: (index + rank * 3) % 7,
      })),
      categorySlug: DEMO_CATEGORIES[index % DEMO_CATEGORIES.length],
      description: [`${label} ${brand.name}.`],
      sizeAdvice: "Prendre votre taille habituelle.",
    };
  });
}

/** Tailles des articles de démonstration. */
const DEMO_SIZES = ["4", "6", "8", "10", "12", "14"];

/** Rayons des articles de démonstration, pour le fil d'Ariane. */
const DEMO_CATEGORIES = ["garcon", "fille", "bebe"];

export const HOME_RAILS: DemoRail[] = [
  {
    title: "Nouveautés ",
    titleAccent: "de la saison",
    href: "/nouveautes",
    products: makeProducts("nouveautes", [
      "Doudoune matelassée",
      "Parka à capuche",
      "Sweat à logo",
      "Robe en maille",
      "Pantalon cargo",
      "Baskets basses",
      "Chemise en popeline",
      "Bonnet côtelé",
    ]),
  },
  {
    title: "Les indispensables ",
    titleAccent: "de l'hiver",
    href: "/hiver",
    products: makeProducts("hiver", [
      "Doudoune sans manches",
      "Manteau en laine",
      "Écharpe en cachemire",
      "Gilet zippé",
      "Bottines fourrées",
      "Combinaison de neige",
      "Gants en cuir",
      "Pull col roulé",
    ]),
  },
  {
    title: "Derniers produits ",
    titleAccent: "vus",
    href: "/historique",
    products: makeProducts("historique", [
      "T-shirt à imprimé",
      "Short en molleton",
      "Casquette brodée",
      "Sac à dos",
      "Jean droit",
      "Cardigan en maille",
      "Sandales en cuir",
      "Body en coton",
    ]),
  },
];

/**
 * Fiche de démonstration, le temps que le catalogue soit branché.
 * Elle porte tout ce qu'une vraie fiche affiche : tailles et stock, points de
 * description, composition, entretien et mesures.
 */
export const DEMO_PRODUCT: DemoProduct = {
  id: "cp-parka",
  slug: "cp-company-parka-capuche",
  brand: "C.P. Company",
  name: "Parka à capuche Goggle",
  priceCents: 39500,
  imageUrl: "/imgdress/petitgas2.webp",
  hoverImageUrl: "/imgdress/petitgas.webp",
  images: [
    "/imgdress/petitgas2.webp",
    "/imgdress/petitgas.webp",
    "/imgdress/petitchaussure.webp",
  ],
  reference: "CP0807FAD4H01I30VU",
  categorySlug: "garcon",
  subcategorySlug: "manteaux",
  modelNote: "Notre mannequin mesure 1 m 40 et porte une taille 10.",
  sizeAdvice: "Prendre votre taille habituelle.",
  sizes: [
    { size: "4", quantity: 6 },
    { size: "6", quantity: 2 },
    { size: "8", quantity: 0 },
    { size: "10", quantity: 1 },
    { size: "12", quantity: 4 },
    { size: "14", quantity: 0 },
  ],
  description: [
    "Parka en nylon technique beige à capuche Goggle.",
    "Deux lentilles teintées sur la capuche, signature de la maison.",
    "Fermeture zippée sous patte pressionnée.",
    "Quatre poches plaquées à rabat.",
    "Badge lentille brodé sur la manche gauche.",
  ],
  madeIn: "Italie",
  composition: "100 % polyamide. Doublure : 100 % coton.",
  care: "Lavage à la main à 30°. Ne pas sécher en machine.",
  measurements: [
    { label: "Longueur de manche", value: "48 cm" },
    { label: "Largeur d'épaules", value: "36 cm" },
    { label: "Longueur dos", value: "52 cm" },
  ],
};

