"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";
import { createPaymentSession } from "@/app/actions/checkout";
import { FormAlert } from "@/components/account/form-alert";
import type { CheckoutDetails } from "@/lib/checkout/details";
import { addressLines } from "@/lib/checkout/details";
import { formatPrice } from "@/lib/format";

type Session =
  | { status: "loading" }
  | { status: "ready"; clientSecret: string; totalCents: number }
  | { status: "error"; errors: string[] };

/**
 * Étape 3 : rappel de la commande, formulaire de paiement Stripe, case CGV.
 *
 * La session de paiement est ouverte **en arrivant ici**, avec les
 * coordonnées validées : le serveur relit le panier et calcule le total.
 * Revenir modifier une étape puis revenir rouvre une session neuve (le
 * composant est remonté avec une autre clé), pour que le montant suive.
 */
export function PaymentStep({
  details,
  publishableKey,
  shopName,
  servicePointLabel,
  serviceLabel,
  onEdit,
}: {
  details: CheckoutDetails;
  publishableKey: string;
  shopName: string;
  /** Libellé du point relais choisi, pour le rappel. */
  servicePointLabel: string;
  /** « Colissimo à domicile »… vide pour un retrait. */
  serviceLabel: string;
  onEdit: (step: 1 | 2) => void;
}) {
  const [session, setSession] = useState<Session>({ status: "loading" });
  // `loadStripe` une seule fois par clé : Stripe.js refuse d'être rechargé.
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  useEffect(() => {
    let cancelled = false;
    createPaymentSession(details)
      .then((result) => {
        if (!cancelled) setSession(result);
      })
      .catch((error: unknown) => {
        console.error("Session de paiement non ouverte :", error);
        if (!cancelled) {
          setSession({
            status: "error",
            errors: ["Le paiement est indisponible pour le moment. Réessayez dans un instant."],
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [details]);

  const { contact, delivery } = details;

  return (
    <div className="checkout-step">
      <h2 className="account-title" tabIndex={-1}>Paiement</h2>

      <div className="checkout-recap">
        <div className="account-card">
          <span className="account-card__title">Coordonnées</span>
          <span>
            {contact.firstName} {contact.lastName}
            <span className="account-card__muted block">{contact.email}</span>
            <span className="account-card__muted block">{contact.phone}</span>
          </span>
          <button type="button" className="account-card__cta self-start" onClick={() => onEdit(1)}>
            Modifier
          </button>
        </div>
        <div className="account-card">
          <span className="account-card__title">
            {delivery.method === "retrait" ? "Retrait en boutique" : serviceLabel}
          </span>
          <span className="account-card__muted">
            {delivery.method === "retrait"
              ? shopName
              : delivery.method === "relais"
                ? servicePointLabel
                : addressLines(delivery.address).join(", ")}
          </span>
          <button type="button" className="account-card__cta self-start" onClick={() => onEdit(2)}>
            Modifier
          </button>
        </div>
      </div>

      {session.status === "loading" && (
        <p role="status" className="text-paragraph m-0">
          Ouverture du paiement sécurisé…
        </p>
      )}
      {session.status === "error" && <FormAlert errors={session.errors} />}
      {session.status === "ready" && (
        <CheckoutElementsProvider
          stripe={stripePromise}
          options={{
            clientSecret: session.clientSecret,
            elementsOptions: { appearance: siteAppearance() },
          }}
        >
          <PaymentForm totalCents={session.totalCents} />
        </CheckoutElementsProvider>
      )}
    </div>
  );
}

function PaymentForm({ totalCents }: { totalCents: number }) {
  const checkoutState = useCheckoutElements();
  const [accepted, setAccepted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (checkoutState.type === "loading") {
    return (
      <p role="status" className="text-paragraph m-0">
        Chargement du formulaire de paiement…
      </p>
    );
  }
  if (checkoutState.type === "error") {
    return <FormAlert errors={[checkoutState.error.message]} />;
  }

  const { checkout } = checkoutState;

  async function pay() {
    setPaying(true);
    setError(null);
    // En cas de succès, Stripe redirige vers `return_url` (page de
    // remerciement) : on ne revient ici qu'en cas d'échec.
    const result = await checkout.confirm();
    if (result.type === "error") {
      setError(result.error.message);
      setPaying(false);
    }
  }

  return (
    <div className="content-form">
      {error && <FormAlert errors={[error]} />}
      <PaymentElement options={{ layout: "accordion" }} />

      <label className="account-checkbox">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        <span>
          J&apos;accepte les{" "}
          <Link href="/legal/cgv" target="_blank" className="link-underline-sm">
            conditions générales de vente
          </Link>
          .
        </span>
      </label>

      <button
        type="button"
        className="link-cta-block checkout-pay"
        disabled={!accepted || paying}
        onClick={pay}
      >
        {paying ? "Paiement en cours…" : `Payer ${formatPrice(totalCents)}`}
      </button>
      <p className="checkout-secure m-0">
        Paiement chiffré, traité par Stripe. Droopy&apos;s ne voit jamais votre
        numéro de carte.
      </p>
    </div>
  );
}

/**
 * Habillage du formulaire Stripe aux couleurs du site. Le formulaire vit dans
 * une iframe qui ne voit pas nos variables CSS : on les lit ici, sur la page,
 * plutôt que de recopier les couleurs en dur.
 */
function siteAppearance(): Appearance {
  const style = getComputedStyle(document.documentElement);
  const token = (name: string) => style.getPropertyValue(name).trim();
  return {
    theme: "flat",
    variables: {
      fontFamily: "Poppins, system-ui, sans-serif",
      colorPrimary: token("--color-ink"),
      colorText: token("--color-ink"),
      colorTextSecondary: token("--color-ink-secondary"),
      colorBackground: token("--color-surface"),
      colorDanger: token("--color-alert"),
      borderRadius: "0px",
    },
    rules: {
      ".Input": { border: `1px solid ${token("--color-border-input")}` },
      ".Input:focus": { border: `1px solid ${token("--color-ink")}`, boxShadow: "none" },
    },
  };
}
