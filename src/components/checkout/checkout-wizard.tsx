"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContactStep } from "@/components/checkout/contact-step";
import { DeliveryStep, type SavedAddress } from "@/components/checkout/delivery-step";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentStep } from "@/components/checkout/payment-step";
import {
  EMPTY_DRAFT,
  parseStoredDraft,
  toDetails,
  validateContact,
  validateDelivery,
  type CheckoutDraft,
} from "@/lib/checkout/draft";
import type { ShippingOption } from "@/lib/shipping/services";
import type { CartLine } from "@/types/cart";

type Step = 1 | 2 | 3;

const STEPS: { id: Step; label: string }[] = [
  { id: 1, label: "Coordonnées" },
  { id: 2, label: "Livraison" },
  { id: 3, label: "Paiement" },
];

/** Brouillon gardé le temps de l'onglet : un rechargement ne vide rien. */
const STORAGE_KEY = "droopys_tunnel";

/**
 * Le tunnel : trois étapes sur une seule page, récapitulatif à droite.
 *
 * Tout l'état vit ici, dans le navigateur, jusqu'à l'étape 3 — rien n'est
 * écrit côté serveur avant que le client veuille payer. Le serveur revalide
 * tout à l'ouverture du paiement ; ce composant n'est qu'un confort de saisie.
 */
export function CheckoutWizard({
  lines,
  freeFromCents,
  optionsByCountry,
  sendcloudKey,
  shop,
  prefill,
  savedAddresses,
  publishableKey,
}: {
  lines: CartLine[];
  /** Franchise de port, `null` si aucune : la cliente paie le tarif réel. */
  freeFromCents: number | null;
  /** Tarifs Sendcloud par pays, pour le poids de ce panier. */
  optionsByCountry: Record<string, ShippingOption[] | null>;
  sendcloudKey: string | null;
  shop: { name: string; address: string[] };
  /** Coordonnées connues d'un client connecté. */
  prefill: CheckoutDraft["contact"] | null;
  savedAddresses: SavedAddress[];
  publishableKey: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<CheckoutDraft>(() => ({
    ...EMPTY_DRAFT,
    contact: prefill ?? EMPTY_DRAFT.contact,
  }));
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const headingRef = useRef<HTMLDivElement>(null);

  // Relecture après l'hydratation, jamais pendant : le serveur ne connaît pas
  // le `sessionStorage`, et lire avant ferait diverger les deux rendus.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseStoredDraft(stored);
        // Le compte prime pour l'identité : un brouillon d'un autre passage
        // ne doit pas écraser les coordonnées du client connecté.
        // Exception assumée à la règle : c'est précisément la synchronisation
        // avec un système externe (le stockage du navigateur), impossible
        // pendant le rendu sans casser l'hydratation.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDraft({ ...parsed, contact: prefill ?? parsed.contact });
      }
    } catch {
      // Stockage indisponible (navigation privée) : on saisit sans filet.
    }
  }, [prefill]);

  // Sauvegarde au fil de la saisie, et non dans un effet : en développement
  // React monte les effets deux fois, et un effet de sauvegarde écrivait le
  // brouillon vide par-dessus celui qu'on venait de relire.
  const updateDraft = (change: (current: CheckoutDraft) => CheckoutDraft) =>
    setDraft((current) => {
      const next = change(current);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Stockage indisponible : le tunnel marche, il ne survit simplement
        // pas au rechargement.
      }
      return next;
    });

  const itemsCents = lines.reduce(
    (total, line) => total + line.product.priceCents * line.quantity,
    0,
  );
  const freeShipping = freeFromCents !== null && itemsCents >= freeFromCents;

  const contactErrors = validateContact(draft);
  const deliveryErrors = validateDelivery(draft);
  const contactValid = Object.keys(contactErrors).length === 0;
  const deliveryValid = Object.keys(deliveryErrors).length === 0;

  // Clé stable des coordonnées validées : l'étape 3 ne rouvre une session de
  // paiement que si elles ont réellement changé.
  const detailsKey = JSON.stringify(toDetails(draft));
  const details = useMemo(() => toDetails(draft), [detailsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (next: Step) => {
    setStep(next);
    // Le focus suit l'étape : un lecteur d'écran entend le nouveau titre, et
    // l'écran revient en haut du formulaire au lieu de rester sur le bouton.
    requestAnimationFrame(() => {
      headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.querySelector("h2")?.focus();
    });
  };

  const touch = (key: string) =>
    setTouched((current) => new Set(current).add(key));

  // Port affiché au récapitulatif : indicatif, recalculé par le serveur à
  // l'ouverture du paiement. `null` tant qu'aucun service n'est choisi.
  const chosenOption =
    draft.method === "domicile"
      ? optionsByCountry[draft.address.country]?.find((option) => option.key === draft.service)
      : draft.method === "relais"
        ? optionsByCountry.FR?.find((option) => option.key === draft.service)
        : undefined;
  const shippingShown =
    draft.method === "retrait"
      ? 0
      : chosenOption
        ? freeShipping
          ? 0
          : chosenOption.priceCents
        : null;

  return (
    <div className="checkout">
      <div className="checkout__main" ref={headingRef}>
        <nav aria-label="Étapes de la commande">
          <ol className="checkout-steps">
            {STEPS.map((entry) => (
              <li key={entry.id}>
                {entry.id < step ? (
                  <button type="button" className="checkout-steps__item" onClick={() => goTo(entry.id)}>
                    <span className="checkout-steps__number" aria-hidden>✓</span>
                    {entry.label}
                  </button>
                ) : (
                  <span
                    className="checkout-steps__item"
                    aria-current={entry.id === step ? "step" : undefined}
                  >
                    <span className="checkout-steps__number" aria-hidden>{entry.id}</span>
                    {entry.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {step === 1 && (
          <>
            <ContactStep
              contact={draft.contact}
              errors={contactErrors}
              touched={touched}
              signedIn={prefill !== null}
              onChange={(field, value) =>
                updateDraft((current) => ({ ...current, contact: { ...current.contact, [field]: value } }))
              }
              onBlur={(field) => touch(`contact.${field}`)}
            />
            <div className="checkout-actions">
              <Link href="/panier" className="account-button-outline checkout-back">
                <span aria-hidden>←</span> Retour au panier
              </Link>
              <button
                type="button"
                className="link-cta-block mt-0"
                disabled={!contactValid}
                onClick={() => goTo(2)}
              >
                Continuer vers la livraison
              </button>
              {!contactValid && (
                <span className="account-card__muted">Remplissez les champs pour continuer.</span>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DeliveryStep
              draft={draft}
              errors={deliveryErrors}
              touched={touched}
              optionsByCountry={optionsByCountry}
              freeShipping={freeShipping}
              shop={shop}
              savedAddresses={savedAddresses}
              sendcloudKey={sendcloudKey}
              onChoose={({ method, service }) => updateDraft((current) => ({ ...current, method, service }))}
              onAddress={(field, value) =>
                updateDraft((current) => ({ ...current, address: { ...current.address, [field]: value } }))
              }
              onUseSaved={(address) =>
                updateDraft((current) => ({
                  ...current,
                  address: {
                    line1: address.line1,
                    line2: address.line2,
                    postalCode: address.postalCode,
                    city: address.city,
                    country: address.country,
                  },
                }))
              }
              onServicePoint={(point) => updateDraft((current) => ({ ...current, servicePoint: point }))}
              onBlur={(field) => touch(`address.${field}`)}
            />
            <div className="checkout-actions">
              <button type="button" className="account-button-outline checkout-back" onClick={() => goTo(1)}>
                <span aria-hidden>←</span> Retour
              </button>
              <button
                type="button"
                className="link-cta-block mt-0"
                disabled={!deliveryValid}
                onClick={() => goTo(3)}
              >
                Continuer vers le paiement
              </button>
            </div>
          </>
        )}

        {step === 3 && details && (
          <PaymentStep
            key={detailsKey}
            details={details}
            publishableKey={publishableKey}
            shopName={shop.name}
            servicePointLabel={draft.servicePoint?.label ?? ""}
            serviceLabel={chosenOption?.label ?? ""}
            onEdit={goTo}
          />
        )}
        {step === 3 && (
          <div className="checkout-actions">
            <button type="button" className="account-button-outline checkout-back" onClick={() => goTo(2)}>
              <span aria-hidden>←</span> Retour à la livraison
            </button>
          </div>
        )}
      </div>

      <OrderSummary lines={lines} shippingCents={shippingShown} />
    </div>
  );
}
