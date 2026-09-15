"use client";

import { useState } from "react";

/**
 * Expédition d'une commande.
 *
 * Tant qu'aucun transporteur n'est branché, le numéro de suivi se colle à la
 * main depuis laposte.fr : c'est exactement ce que fera la boutique au
 * démarrage, et le champ ne changera pas quand l'étiquette sera automatique —
 * seule sa façon d'être rempli changera.
 */
export function OrderShipping({ reference }: { reference: string }) {
  const [tracking, setTracking] = useState("");

  return (
    <section className="admin-card">
      <h2 className="admin-card__title">Expédition</h2>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="suivi">
          Numéro de suivi Colissimo
        </label>
        <input
          id="suivi"
          className="admin-field__input"
          placeholder="6A 12345 6789 1"
          value={tracking}
          onChange={(event) => setTracking(event.target.value)}
        />
        <p className="admin-field__hint">
          Collez le numéro donné par La Poste. Le client le recevra par e-mail
          avec le lien de suivi.
        </p>
      </div>

      <button type="button" className="admin-button" disabled={!tracking}>
        Marquer {reference} comme expédiée
      </button>
    </section>
  );
}
