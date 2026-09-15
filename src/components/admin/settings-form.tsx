"use client";

import { useState } from "react";
import { NEWSLETTER } from "@/lib/newsletter";

/**
 * Réglages de la boutique.
 *
 * Ce sont les valeurs répétées partout sur le site : le seuil de livraison
 * offerte apparaît dans la barre d'annonce, sur la fiche produit, dans le
 * panier et dans le pied de page. Les saisir une fois évite qu'ils finissent
 * par se contredire d'une page à l'autre.
 *
 * Rien n'est enregistré tant que Supabase n'est pas branché.
 */
const PAYMENTS = [
  "Carte bancaire",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Klarna — paiement en 3 fois",
  "Virement",
];

export function SettingsForm() {
  const [payments, setPayments] = useState<string[]>([
    "Carte bancaire",
    "PayPal",
    "Klarna — paiement en 3 fois",
  ]);

  return (
    <form className="admin-form admin-form--wide">
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Boutique</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="nom-boutique">
              Nom
            </label>
            <input
              id="nom-boutique"
              className="admin-field__input"
              defaultValue="Droopys"
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="email">
              E-mail de contact
            </label>
            <input
              id="email"
              type="email"
              className="admin-field__input"
              placeholder="contact@droopys.fr"
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              className="admin-field__input"
              placeholder="01 23 45 67 89"
            />
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="adresse">
              Adresse de la boutique
            </label>
            <textarea
              id="adresse"
              rows={3}
              className="admin-field__input"
              placeholder="12 rue de la Paix, 75002 Paris"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Livraison</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="seuil">
              Livraison offerte à partir de (€)
            </label>
            <input
              id="seuil"
              className="admin-field__input"
              defaultValue="150"
            />
            <p className="admin-field__hint">
              Affiché dans la barre d&apos;annonce, sur les fiches et dans le
              panier.
            </p>
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="frais">
              Frais de livraison (€)
            </label>
            <input
              id="frais"
              className="admin-field__input"
              placeholder="6,90"
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="delai">
              Délai annoncé
            </label>
            <input
              id="delai"
              className="admin-field__input"
              placeholder="48 h en France métropolitaine"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Paiement</legend>
        <p className="admin-field__hint">
          Les moyens cochés s&apos;affichent dans le pied de page et au
          paiement.
        </p>
        <ul className="admin-picker__grid">
          {PAYMENTS.map((method) => {
            const chosen = payments.includes(method);
            return (
              <li key={method}>
                <button
                  type="button"
                  className="admin-chip admin-care__line"
                  aria-pressed={chosen}
                  onClick={() =>
                    setPayments(
                      chosen
                        ? payments.filter((item) => item !== method)
                        : [...payments, method],
                    )
                  }
                >
                  {method}
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Retours</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="retours-delai">
              Délai de retour (jours)
            </label>
            <input
              id="retours-delai"
              className="admin-field__input"
              defaultValue="30"
            />
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="retours-texte">
              Conditions affichées
            </label>
            <textarea
              id="retours-texte"
              rows={3}
              className="admin-field__input"
              placeholder="Retour offert sous 30 jours, article non porté et étiquette d'origine attachée."
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Barre d&apos;annonce</legend>
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="annonce">
            Message
          </label>
          <input
            id="annonce"
            className="admin-field__input"
            defaultValue="Livraison offerte dès 150 € d'achat · Retours sous 30 jours"
          />
          <p className="admin-field__hint">
            Bandeau noir en haut de toutes les pages. Vide, il ne s&apos;affiche
            pas.
          </p>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Newsletter</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-titre">
              Titre
            </label>
            <input
              id="news-titre"
              className="admin-field__input"
              defaultValue={NEWSLETTER.title}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-bouton">
              Libellé du bouton
            </label>
            <input
              id="news-bouton"
              className="admin-field__input"
              defaultValue={NEWSLETTER.buttonLabel}
            />
          </div>

          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="news-texte">
              Texte
            </label>
            <textarea
              id="news-texte"
              rows={2}
              className="admin-field__input"
              defaultValue={NEWSLETTER.text}
            />
            <p className="admin-field__hint">
              Annoncez la fréquence : c&apos;est ce que le visiteur veut savoir
              avant de laisser son adresse.
            </p>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-placeholder">
              Texte du champ
            </label>
            <input
              id="news-placeholder"
              className="admin-field__input"
              defaultValue={NEWSLETTER.placeholder}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-prestataire">
              Prestataire d&apos;envoi
            </label>
            <input
              id="news-prestataire"
              className="admin-field__input"
              placeholder="Brevo, Mailchimp, Resend…"
              defaultValue={NEWSLETTER.provider ?? ""}
            />
            <p className="admin-field__hint">
              Vide, le bouton du site reste inactif et le bandeau annonce que
              les inscriptions ne sont pas ouvertes.
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Réseaux sociaux</legend>
        <div className="admin-grid">
          {["Instagram", "Facebook", "TikTok", "Pinterest"].map((reseau) => (
            <div key={reseau} className="admin-field">
              <label
                className="admin-field__label"
                htmlFor={reseau.toLowerCase()}
              >
                {reseau} <span className="admin-badge">facultatif</span>
              </label>
              <input
                id={reseau.toLowerCase()}
                className="admin-field__input"
                placeholder={`https://${reseau.toLowerCase()}.com/droopys`}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled>
          Enregistrer les réglages
        </button>
        <p className="admin-form__note">
          L&apos;enregistrement sera actif une fois Supabase connecté.
        </p>
      </div>
    </form>
  );
}
