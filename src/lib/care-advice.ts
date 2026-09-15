/**
 * Consignes d'entretien courantes, prêtes à cliquer.
 *
 * Écrites une fois et réutilisées : deux fiches qui disent « Lavage à 30° » et
 * « lavage machine 30 degrés » se contredisent aux yeux d'une cliente, et
 * personne ne peut filtrer là-dessus.
 */
export const CARE_ADVICE: { group: string; lines: string[] }[] = [
  {
    group: "Lavage",
    lines: [
      "Lavage en machine à 30° sur cycle délicat.",
      "Lavage en machine à 40°.",
      "Lavage à la main à l'eau froide.",
      "Laver séparément les premières fois.",
      "Laver à l'envers.",
      "Ne pas laver.",
    ],
  },
  {
    group: "Séchage",
    lines: [
      "Ne pas sécher en machine.",
      "Séchage à plat.",
      "Sécher à l'ombre, à l'abri du soleil direct.",
      "Ne pas essorer.",
    ],
  },
  {
    group: "Repassage",
    lines: [
      "Repassage doux, 110° maximum.",
      "Repassage moyen, 150° maximum.",
      "Repasser sur l'envers.",
      "Ne pas repasser.",
    ],
  },
  {
    group: "Produits",
    lines: [
      "Ne pas utiliser d'eau de Javel.",
      "Ne pas utiliser d'assouplissant.",
      "Nettoyage à sec uniquement.",
      "Ne pas nettoyer à sec.",
    ],
  },
  {
    group: "Par matière",
    lines: [
      "Laine : lavage à la main à froid, séchage à plat.",
      "Cachemire : nettoyage à sec recommandé.",
      "Soie : lavage à la main, repassage doux sur l'envers.",
      "Cuir : essuyer avec un chiffon doux et sec.",
      "Duvet : lavage machine à 30°, séchage avec balles de lavage.",
      "Denim : laver à l'envers, à froid, pour garder la couleur.",
      "Maille : plier plutôt que suspendre pour éviter de détendre.",
    ],
  },
];
