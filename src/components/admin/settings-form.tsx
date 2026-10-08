"use client";

import { useActionState, useState } from "react";
import {
  saveSettings,
  type SettingsState,
} from "@/app/admin/(back-office)/reglages/actions";
import type { ShopSettings } from "@/lib/settings";

/**
 * Réglages de la boutique.
 *
 * Ce sont les valeurs répétées partout : le seuil de livraison offerte
 * apparaît dans la barre d'annonce, sur la fiche produit, dans le panier et
 * dans le pied de page. Les saisir une fois évite qu'ils finissent par se
 * contredire d'une page à l'autre.
 */
const PAYMENTS = [
  "Carte bancaire",
  "PayPal",
  "Apple Pay",
  "Google Pay",
  "Klarna — paiement en 3 fois",
  "Virement",
];

/** Centimes → « 150 » ou « 6,90 » : on n'écrit pas « 150,00 » dans un champ. */
function euros(cents: number | null): string {
  if (cents === null) return "";
  return cents % 100 === 0
    ? String(cents / 100)
    : (cents / 100).toFixed(2).replace(".", ",");
}

export function SettingsForm({ settings }: { settings: ShopSettings }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(
    saveSettings,
    {},
  );
  // Les moyens de paiement sont des cases à cocher déguisées en pastilles :
  // l'état est nécessaire pour l'apparence, la valeur part en champs cachés.
  const [methods, setMethods] = useState<string[]>(settings.paiement.methods);

  return (
    <form className="admin-form admin-form--wide" action={action}>
      {state.error && (
        <p role="alert" className="admin-form__error">
          {state.error}
        </p>
      )}
      {state.saved && (
        <p role="status" className="admin-form__saved">
          Réglages enregistrés. Le site les reprend immédiatement.
        </p>
      )}

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Boutique</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="nom-boutique">
              Nom
            </label>
            <input
              id="nom-boutique"
              name="shopName"
              className="admin-field__input"
              defaultValue={settings.boutique.name}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="email">
              E-mail de contact
            </label>
            <input
              id="email"
              name="shopEmail"
              type="email"
              className="admin-field__input"
              placeholder="contact@droopys.fr"
              defaultValue={settings.boutique.email}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="telephone">
              Téléphone
            </label>
            <input
              id="telephone"
              name="shopPhone"
              className="admin-field__input"
              placeholder="01 23 45 67 89"
              defaultValue={settings.boutique.phone}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="adresse">
              Adresse de la boutique
            </label>
            <textarea
              id="adresse"
              name="shopAddress"
              rows={3}
              className="admin-field__input"
              placeholder="12 rue de la Paix, 75002 Paris"
              defaultValue={settings.boutique.address}
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
              name="freeFrom"
              inputMode="decimal"
              className="admin-field__input"
              defaultValue={euros(settings.livraison.freeFromCents)}
            />
            <p className="admin-field__hint">
              Vide : pas de livraison offerte, la cliente paie le tarif réel
              du transporteur. Rempli : le port devient gratuit au-delà.
            </p>
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="poids-clothes">
              Vêtement (g)
            </label>
            <input
              id="poids-clothes"
              name="weight-clothes"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.livraison.weights.clothes}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="poids-baby">
              Pièce bébé (g)
            </label>
            <input
              id="poids-baby"
              name="weight-baby"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.livraison.weights.baby}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="poids-shoes">
              Chaussures (g)
            </label>
            <input
              id="poids-shoes"
              name="weight-shoes"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.livraison.weights.shoes}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="poids-coat">
              Manteau, doudoune (g)
            </label>
            <input
              id="poids-coat"
              name="weight-coat"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.livraison.weights.coat}
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="poids-accessory">
              Accessoire (g)
            </label>
            <input
              id="poids-accessory"
              name="weight-accessory"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.livraison.weights.accessory}
            />
          </div>
          <p className="admin-field__hint">
            Poids estimés d&apos;un article selon son rayon : ils servent à
            calculer le port, qui est le tarif réel du transporteur (Sendcloud,
            TVA comprise) pour le poids du colis. Le transporteur facture le
            poids réel à l&apos;expédition.
          </p>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="delai">
              Délai annoncé
            </label>
            <input
              id="delai"
              name="deliveryDelay"
              className="admin-field__input"
              placeholder="48 h en France métropolitaine"
              defaultValue={settings.livraison.delay}
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
            const chosen = methods.includes(method);
            return (
              <li key={method}>
                <button
                  type="button"
                  className="admin-chip admin-care__line"
                  aria-pressed={chosen}
                  onClick={() =>
                    setMethods(
                      chosen
                        ? methods.filter((item) => item !== method)
                        : [...methods, method],
                    )
                  }
                >
                  {method}
                </button>
              </li>
            );
          })}
        </ul>
        {methods.map((method) => (
          <input key={method} type="hidden" name="methods" value={method} />
        ))}
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
              name="returnDays"
              inputMode="numeric"
              className="admin-field__input"
              defaultValue={settings.retours.days}
            />
          </div>
          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="retours-texte">
              Conditions affichées
            </label>
            <textarea
              id="retours-texte"
              name="returnTerms"
              rows={3}
              className="admin-field__input"
              defaultValue={settings.retours.terms}
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
            name="announcement"
            className="admin-field__input"
            defaultValue={settings.annonce.message}
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
              name="newsletterTitle"
              className="admin-field__input"
              defaultValue={settings.newsletter.title}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-bouton">
              Libellé du bouton
            </label>
            <input
              id="news-bouton"
              name="newsletterButton"
              className="admin-field__input"
              defaultValue={settings.newsletter.buttonLabel}
            />
          </div>

          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="news-texte">
              Texte
            </label>
            <textarea
              id="news-texte"
              name="newsletterText"
              rows={2}
              className="admin-field__input"
              defaultValue={settings.newsletter.text}
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
              name="newsletterPlaceholder"
              className="admin-field__input"
              defaultValue={settings.newsletter.placeholder}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="news-prestataire">
              Prestataire d&apos;envoi
            </label>
            <input
              id="news-prestataire"
              name="newsletterProvider"
              className="admin-field__input"
              placeholder="Brevo, Mailchimp, Resend…"
              defaultValue={settings.newsletter.provider ?? ""}
            />
            <p className="admin-field__hint">
              Vide, les adresses sont simplement enregistrées en base et
              aucune campagne n&apos;est envoyée.
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Réseaux sociaux</legend>
        <div className="admin-grid">
          {(
            [
              ["instagram", "Instagram"],
              ["facebook", "Facebook"],
              ["tiktok", "TikTok"],
              ["pinterest", "Pinterest"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="admin-field">
              <label className="admin-field__label" htmlFor={key}>
                {label} <span className="admin-badge">facultatif</span>
              </label>
              <input
                id={key}
                name={key}
                className="admin-field__input"
                placeholder={`https://${key}.com/droopys`}
                defaultValue={settings.reseaux[key]}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer les réglages"}
        </button>
      </div>
    </form>
  );
}
