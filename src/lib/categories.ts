/**
 * Les rayons et leur présentation, versés en base par `scripts/seed.mts`.
 *
 * Le site les lit en base — `listCategories`, `getCategoryBySlug` — et
 * l'admin les crée et les supprime. Ce fichier n'est plus que la description
 * de départ, lue par le seul script de peuplement.
 */
export type Category = {
  slug: string;
  href: string;
  title: string;
  /** Titre affiché en grand dans l'en-tête, s'il diffère du nom du rayon. */
  headline?: string;
  eyebrow: string;
  intro: string;
  image?: string;
  hoverImage?: string;
  /** Recadrage propre à la photo (zoom, décalage). */
  imageClassName?: string;
  /** Point d'ancrage de la photo en fond d'en-tête. */
  backdropClassName?: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "bebe",
    href: "/bebe",
    title: "Bébé",
    headline: "Bébé 0-24 mois",
    eyebrow: "0 à 24 mois",
    intro:
      "De la naissance aux premiers pas : matières douces, coupes confortables et grandes maisons. Bodies, robes, ensembles et cadeaux de naissance.",
    image: "/imgdress/bebe.webp",
    hoverImage: "/imgdress/bebe2.webp",
    backdropClassName: "object-[50%_26%]",
  },
  {
    slug: "fille",
    href: "/fille",
    title: "Fille",
    headline: "Fille 2-16 ans",
    eyebrow: "2 à 16 ans",
    intro:
      "Robes, mailles, denim et manteaux signés Chloé, Lanvin, Burberry ou Zadig & Voltaire. Des pièces choisies pour durer plus d'une saison.",
    image: "/imgdress/fille1.webp",
    hoverImage: "/imgdress/fille2.webp",
  },
  {
    slug: "garcon",
    href: "/garcon",
    title: "Garçon",
    headline: "Garçon 2-16 ans",
    eyebrow: "2 à 16 ans",
    intro:
      "Doudounes, parkas et sweats des maisons qui ont fait le vestiaire masculin : Stone Island, C.P. Company, Moncler, Paul & Shark.",
    image: "/imgdress/petitgas.webp",
    hoverImage: "/imgdress/petitgas2.webp",
  },
];

/**
 * Les autres rayons du menu. Ils n'ont pas encore de photo : leur page se
 * monte avec l'en-tête habituel, la photo viendra remplir `image`.
 *
 * « Marques » n'est pas ici : ce rayon a sa propre page, /marques, construite
 * depuis la liste des maisons.
 */
CATEGORIES.push(
  {
    slug: "nouveautes",
    href: "/nouveautes",
    title: "Nouveautés",
    eyebrow: "Derniers arrivages",
    intro:
      "Les pièces qui viennent d'entrer en boutique, toutes maisons confondues, de la naissance à 16 ans.",
  },
  {
    slug: "manteaux",
    href: "/manteaux",
    title: "Manteaux & doudounes",
    eyebrow: "L'hiver",
    intro:
      "Doudounes, parkas, manteaux en laine et combinaisons de ski — Moncler, Stone Island, C.P. Company, Paul & Shark.",
    image: "/imgdress/petitmoncler.webp",
    backdropClassName: "object-[50%_18%]",
  },
  {
    slug: "chaussures",
    href: "/chaussures",
    title: "Chaussures",
    eyebrow: "Tous les rayons",
    intro:
      "Baskets, bottines, sandales et chaussons, du premier pas à la pointure adulte.",
    image: "/imgdress/petitchaussure.webp",
    backdropClassName: "object-[50%_58%]",
  },
  {
    slug: "accessoires",
    href: "/accessoires",
    title: "Accessoires",
    eyebrow: "Pour compléter",
    intro:
      "Bonnets, écharpes, gants, sacs, casquettes et ceintures des maisons que nous distribuons.",
  },
  {
    slug: "outlet",
    href: "/outlet",
    title: "Outlet",
    eyebrow: "Fins de série",
    intro:
      "Les fins de série et les dernières tailles, aux mêmes exigences de sélection que le reste de la boutique.",
  },
);

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}
