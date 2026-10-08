"use client";

import Image from "next/image";
import { AddressAutocomplete } from "@/components/checkout/address-autocomplete";
import { CheckoutField } from "@/components/checkout/checkout-field";
import {
  ServicePointMap,
  servicePointLabel,
} from "@/components/checkout/service-point-map";
import { COUNTRY_CODES, COUNTRY_LABELS } from "@/lib/account/schema";
import type { CheckoutDraft, FieldErrors } from "@/lib/checkout/draft";
import { formatPrice } from "@/lib/format";
import type { ShippingOption } from "@/lib/shipping/services";

type Address = CheckoutDraft["address"];

export type SavedAddress = Address & { id: string; label: string };

/**
 * Étape 2 : à domicile, en point relais, ou retrait en boutique.
 *
 * Les transporteurs et leurs prix viennent de Sendcloud (tarif réel, TVA
 * comprise) pour le poids du colis. Le prix à domicile dépend du pays de
 * l'adresse : il suit le choix de pays sans recharger la page.
 */
export function DeliveryStep({
  draft,
  errors,
  touched,
  optionsByCountry,
  freeShipping,
  shop,
  savedAddresses,
  sendcloudKey,
  onChoose,
  onAddress,
  onUseSaved,
  onServicePoint,
  onBlur,
}: {
  draft: CheckoutDraft;
  errors: FieldErrors;
  touched: Set<string>;
  /** `null` pour un pays : tarifs Sendcloud indisponibles. */
  optionsByCountry: Record<string, ShippingOption[] | null>;
  /** Franchise atteinte : tous les ports affichés deviennent « Offert ». */
  freeShipping: boolean;
  shop: { name: string; address: string[] };
  savedAddresses: SavedAddress[];
  /** Clé publique Sendcloud ; absente, le relais n'est pas proposé. */
  sendcloudKey: string | null;
  onChoose: (choice: {
    method: "domicile" | "relais" | "retrait";
    service: string;
  }) => void;
  onAddress: (field: keyof Address, value: string) => void;
  onUseSaved: (address: SavedAddress) => void;
  onServicePoint: (point: {
    id: number;
    label: string;
    carrier: string;
  }) => void;
  onBlur: (field: keyof Address) => void;
}) {
  const error = (field: keyof Address) =>
    touched.has(`address.${field}`) ? errors[`address.${field}`] : undefined;

  const homeOptions = (optionsByCountry[draft.address.country] ?? []).filter(
    (option) => option.kind === "domicile",
  );
  // Les points relais sont proposés en France, là où Sendcloud les couvre
  // pour les trois transporteurs.
  const relayOptions = sendcloudKey
    ? (optionsByCountry.FR ?? []).filter((option) => option.kind === "relais")
    : [];
  const unavailable = Object.values(optionsByCountry).every(
    (value) => value === null,
  );
  const price = (cents: number) =>
    freeShipping ? "Offert" : formatPrice(cents);
  const chosenRelay = relayOptions.find(
    (option) => option.key === draft.service,
  );

  const addressPanel = (
    <div className="content-form">
      {savedAddresses.length > 0 && (
        <div className="checkout-saved" aria-label="Mes adresses enregistrées">
          {savedAddresses.map((address) => (
            <button
              key={address.id}
              type="button"
              className="checkout-saved__chip"
              onClick={() => onUseSaved(address)}
            >
              {address.label}
            </button>
          ))}
        </div>
      )}

      <div className="content-form__grid">
        <AddressAutocomplete
          id="tunnel-adresse"
          value={draft.address.line1}
          country={draft.address.country}
          error={error("line1")}
          onChange={(value) => onAddress("line1", value)}
          onChoose={(address) => {
            onAddress("line1", address.line1);
            onAddress("postalCode", address.postalCode);
            onAddress("city", address.city);
          }}
          onBlur={() => onBlur("line1")}
        />
        <CheckoutField
          id="tunnel-complement"
          label="Complément (facultatif)"
          autoComplete="address-line2"
          value={draft.address.line2}
          onChange={(value) => onAddress("line2", value)}
          onBlur={() => onBlur("line2")}
          error={error("line2")}
          hint="Bâtiment, étage, code d'accès."
          full
        />
        <CheckoutField
          id="tunnel-cp"
          label="Code postal"
          autoComplete="postal-code"
          value={draft.address.postalCode}
          onChange={(value) => onAddress("postalCode", value)}
          onBlur={() => onBlur("postalCode")}
          error={error("postalCode")}
        />
        <CheckoutField
          id="tunnel-ville"
          label="Ville"
          autoComplete="address-level2"
          value={draft.address.city}
          onChange={(value) => onAddress("city", value)}
          onBlur={() => onBlur("city")}
          error={error("city")}
        />

        <div className="content-field">
          <label className="content-field__label" htmlFor="tunnel-pays">
            Pays
          </label>
          <select
            id="tunnel-pays"
            autoComplete="country"
            value={draft.address.country}
            onChange={(event) => onAddress("country", event.target.value)}
            className="content-field__input"
          >
            {COUNTRY_CODES.map((code) => (
              <option key={code} value={code}>
                {COUNTRY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const relayPanel =
    chosenRelay && sendcloudKey ? (
      <div className="content-form">
        {draft.servicePoint && !errors.servicePointId ? (
          <p role="status" className="m-0">
            <span className="account-card__title block">
              Votre point relais
            </span>
            {draft.servicePoint.label}
          </p>
        ) : (
          <p className="account-card__muted m-0">
            Cherchez une adresse ou un code postal sur la carte, puis cliquez
            sur « Choisir » sous le point où retirer votre colis.
          </p>
        )}
        <ServicePointMap
          apiKey={sendcloudKey}
          carrier={chosenRelay.carrier}
          postalCode={draft.address.postalCode}
          currentId={draft.servicePoint?.id}
          onSelect={(point) =>
            onServicePoint({
              id: point.id,
              label: servicePointLabel(point),
              carrier: point.carrier,
            })
          }
        />
      </div>
    ) : null;

  return (
    <div className="checkout-step">
      <h2 className="account-title" tabIndex={-1}>
        Livraison
      </h2>

      {unavailable && (
        <p role="status" className="account-notice m-0">
          Les tarifs des transporteurs sont momentanément indisponibles. Le
          retrait en boutique reste possible ; réessayez dans quelques minutes
          pour une livraison.
        </p>
      )}

      <fieldset className="checkout-options">
        <legend className="account-subtitle">À domicile</legend>
        {homeOptions.length === 0 && !unavailable && (
          <p className="account-card__muted m-0">
            Aucun transporteur ne livre ce colis vers{" "}
            {COUNTRY_LABELS[countryOf(draft.address.country)]}.
          </p>
        )}
        {homeOptions.map((option) => {
          const checked =
            draft.method === "domicile" && draft.service === option.key;
          return (
            <div key={option.key} className="checkout-choice">
              <ServiceOption
                option={option}
                price={price(option.priceCents)}
                checked={checked}
                onChoose={() =>
                  onChoose({ method: "domicile", service: option.key })
                }
              />
              {/* Le formulaire s'ouvre sous l'option cliquée, pas en bas de
                  la liste : la cliente le trouve là où elle regarde. */}
              {checked && addressPanel}
            </div>
          );
        })}
      </fieldset>

      {relayOptions.length > 0 && (
        <fieldset className="checkout-options">
          <legend className="account-subtitle">En point relais</legend>
          {relayOptions.map((option) => {
            const checked =
              draft.method === "relais" && draft.service === option.key;
            return (
              <div key={option.key} className="checkout-choice">
                <ServiceOption
                  option={option}
                  price={price(option.priceCents)}
                  checked={checked}
                  onChoose={() =>
                    onChoose({ method: "relais", service: option.key })
                  }
                />
                {checked && relayPanel}
              </div>
            );
          })}
        </fieldset>
      )}

      <fieldset className="checkout-options">
        <legend className="account-subtitle">En boutique</legend>
        <label className="checkout-option">
          <input
            type="radio"
            name="livraison"
            value="retrait"
            checked={draft.method === "retrait"}
            onChange={() => onChoose({ method: "retrait", service: "" })}
          />
          <span className="checkout-option__body">
            <span className="checkout-option__head">
              <span>Retrait en boutique</span>
              <span>Gratuit</span>
            </span>
            <span className="account-card__muted">
              {shop.name} — {shop.address.join(", ")}. Nous vous prévenons dès
              que votre commande est prête.
            </span>
          </span>
        </label>
      </fieldset>
    </div>
  );
}

function ServiceOption({
  option,
  price,
  checked,
  onChoose,
}: {
  option: ShippingOption;
  price: string;
  checked: boolean;
  onChoose: () => void;
}) {
  return (
    <label className="checkout-option">
      <input
        type="radio"
        name="livraison"
        value={option.key}
        checked={checked}
        onChange={onChoose}
      />
      {/* Logo décoratif : le nom du transporteur est déjà dans le libellé.
          `unoptimized` : un SVG n'a rien à gagner au redimensionnement. */}
      <Image
        src={`/logos/transporteurs/${option.carrier.replaceAll("_", "-")}.svg`}
        alt=""
        width={64}
        height={32}
        unoptimized
        className="checkout-option__logo"
      />
      <span className="checkout-option__body">
        <span className="checkout-option__head">
          <span>{option.label}</span>
          <span>{price}</span>
        </span>
        <span className="account-card__muted">{option.detail}</span>
      </span>
    </label>
  );
}

/** Le code pays du brouillon, ramené aux pays desservis pour le libellé. */
function countryOf(code: string) {
  return COUNTRY_CODES.find((entry) => entry === code) ?? "FR";
}
