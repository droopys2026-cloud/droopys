import { BRANDS } from "@/lib/brands";

/**
 * Menu principal. Chaque rubrique ouvre un panneau ; celles sans `columns`
 * sont de simples liens.
 *
 * Un panneau se lit en deux temps : à gauche des colonnes de liens, chacune
 * pouvant se clore par un lien « voir tout » en gras ; à droite jusqu'à deux
 * visuels mis en avant, chacun légendé et suivi d'un lien « Découvrir ».
 */
export type NavLink = { label: string; href: string };

/** Une colonne de liens, éventuellement close par un lien « voir tout ». */
export type NavColumn = { title: string; links: NavLink[]; allLink?: NavLink };

/** Visuel mis en avant à droite du panneau. */
export type NavFeature = { title: string; href: string };

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
  features?: NavFeature[];
};

export const MAIN_NAV: NavItem[] = [
  {
    label: "Nouveautés",
    href: "/nouveautes",
    columns: [
      {
        title: "Par rayon",
        links: [
          { label: "Toutes les nouveautés", href: "/nouveautes" },
          { label: "Bébé", href: "/nouveautes/bebe" },
          { label: "Fille", href: "/nouveautes/fille" },
          { label: "Garçon", href: "/nouveautes/garcon" },
        ],
        allLink: { label: "Voir toutes les nouveautés", href: "/nouveautes" },
      },
      {
        title: "Arrivages",
        links: [
          { label: "Stone Island", href: "/marques/stone-island" },
          { label: "Moncler", href: "/marques/moncler" },
          { label: "C.P. Company", href: "/marques/cp-company" },
          { label: "Burberry", href: "/marques/burberry" },
        ],
        allLink: { label: "Voir toutes les marques", href: "/marques" },
      },
    ],
    features: [
      { title: "Stone Island", href: "/marques/stone-island" },
      { title: "Moncler", href: "/marques/moncler" },
    ],
  },
  {
    label: "Bébé 0-24 mois",
    href: "/bebe",
    columns: [
      {
        title: "Par âge",
        links: [
          { label: "Naissance (0-6 mois)", href: "/bebe/naissance" },
          { label: "6-12 mois", href: "/bebe/6-12-mois" },
          { label: "12-24 mois", href: "/bebe/12-24-mois" },
        ],
        allLink: { label: "Voir tout le rayon bébé", href: "/bebe" },
      },
      {
        title: "Vêtements",
        links: [
          { label: "Bodies et pyjamas", href: "/bebe/bodies-pyjamas" },
          { label: "Ensembles", href: "/bebe/ensembles" },
          { label: "Robes et jupes", href: "/bebe/robes" },
          { label: "Manteaux et doudounes", href: "/bebe/manteaux" },
        ],
      },
      {
        title: "Le reste",
        links: [
          { label: "Chaussons et chaussures", href: "/bebe/chaussures" },
          { label: "Bonnets et accessoires", href: "/bebe/accessoires" },
          { label: "Cadeaux de naissance", href: "/bebe/cadeaux" },
        ],
      },
    ],
    features: [
      { title: "Naissance", href: "/bebe/naissance" },
      { title: "Cadeaux de naissance", href: "/bebe/cadeaux" },
    ],
  },
  {
    label: "Fille 2-16 ans",
    href: "/fille",
    columns: [
      {
        title: "Par âge",
        links: [
          { label: "2-6 ans", href: "/fille/2-6-ans" },
          { label: "6-12 ans", href: "/fille/6-12-ans" },
          { label: "12-16 ans", href: "/fille/12-16-ans" },
        ],
        allLink: { label: "Voir tout le rayon fille", href: "/fille" },
      },
      {
        title: "Vêtements",
        links: [
          { label: "Robes", href: "/fille/robes" },
          { label: "Hauts et chemisiers", href: "/fille/hauts" },
          { label: "Sweats et gilets", href: "/fille/sweats" },
          { label: "Pantalons et jeans", href: "/fille/pantalons" },
          { label: "Manteaux et doudounes", href: "/fille/manteaux" },
        ],
      },
      {
        title: "Le reste",
        links: [
          { label: "Chaussures", href: "/fille/chaussures" },
          { label: "Accessoires", href: "/fille/accessoires" },
        ],
      },
    ],
    features: [
      { title: "Robes", href: "/fille/robes" },
      { title: "Manteaux", href: "/fille/manteaux" },
    ],
  },
  {
    label: "Garçon 2-16 ans",
    href: "/garcon",
    columns: [
      {
        title: "Par âge",
        links: [
          { label: "2-6 ans", href: "/garcon/2-6-ans" },
          { label: "6-12 ans", href: "/garcon/6-12-ans" },
          { label: "12-16 ans", href: "/garcon/12-16-ans" },
        ],
        allLink: { label: "Voir tout le rayon garçon", href: "/garcon" },
      },
      {
        title: "Vêtements",
        links: [
          { label: "T-shirts et polos", href: "/garcon/t-shirts" },
          { label: "Sweats et hoodies", href: "/garcon/sweats" },
          { label: "Chemises", href: "/garcon/chemises" },
          { label: "Pantalons et jeans", href: "/garcon/pantalons" },
          { label: "Manteaux et doudounes", href: "/garcon/manteaux" },
        ],
      },
      {
        title: "Le reste",
        links: [
          { label: "Chaussures", href: "/garcon/chaussures" },
          { label: "Accessoires", href: "/garcon/accessoires" },
        ],
      },
    ],
    features: [
      { title: "Sweats", href: "/garcon/sweats" },
      { title: "Manteaux", href: "/garcon/manteaux" },
    ],
  },
  {
    label: "Manteaux & doudounes",
    href: "/manteaux",
    columns: [
      {
        title: "Par type",
        links: [
          { label: "Doudounes", href: "/manteaux/doudounes" },
          { label: "Parkas", href: "/manteaux/parkas" },
          { label: "Manteaux en laine", href: "/manteaux/laine" },
          { label: "Blousons", href: "/manteaux/blousons" },
          { label: "Combinaisons de ski", href: "/manteaux/ski" },
        ],
        allLink: { label: "Voir tous les manteaux", href: "/manteaux" },
      },
      {
        title: "Par marque",
        links: [
          { label: "Moncler", href: "/marques/moncler" },
          { label: "Stone Island", href: "/marques/stone-island" },
          { label: "C.P. Company", href: "/marques/cp-company" },
          { label: "Paul & Shark", href: "/marques/paul-and-shark" },
        ],
      },
    ],
    features: [
      { title: "Doudounes", href: "/manteaux/doudounes" },
      { title: "Parkas", href: "/manteaux/parkas" },
    ],
  },
  {
    label: "Chaussures",
    href: "/chaussures",
    columns: [
      {
        title: "Par rayon",
        links: [
          { label: "Bébé", href: "/chaussures/bebe" },
          { label: "Fille", href: "/chaussures/fille" },
          { label: "Garçon", href: "/chaussures/garcon" },
        ],
        allLink: { label: "Voir toutes les chaussures", href: "/chaussures" },
      },
      {
        title: "Par type",
        links: [
          { label: "Baskets", href: "/chaussures/baskets" },
          { label: "Bottines et boots", href: "/chaussures/bottines" },
          { label: "Sandales", href: "/chaussures/sandales" },
          { label: "Chaussons", href: "/chaussures/chaussons" },
        ],
      },
    ],
    features: [
      { title: "Baskets", href: "/chaussures/baskets" },
      { title: "Bottines", href: "/chaussures/bottines" },
    ],
  },
  {
    label: "Accessoires",
    href: "/accessoires",
    columns: [
      {
        title: "L'hiver",
        links: [
          { label: "Bonnets", href: "/accessoires/bonnets" },
          { label: "Écharpes et snoods", href: "/accessoires/echarpes" },
          { label: "Gants et moufles", href: "/accessoires/gants" },
        ],
        allLink: { label: "Voir tous les accessoires", href: "/accessoires" },
      },
      {
        title: "Tous les jours",
        links: [
          { label: "Sacs et cartables", href: "/accessoires/sacs" },
          { label: "Casquettes", href: "/accessoires/casquettes" },
          { label: "Chaussettes", href: "/accessoires/chaussettes" },
          { label: "Ceintures", href: "/accessoires/ceintures" },
        ],
      },
    ],
    features: [
      { title: "Bonnets", href: "/accessoires/bonnets" },
      { title: "Sacs et cartables", href: "/accessoires/sacs" },
    ],
  },
  {
    label: "Marques",
    href: "/marques",
    // Les colonnes viennent de la liste réelle : ajouter une marque dans
    // `@/lib/brands` la fait apparaître ici et crée sa page.
    columns: [
      {
        title: "Toutes les maisons",
        links: BRANDS.slice(0, 6).map((brand) => ({
          label: brand.name,
          href: `/marques/${brand.slug}`,
        })),
        allLink: { label: "Voir toutes les marques", href: "/marques" },
      },
      {
        title: " ",
        links: BRANDS.slice(6).map((brand) => ({
          label: brand.name,
          href: `/marques/${brand.slug}`,
        })),
      },
    ],
    features: [
      { title: "Stone Island", href: "/marques/stone-island" },
      { title: "Chloé", href: "/marques/chloe" },
    ],
  },
  {
    label: "Outlet",
    href: "/outlet",
    columns: [
      {
        title: "Par remise",
        links: [
          { label: "Jusqu'à -30 %", href: "/outlet/-30" },
          { label: "Jusqu'à -50 %", href: "/outlet/-50" },
          { label: "Dernières tailles", href: "/outlet/dernieres-tailles" },
        ],
        allLink: { label: "Voir tout l'outlet", href: "/outlet" },
      },
      {
        title: "Par rayon",
        links: [
          { label: "Bébé", href: "/outlet/bebe" },
          { label: "Fille", href: "/outlet/fille" },
          { label: "Garçon", href: "/outlet/garcon" },
        ],
      },
    ],
    features: [
      { title: "Jusqu'à -50 %", href: "/outlet/-50" },
      { title: "Dernières tailles", href: "/outlet/dernieres-tailles" },
    ],
  },
];
