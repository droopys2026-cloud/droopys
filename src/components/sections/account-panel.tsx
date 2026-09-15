import Link from "next/link";

/**
 * Raccourcis de l'espace client. Ils pointent vers ce qui existe déjà —
 * mieux vaut trois liens qui mènent quelque part que six cases mortes.
 */
const SHORTCUTS = [
  {
    href: "/compte/commandes",
    title: "Mes commandes",
    text: "Suivre un colis ou retrouver une facture, avec ou sans compte.",
  },
  {
    href: "/favoris",
    title: "Mes favoris",
    text: "Les pièces mises de côté en attendant de se décider.",
  },
  {
    href: "/fidelite",
    title: "Mon programme de fidélité",
    text: "Points cumulés, avantages et conditions du programme.",
  },
  {
    href: "/aide/retours",
    title: "Retours et échanges",
    text: "La marche à suivre et les délais, article par article.",
  },
];

/**
 * Espace client.
 *
 * Aucune authentification n'existe encore : le formulaire est complet et
 * correctement étiqueté, mais le bouton reste inactif. Un champ de mot de
 * passe qui accepte une saisie sans rien en faire donne l'illusion d'un
 * compte — c'est la pire des deux options.
 */
export function AccountPanel() {
  return (
    <section className="container-page py-14">
      <div className="grid gap-13 lg:grid-cols-2">
        <div>
          <h2 className="heading-h2 pt-0">Me connecter</h2>
          <form className="content-form">
            <div className="content-form__grid">
              <div className="content-field content-field--full">
                <label className="content-field__label" htmlFor="compte-email">
                  Adresse e-mail
                </label>
                <input
                  id="compte-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="content-field__input"
                />
              </div>

              <div className="content-field content-field--full">
                <label
                  className="content-field__label"
                  htmlFor="compte-mot-de-passe"
                >
                  Mot de passe
                </label>
                <input
                  id="compte-mot-de-passe"
                  name="motDePasse"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="content-field__input"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-9">
              <button type="submit" className="link-cta-block mt-0" disabled>
                Se connecter
              </button>
              <p className="content-field__hint m-0">
                Les comptes ne sont pas encore branchés : le suivi de commande
                se fait sans compte, par numéro et e-mail.
              </p>
            </div>
          </form>

          <p className="text-paragraph">
            Pas encore de compte ?{" "}
            <Link href="/contact" className="link-underline-sm">
              Écrivez-nous
            </Link>{" "}
            en attendant l&apos;ouverture des inscriptions.
          </p>
        </div>

        <div>
          <h2 className="heading-h2 pt-0">Accès rapides</h2>
          <ul className="flex flex-col gap-9">
            {SHORTCUTS.map((shortcut) => (
              <li key={shortcut.href}>
                <Link href={shortcut.href} className="link-underline-sm">
                  {shortcut.title}
                </Link>
                <p className="text-caption-muted">{shortcut.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
