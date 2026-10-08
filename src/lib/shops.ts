/**
 * Boutiques physiques.
 *
 * Seul l'établissement ouvert au registre y figure. L'entreprise en compte un
 * second, fermé : le lister enverrait des visiteurs devant un rideau baissé.
 * Les horaires ne viennent d'aucun registre — ils restent vides tant que la
 * boutique ne les a pas donnés, plutôt que d'être devinés sur le centre
 * commercial.
 */
export type Shop = {
  id: string;
  name: string;
  address: string[];
  /** Coordonnées WGS84 relevées au registre, pour le lien cartographique. */
  latitude: number;
  longitude: number;
  /** Une ligne par jour ou groupe de jours. Vide = non communiqué. */
  hours: string[];
  phone: string | null;
  /** Services disponibles sur place, repris de la page « Retrait en boutique ». */
  services: string[];
  /** Photos de la boutique, servies depuis `public/`. */
  photos: { src: string; alt: string }[];
};

export const SHOPS: Shop[] = [
  {
    id: "marseille-grand-littoral",
    name: "Droopy's Marseille — Grand Littoral",
    address: [
      "Centre commercial Grand Littoral",
      "139 avenue de la Viste",
      "13015 Marseille",
    ],
    latitude: 43.36170923,
    longitude: 5.356117265,
    hours: [],
    phone: null,
    services: [
      "Retrait des commandes en ligne",
      "Retour et échange d'un achat en ligne",
      "Conseil taille et essayage",
      "Carte cadeau",
    ],
    photos: [
      {
        src: "/boutiques/grand-littoral-vitrine.jpg",
        alt: "Vitrine de la boutique Droopy's dans la galerie de Grand Littoral",
      },
      {
        src: "/boutiques/grand-littoral-entree.jpeg",
        alt: "Un enfant pose devant l'entrée de la boutique Droopy's",
      },
    ],
  },
];

/** Lien vers la carte, construit depuis les coordonnées du registre. */
export function mapUrl(shop: Shop): string {
  return `https://www.openstreetmap.org/?mlat=${shop.latitude}&mlon=${shop.longitude}#map=18/${shop.latitude}/${shop.longitude}`;
}
