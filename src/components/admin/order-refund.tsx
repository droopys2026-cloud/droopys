"use client";

import { useActionState, useState } from "react";
import { refundOrder, type RefundState } from "@/app/admin/(back-office)/commandes/refund-actions";
import { formatPrice } from "@/lib/format";

/**
 * Bloc « Remboursement » de la fiche commande.
 *
 * Deux temps, comme pour tout geste qui déplace de l'argent : on saisit le
 * montant, puis on confirme en lisant ce qui va partir. Le montant proposé
 * est le reste à rembourser ; on le baisse pour ne rendre qu'un article.
 */
export function OrderRefund({
  orderId,
  paidCents,
  refundedCents,
  onlinePayment,
}: {
  orderId: string;
  paidCents: number;
  refundedCents: number;
  /** Faux pour une commande sans paiement Stripe : rien à rembourser ici. */
  onlinePayment: boolean;
}) {
  const [state, action, pending] = useActionState<RefundState, FormData>(refundOrder, { status: "idle" });
  const remainingCents = paidCents - refundedCents;
  const [amount, setAmount] = useState(euros(remainingCents));
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="admin-card">
      <h2 className="admin-card__title">Remboursement</h2>
      <p className="admin-field__hint">
        Payé : {formatPrice(paidCents)}
        {refundedCents > 0 && <> · Déjà remboursé : {formatPrice(refundedCents)}</>}
      </p>

      {state.status === "done" && (
        <p role="status" className="admin-refund__done">
          {formatPrice(state.amountCents)} remboursé{state.full ? " — commande entièrement remboursée" : ""}. La
          cliente est prévenue par e-mail.
        </p>
      )}
      {state.status === "error" && (
        <p role="alert" className="admin-form__error">
          {state.message}
        </p>
      )}

      {!onlinePayment ? (
        <p className="admin-field__hint">Commande payée hors du site : le remboursement se fait hors du site.</p>
      ) : remainingCents <= 0 ? (
        <p className="admin-field__hint">Commande entièrement remboursée.</p>
      ) : (
        <form action={action} className="admin-refund">
          <input type="hidden" name="orderId" value={orderId} />
          <label className="admin-field__label" htmlFor="montant-remboursement">
            Montant à rembourser (€)
          </label>
          <input
            id="montant-remboursement"
            name="amount"
            inputMode="decimal"
            className="admin-field__input"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setConfirming(false);
            }}
          />
          <p className="admin-field__hint">
            L&apos;argent revient sur le moyen de paiement de la cliente (carte, Klarna…). Le stock n&apos;est pas
            remis automatiquement.
          </p>
          {confirming ? (
            <div className="admin-refund__confirm">
              <span>Rembourser {amount} € à la cliente ?</span>
              <button type="submit" className="admin-button admin-button--small" disabled={pending}>
                {pending ? "Remboursement…" : "Confirmer le remboursement"}
              </button>
              <button
                type="button"
                className="admin-button admin-button--ghost admin-button--small"
                onClick={() => setConfirming(false)}
                disabled={pending}
              >
                Annuler
              </button>
            </div>
          ) : (
            <button type="button" className="admin-button admin-button--small" onClick={() => setConfirming(true)}>
              Rembourser
            </button>
          )}
        </form>
      )}
    </section>
  );
}

/** 8990 → « 89,90 », la forme attendue par le champ. */
function euros(cents: number): string {
  return (Math.max(cents, 0) / 100).toFixed(2).replace(".", ",");
}
