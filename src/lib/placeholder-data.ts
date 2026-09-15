import { BRANDS } from "@/lib/brands";
import type { CartLine } from "@/types/cart";
import type { Order } from "@/types/order";
import type { Product, ProductRail } from "@/types/product";

/**
 * Données de démonstration, le temps que le catalogue soit branché.
 * Les marques, elles, sont réelles : elles viennent de `@/lib/brands`.
 * Tout ce qui consomme ces objets passe par les types de `@/types/product`,
 * pour que le remplacement par l'API se fasse sans toucher aux composants.
 */
function makeProducts(prefix: string, labels: string[]): Product[] {
  return labels.map((label, index) => {
    const brand = BRANDS[index % BRANDS.length];
    const hasPhoto = brand.slug === "cp-company";
    return {
      id: `${prefix}-${index + 1}`,
      slug: `${prefix}-${index + 1}`,
      brand: brand.name,
      name: label,
      priceCents: 8900 + index * 3000,
      compareAtPriceCents: index % 4 === 0 ? 14900 + index * 3000 : undefined,
      imageUrl: hasPhoto ? "/imgdress/petitgas2.webp" : undefined,
      hoverImageUrl: hasPhoto ? "/imgdress/petitgas.webp" : undefined,
      badge: index % 4 === 0 ? "-30 %" : undefined,
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

export const HOME_RAILS: ProductRail[] = [
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

/** Les trois portes d'entrée du catalogue, par tranche d'âge. */
export const HERO_TILES = [
  {
    eyebrow: "2 à 16 ans",
    title: "Garçon",
    href: "/garcon",
    image: "/imgdress/petitgas2.webp",
    hoverImage: "/imgdress/petitgas.webp",
  },
  {
    eyebrow: "0 à 24 mois",
    title: "Bébé",
    href: "/bebe",
    image: "/imgdress/bebe2.webp",
    hoverImage: "/imgdress/bebe.webp",
  },
  {
    eyebrow: "2 à 16 ans",
    title: "Fille",
    href: "/fille",
    image: "/imgdress/fille2.webp",
    hoverImage: "/imgdress/fille1.webp",
    // La photo est cadrée large : on resserre et on fait glisser l'image vers
    // le bas pour amener le visage et le sac à la hauteur des autres tuiles.
    imageClassName: "scale-[1.65] translate-y-[19%]",
  },
];

/**
 * Panier de démonstration, le temps qu'un vrai panier (session, API) existe.
 * Les produits sont repris des rails de la page d'accueil pour que les visuels
 * et les prix affichés dans le tiroir soient ceux du catalogue de démo.
 */
export const DEMO_CART_LINES: CartLine[] = [
  {
    id: "ligne-1",
    product: HOME_RAILS[0].products[0],
    size: "4 ans",
    quantity: 1,
  },
  {
    id: "ligne-2",
    product: HOME_RAILS[0].products[2],
    size: "8 ans",
    quantity: 2,
  },
];

/**
 * Fiche de démonstration, le temps que le catalogue soit branché.
 * Elle porte tout ce qu'une vraie fiche affiche : tailles et stock, points de
 * description, composition, entretien et mesures.
 */
export const DEMO_PRODUCT: Product = {
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
  subcategory: "Manteaux et doudounes",
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

/**
 * Commande d'exemple. Elle sert à voir la fiche tant qu'aucune vente n'a eu
 * lieu, et disparaîtra avec le branchement de la base.
 */
export const DEMO_ORDER: Order = {
  id: "exemple",
  reference: "DR-2026-0001",
  placedAt: "2026-08-19T14:32:00.000Z",
  status: "a-preparer",
  customerName: "Camille Rousseau",
  customerEmail: "camille.rousseau@example.com",
  shippingAddress: [
    "12 rue des Lilas",
    "Appartement 4",
    "75011 Paris",
    "France",
  ],
  lines: [
    {
      productName: "Parka à capuche Goggle",
      brand: "C.P. Company",
      size: "10",
      quantity: 1,
      unitPriceCents: 39500,
    },
    {
      productName: "Bonnet côtelé",
      brand: "Moncler",
      size: "Taille unique",
      quantity: 2,
      unitPriceCents: 8900,
    },
  ],
  shippingCents: 0,
  payment: "Carte bancaire",
};
