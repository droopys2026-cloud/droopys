/**
 * Bandeau d'inscription à la newsletter.
 *
 * Le texte vit ici et non dans le composant pour la même raison que les pages
 * de contenu : c'est l'admin qui doit pouvoir le réécrire, pas le développeur.
 * Le formulaire Admin › Réglages lit et écrit ces quatre champs.
 *
 * `provider` n'est pas du texte mais une déclaration : tant qu'aucun
 * prestataire n'est choisi, le formulaire du site n'a nulle part où poster et
 * son bouton reste inactif. C'est ce champ qui décide, pas une constante
 * cachée dans le composant.
 */
export type NewsletterContent = {
  title: string;
  text: string;
  /** Texte gris dans le champ. Ce n'est pas l'étiquette, qui reste lue. */
  placeholder: string;
  buttonLabel: string;
  /** Prestataire d'emailing. `null` : envoi non branché. */
  provider: string | null;
};

export const NEWSLETTER: NewsletterContent = {
  title: "Restons en contact",
  text: "Nouveautés, ventes privées et sélections Droopy's, une fois par semaine.",
  placeholder: "Votre adresse e-mail",
  buttonLabel: "Je m'inscris",
  provider: null,
};
