import { BRANDS } from "../src/lib/brands";
import type { NavItem } from "../src/types/navigation";

/**
 * Le menu de départ, versé en base par `scripts/seed.mts`.
 *
 * Il a longtemps été la seule description du deuxième niveau du site ; il est
 * maintenant une donnée d'amorçage, au même titre que le catalogue de
 * démonstration. Le site, lui, lit `@/lib/queries/navigation`.
 *
 * Les articles mis en avant dans les panneaux ne figurent pas ici : ils sont
 * choisis automatiquement à la lecture du menu (`@/lib/queries/navigation`).
 */

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
  },
  {
    label: "Outlet",
    href: "/outlet",
    columns: [
      {
        // Aucune tranche de remise ici : « jusqu'à -50 % » promettrait des
        // prix que la boutique n'a pas fixés. Les remises se lisent sur les
        // fiches, d'après le prix barré saisi par la boutique.
        title: "Fins de série",
        links: [
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
  },
];
