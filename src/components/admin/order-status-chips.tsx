"use client";

import { useState } from "react";
import { changeOrderStatus } from "@/app/admin/(back-office)/commandes/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

/**
 * Pastilles d'état d'une commande.
 *
 * « Expédiée » envoie un e-mail à l'acheteur (voir `changeOrderStatus`) : un
 * geste qui part chez quelqu'un d'autre ne se fait pas sur un simple clic,
 * la boutique confirme d'abord en voyant à qui il part. Les autres états
 * restent en un clic, ils ne préviennent personne.
 */
export function OrderStatusChips({
  orderId,
  status,
  shippingNoticeTo,
}: {
  orderId: string;
  status: OrderStatus;
  /** Adresse qui recevra l'avis si on passe en « Expédiée », `null` si aucun avis ne part. */
  shippingNoticeTo: string | null;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <div className="admin-filter__chips">
        {ORDER_STATUSES.map((entry) =>
          entry.id === "expediee" && shippingNoticeTo ? (
            <button
              key={entry.id}
              type="button"
              className="admin-chip"
              aria-pressed={status === entry.id}
              onClick={() => setConfirming(true)}
            >
              {entry.label}
            </button>
          ) : (
            <form key={entry.id} action={changeOrderStatus}>
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="status" value={entry.id} />
              <button
                type="submit"
                className="admin-chip"
                aria-pressed={status === entry.id}
              >
                {entry.label}
              </button>
            </form>
          ),
        )}
      </div>

      {confirming && shippingNoticeTo && (
        <div className="admin-modal" onClick={() => setConfirming(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expedition-titre"
            className="admin-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal__head">
              <h2 id="expedition-titre" className="admin-modal__title">
                Marquer la commande comme expédiée ?
              </h2>
              <button
                type="button"
                className="admin-thumb__icon"
                aria-label="Fermer"
                onClick={() => setConfirming(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal__body">
              <p className="m-0">
                Un e-mail « Votre commande est expédiée » va être envoyé
                automatiquement à <strong>{shippingNoticeTo}</strong>, avec le
                numéro de suivi s&apos;il y en a un.
              </p>
            </div>

            {/* La fenêtre se ferme une fois l'état enregistré, pas avant :
                la fermer au clic démonterait le formulaire en plein envoi. */}
            <form
              action={async (formData) => {
                await changeOrderStatus(formData);
                setConfirming(false);
              }}
              className="admin-modal__foot"
            >
              <input type="hidden" name="orderId" value={orderId} />
              <input type="hidden" name="status" value="expediee" />
              <button type="submit" className="admin-button">
                Expédier et envoyer l&apos;e-mail
              </button>
              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={() => setConfirming(false)}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
