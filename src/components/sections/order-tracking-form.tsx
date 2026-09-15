/**
 * Suivi de commande sans compte : numéro de commande et adresse e-mail.
 *
 * Les deux champs vont ensemble et ce n'est pas une contrainte de confort :
 * un numéro seul suffirait à lire la commande de quelqu'un d'autre en
 * essayant des numéros à la suite. L'e-mail est ce qui lie le numéro à son
 * destinataire.
 */
export function OrderTrackingForm() {
  return (
    <form className="content-form">
      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="suivi-numero">
            Numéro de commande
          </label>
          <input
            id="suivi-numero"
            name="commande"
            required
            placeholder="DRP-000000"
            pattern="DRP-[0-9]{6}"
            className="content-field__input"
          />
          <span className="content-field__hint">
            Format DRP-000000, tel qu&apos;il figure sur la confirmation.
          </span>
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="suivi-email">
            Adresse e-mail de la commande
          </label>
          <input
            id="suivi-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="content-field__input"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-9">
        <button type="submit" className="link-cta-block mt-0" disabled>
          Afficher ma commande
        </button>
        <p className="content-field__hint m-0">
          La base de commandes n&apos;est pas encore branchée.
        </p>
      </div>
    </form>
  );
}
