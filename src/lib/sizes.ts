/**
 * Listes de tailles proposées à la saisie.
 *
 * Ce ne sont que des points de départ, et rien n'y présume d'un âge : les
 * mêmes listes serviront le jour où la boutique vendra de l'adulte. Ajouter
 * une gamme, c'est ajouter une entrée ici — aucun autre fichier à toucher.
 */
export type SizeScale = {
  id: string;
  /** Type de taille, sans plage : c'est la liste qui porte les valeurs. */
  label: string;
  sizes: string[];
};

export const SIZE_SCALES: SizeScale[] = [
  {
    id: "mois",
    label: "Mois",
    sizes: [
      "Naissance",
      "1 M",
      "3 M",
      "6 M",
      "9 M",
      "12 M",
      "18 M",
      "24 M",
      "36 M",
    ],
  },
  {
    id: "numeros",
    label: "Numéros",
    // La liste va de 0 à 60 : rien n'y présume d'un âge ni d'un rayon, et le
    // jour où la boutique vend de l'adulte, il n'y a rien à changer.
    sizes: [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "26",
      "28",
      "30",
      "32",
      "34",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
      "48",
      "50",
      "52",
      "54",
      "56",
      "58",
      "60",
    ],
  },
  {
    id: "lettres",
    label: "Lettres",
    sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
  },
  {
    id: "pointures",
    label: "Pointures",
    sizes: [
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
    ],
  },
  {
    id: "unique",
    label: "Taille unique",
    sizes: ["Taille unique"],
  },
];

export function getSizeScale(id: string): SizeScale | undefined {
  return SIZE_SCALES.find((scale) => scale.id === id);
}
