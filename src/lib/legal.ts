/**
 * Identité légale de la boutique.
 *
 * Deux origines distinctes, et elles ne se mélangent pas :
 *
 * 1. Ce qui vient du registre public (annuaire-entreprises.data.gouv.fr,
 *    établissement 491 728 945 00024, relevé le 15 septembre 2026 ; numéro de
 *    TVA fourni par la boutique d'après l'INSEE et le RNE le 12 octobre
 *    2026). Ces valeurs sont vérifiables par n'importe qui.
 * 2. Ce que le registre ne publie pas et que la boutique n'a pas encore
 *    fourni : capital social, téléphone, e-mail, directeur de la publication.
 *    Ces champs valent `null` et s'affichent en clair comme restant à
 *    compléter.
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
  /**
   * Registre du commerce : siège à Marseille, donc greffe du tribunal de
   * commerce de Marseille. À recouper avec l'extrait Kbis.
   */
  rcs: "RCS Marseille 491 728 945" as string | null,
  /** TVA intracommunautaire (INSEE / RNE, relevé le 12 octobre 2026). */
  vat: "FR80491728945" as string | null,
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
  /**
   * Hébergeur (LCEN, art. 6). Adresse relevée dans la politique de
   * confidentialité de Vercel le 12 octobre 2026 ; Vercel ne publie aucun
   * numéro de téléphone, seulement une adresse de contact — on l'écrit
   * plutôt que de recopier un numéro trouvé ailleurs et non vérifiable.
   */
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
    phone: "non publié par l'hébergeur — contact : privacy@vercel.com",
  } as { name: string; address: string; phone: string } | null,

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
