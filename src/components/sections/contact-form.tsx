/**
 * Formulaire de contact.
 *
 * Aucune action serveur n'est branchée : la validation est celle du
 * navigateur, et le bouton d'envoi reste inactif. Un formulaire qui semble
 * partir sans rien envoyer est pire qu'un formulaire visiblement inactif —
 * le visiteur attend une réponse qui ne viendra jamais.
 */
const SUBJECTS = [
  "Ma commande",
  "Un retour ou un remboursement",
  "Une question sur un article",
  "La boutique de Marseille",
  "Presse et partenariats",
  "Autre",
];

export function ContactForm() {
  return (
    <form className="content-form">
      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-nom">
            Nom
          </label>
          <input
            id="contact-nom"
            name="nom"
            required
            autoComplete="name"
            className="content-field__input"
          />
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-email">
            Adresse e-mail
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="content-field__input"
          />
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-sujet">
            Sujet
          </label>
          <select
            id="contact-sujet"
            name="sujet"
            className="content-field__input"
            defaultValue={SUBJECTS[0]}
          >
            {SUBJECTS.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-commande">
            Numéro de commande
          </label>
          <input
            id="contact-commande"
            name="commande"
            placeholder="DRP-000000"
            className="content-field__input"
          />
          <span className="content-field__hint">
            Facultatif, mais il nous évite un aller-retour.
          </span>
        </div>

        <div className="content-field content-field--full">
          <label className="content-field__label" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            required
            className="content-field__input"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-9">
        <button type="submit" className="link-cta-block mt-0" disabled>
          Envoyer
        </button>
        <p className="content-field__hint m-0">
          L&apos;envoi n&apos;est pas encore branché : le service de messagerie
          reste à choisir.
        </p>
      </div>
    </form>
  );
}
