"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentSession, type PaymentSessionResult } from "@/app/actions/checkout";
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

/**
 * Une session préparée reste servie une demi-heure : au-delà, on en rouvre une
 * neuve plutôt que de risquer de tendre à la cliente une session que Stripe
 * aurait entre-temps expirée.
 */
const PREPARED_SESSION_MS = 30 * 60 * 1000;

/** Attente après la dernière frappe avant de préparer le paiement. */
const PREPARE_DELAY_MS = 600;

/** Session de paiement ouverte d'avance, pour des coordonnées précises. */
type PreparedPayment = {
  detailsKey: string;
  startedAt: number;
  session: Promise<PaymentSessionResult>;
};

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
  const [prepared, setPrepared] = useState<PreparedPayment | null>(null);
  // Stripe.js se télécharge dès l'arrivée dans le tunnel, pendant que la
  // cliente remplit ses coordonnées, et non au moment où elle veut payer.
  // Une seule fois par clé : Stripe.js refuse d'être rechargé.
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

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
    (total, line) => total + line.unitPriceCents * line.quantity,
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

  /**
   * Ouvre la session de paiement pour ces coordonnées, sauf si une session
   * encore fraîche existe déjà pour elles. Le serveur revalide tout : préparer
   * d'avance ne fait que gagner l'aller-retour vers Stripe.
   */
  const preparePayment = (key: string, validDetails: NonNullable<typeof details>) => {
    if (prepared?.detailsKey === key && Date.now() - prepared.startedAt < PREPARED_SESSION_MS) {
      return;
    }
    const session: Promise<PaymentSessionResult> = createPaymentSession(validDetails).catch(
      (error: unknown) => {
        console.error("Session de paiement non ouverte :", error);
        // Panne réseau, pas refus du serveur : on oublie cette tentative pour
        // que le prochain passage à l'étape 3 en relance une.
        setPrepared((current) => (current?.session === session ? null : current));
        return {
          status: "error",
          errors: ["Le paiement est indisponible pour le moment. Réessayez dans un instant."],
        };
      },
    );
    setPrepared({ detailsKey: key, startedAt: Date.now(), session });
  };

  // Pendant l'étape Livraison, dès que tout est valide, le paiement se prépare
  // en arrière-plan : en cliquant sur « Continuer », la cliente trouve le
  // formulaire de carte déjà affiché. Le délai évite d'ouvrir une session à
  // chaque lettre de l'adresse ; une session jamais payée expire seule chez
  // Stripe, sans frais.
  useEffect(() => {
    if (step !== 2 || !details) return;
    const timer = setTimeout(() => preparePayment(detailsKey, details), PREPARE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, detailsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (next: Step) => {
    // Clic avant la fin du délai, ou session trop ancienne : on la lance ici.
    if (next === 3 && details) preparePayment(detailsKey, details);
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

        {/* Monté dès l'étape Livraison, mais caché : le formulaire de carte de
            Stripe s'initialise pendant que la cliente choisit sa livraison, et
            « Continuer » n'a plus qu'à le révéler. `hidden` le retire aussi de
            l'arbre d'accessibilité tant qu'il n'est pas à l'écran. */}
        {step >= 2 && details && prepared?.detailsKey === detailsKey && (
          <div hidden={step !== 3}>
            <PaymentStep
              key={detailsKey}
              details={details}
              session={prepared.session}
              stripePromise={stripePromise}
              shopName={shop.name}
              servicePointLabel={draft.servicePoint?.label ?? ""}
              serviceLabel={chosenOption?.label ?? ""}
              onEdit={goTo}
            />
          </div>
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
