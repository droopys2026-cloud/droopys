/**
 * Identité légale de la boutique.
 *
 * Deux origines distinctes, et elles ne se mélangent pas :
 *
 * 1. Ce qui vient du registre public (annuaire-entreprises.data.gouv.fr,
 *    établissement 491 728 945 00024, relevé le 15 septembre 2026). Ces
 *    valeurs sont vérifiables par n'importe qui, on les écrit telles quelles.
 * 2. Ce que le registre ne publie pas : capital social, numéro de TVA,
 *    greffe d'immatriculation, téléphone, e-mail, hébergeur, directeur de la
 *    publication. Ces champs valent `null` et s'affichent en clair comme
 *    restant à compléter.
 *
 * Le choix de `null` plutôt qu'une valeur plausible est délibéré : une
 * mention légale fausse expose plus qu'une mention légale incomplète, et une
 * valeur inventée finit toujours par être recopiée ailleurs sans être
 * revérifiée. `MISSING` rend le trou visible sur la page elle-même.
 */

/** Ce qui s'affiche à la place d'une valeur non encore fournie. */
export const MISSING = "à compléter";

export const LEGAL = {
  /** Dénomination sociale au registre — ce n'est pas l'enseigne. */
  companyName: "DROOPY'S LITTORAL",
  /** Enseigne commerciale déposée, celle que porte la devanture. */
  tradeName: "DROOPY'S",
  /** Nom d'usage du site. */
  brand: "Droopy's",

  /** Catégorie juridique INSEE 5499. */
  legalForm: "Société à responsabilité limitée (SARL)",
  siren: "491 728 945",
  siret: "491 728 945 00024",
  /** Registre du commerce : greffe non publié par l'API, à confirmer. */
  rcs: null as string | null,
  /** TVA intracommunautaire : non publiée, à confirmer auprès du SIE. */
  vat: null as string | null,
  /** Capital social : non publié par l'API. */
  capital: null as string | null,

  /** Code d'activité principale et son libellé officiel. */
  apeCode: "47.71Z",
  apeLabel: "Commerce de détail d'habillement en magasin spécialisé",
  /** Date de création de l'entreprise au registre. */
  createdAt: "2006-09-01",

  address: {
    line1: "Centre commercial Grand Littoral",
    line2: "139 avenue de la Viste",
    postalCode: "13015",
    city: "Marseille",
    country: "France",
  },

  /** Coordonnées de contact : à renseigner dans Admin › Réglages. */
  phone: null as string | null,
  email: null as string | null,

  /** Responsable de la publication du site. */
  publicationDirector: null as string | null,
  /** Hébergeur : raison sociale, adresse et téléphone sont obligatoires. */
  host: null as { name: string; address: string; phone: string } | null,

  /** Plateforme européenne de règlement en ligne des litiges (art. 14 RGL). */
  odrUrl: "https://ec.europa.eu/consumers/odr",
} as const;

/** Adresse du siège sur une seule ligne, pour un paragraphe courant. */
export const LEGAL_ADDRESS_INLINE = [
  LEGAL.address.line1,
  LEGAL.address.line2,
  `${LEGAL.address.postalCode} ${LEGAL.address.city}`,
].join(", ");

/** Affiche une valeur, ou la marque comme restant à fournir. */
export function orMissing(value: string | null | undefined): string {
  return value ?? MISSING;
}
