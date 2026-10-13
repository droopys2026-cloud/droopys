"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "@/app/contact/actions";
import { FormAlert } from "@/components/account/form-alert";
import { CONTACT_SUBJECTS } from "@/lib/contact";

/**
 * Formulaire de contact. Le message part par e-mail à la boutique (voir
 * `sendContactMessage`) ; en cas d'erreur, les champs sont réaffichés tels
 * que saisis — personne ne retape un long message.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    { status: "idle" },
  );

  if (state.status === "sent") {
    return (
      <p role="status" className="text-paragraph m-0">
        Merci, votre message est bien parti. Nous vous répondons par e-mail,
        en général sous 48 heures ouvrées.
      </p>
    );
  }

  const values = state.status === "error" ? state.values : null;

  return (
    // La clé remonte le formulaire à chaque erreur : les `defaultValue`
    // reprennent alors les valeurs renvoyées par le serveur.
    <form action={action} className="content-form" key={values ? JSON.stringify(values) : "vide"}>
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-nom">
            Nom
          </label>
          <input
            id="contact-nom"
            name="name"
            required
            autoComplete="name"
            defaultValue={values?.name}
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
            defaultValue={values?.email}
            className="content-field__input"
          />
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-telephone">
            Téléphone
          </label>
          <input
            id="contact-telephone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={values?.phone}
            className="content-field__input"
          />
          <span className="content-field__hint">
            Facultatif, si vous préférez qu&apos;on vous rappelle.
          </span>
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="contact-sujet">
            Sujet
          </label>
          <select
            id="contact-sujet"
            name="subject"
            className="content-field__input"
            defaultValue={values?.subject ?? CONTACT_SUBJECTS[0]}
          >
            {CONTACT_SUBJECTS.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="content-field content-field--full">
          <label className="content-field__label" htmlFor="contact-commande">
            Numéro de commande
          </label>
          <input
            id="contact-commande"
            name="orderReference"
            placeholder="DRP-000000"
            defaultValue={values?.orderReference}
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
            defaultValue={values?.message}
            className="content-field__input"
          />
        </div>

        {/* Piège à robots : hors écran et hors tabulation, un humain ne le
            remplit jamais. Pas `display: none`, que certains robots sautent. */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label htmlFor="contact-site">Ne pas remplir</label>
          <input id="contact-site" name="site" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
