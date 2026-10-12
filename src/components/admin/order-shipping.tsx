"use client";

import { useActionState } from "react";
import {
  createShippingLabel,
  type LabelState,
} from "@/app/admin/(back-office)/commandes/actions";

/**
 * Expédition d'une commande : l'étiquette Sendcloud se crée et s'imprime
 * d'ici, sans ouvrir Sendcloud. Le numéro de suivi remonte tout seul, la
 * commande passe en « expédiée » et la cliente reçoit le lien de suivi.
 */
export function OrderShipping({
  orderId,
  deliveryMethod,
  serviceLabel,
  label,
  testMode,
  homeServices,
}: {
  orderId: string;
  deliveryMethod: "domicile" | "relais" | "retrait";
  serviceLabel: string;
  /** L'étiquette déjà créée, s'il y en a une. */
  label: {
    trackingNumber: string | null;
    trackingUrl: string | null;
    isTest: boolean;
  } | null;
  /** Les étiquettes créées maintenant seront des lettres de test gratuites. */
  testMode: boolean;
  /**
   * Services à domicile proposés quand la commande n'a pas de transporteur
   * (commande passée avant le choix au tunnel). Vide sinon.
   */
  homeServices: { key: string; label: string }[];
}) {
  const [state, action, pending] = useActionState<LabelState, FormData>(
    createShippingLabel,
    { status: "idle" },
  );

  if (deliveryMethod === "retrait") {
    return (
      <section className="admin-card">
        <h2 className="admin-card__title">Expédition</h2>
        <p className="admin-field__hint m-0">
          Retrait en boutique : pas d&apos;étiquette. Prévenez la cliente quand
          la commande est prête, puis passez-la en « Livrée » au retrait.
        </p>
      </section>
    );
  }

  if (label) {
    return (
      <section className="admin-card">
        <h2 className="admin-card__title">Expédition</h2>
        {label.isTest && (
          <p className="admin-form__error m-0">
            Étiquette de TEST (lettre non affranchie) : ne pas déposer ce colis.
          </p>
        )}
        <p className="m-0">{serviceLabel}</p>
        {label.trackingNumber && (
          <p className="admin-field__hint m-0">
            Suivi :{" "}
            {label.trackingUrl ? (
              <a href={label.trackingUrl} target="_blank" rel="noreferrer noopener" className="admin-row__link">
                {label.trackingNumber}
              </a>
            ) : (
              label.trackingNumber
            )}
          </p>
        )}
        {/* L'étiquette s'affiche dans la fiche : on vérifie d'un coup d'œil
            le destinataire et le transporteur avant d'imprimer. Format A4,
            d'où le rapport 210/297 qui évite un cadre vide ou rogné. */}
        <iframe
          src={`/admin/commandes/${orderId}/etiquette`}
          title="Aperçu de l'étiquette"
          className="aspect-[210/297] w-full max-w-md border"
        />
        <a
          href={`/admin/commandes/${orderId}/etiquette`}
          target="_blank"
          rel="noopener"
          className="admin-button self-start"
        >
          Imprimer l&apos;étiquette
        </a>
        <p className="admin-field__hint m-0">
          Collez-la sur le colis et déposez-le chez le transporteur.
        </p>
      </section>
    );
  }

  return (
    <form action={action} className="admin-card">
      <h2 className="admin-card__title">Expédition</h2>
      <input type="hidden" name="orderId" value={orderId} />
      {homeServices.length > 0 ? (
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="transporteur">
            Transporteur
          </label>
          <select id="transporteur" name="service" required className="admin-field__input" defaultValue="">
            <option value="" disabled>
              Choisir…
            </option>
            {homeServices.map((service) => (
              <option key={service.key} value={service.key}>
                {service.label}
              </option>
            ))}
          </select>
          <p className="admin-field__hint">
            Cette commande date d&apos;avant le choix du transporteur au paiement.
          </p>
        </div>
      ) : (
        <p className="m-0">{serviceLabel}</p>
      )}

      {state.status === "error" && (
        <p role="alert" className="admin-form__error m-0">
          {state.message}
        </p>
      )}

      {testMode && (
        <p className="admin-field__hint m-0">
          Mode test : l&apos;étiquette sera une lettre non affranchie, gratuite
          et sans transporteur. Aucun e-mail n&apos;est envoyé à la cliente.
        </p>
      )}

      <button type="submit" className="admin-button self-start" disabled={pending}>
        {pending ? "Création de l'étiquette…" : "Créer l'étiquette"}
      </button>
    </form>
  );
}
