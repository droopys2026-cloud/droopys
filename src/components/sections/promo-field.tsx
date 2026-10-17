"use client";

import { useActionState } from "react";
import {
  applyPromoCode,
  removePromoCode,
  type PromoActionState,
} from "@/app/actions/promo";
import { formatPrice } from "@/lib/format";
import type { CartPromo } from "@/lib/queries/promo";

/**
 * Champ « Code promo » du panier.
 *
 * Un code accepté s'affiche avec sa remise et un bouton pour le retirer ; un
 * code devenu invalide depuis (expiré, épuisé, panier modifié) dit pourquoi,
 * plutôt que de disparaître sans explication.
 */
export function PromoField({ promo }: { promo: CartPromo | null }) {
  const [state, action, pending] = useActionState<PromoActionState, FormData>(
    applyPromoCode,
    {},
  );

  if (promo) {
    return (
      <div className="promo-field">
        <p className="promo-field__applied m-0">
          <span>
            Code <strong>{promo.code}</strong>
          </span>
          {promo.ok && <span className="text-strong">−{formatPrice(promo.discountCents)}</span>}
        </p>
        {!promo.ok && (
          <p role="alert" className="size-picker__warning m-0">
            {promo.message}
          </p>
        )}
        <form action={removePromoCode}>
          <button type="submit" className="link-underline-sm">
            Retirer le code
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={action} className="promo-field">
      <label className="content-field__label" htmlFor="code-promo">
        Code promo
      </label>
      <div className="promo-field__row">
        <input
          id="code-promo"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="content-field__input promo-field__input"
          placeholder="Ex. BLACK20"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "code-promo-erreur" : undefined}
        />
        <button type="submit" className="account-button-outline promo-field__apply" disabled={pending}>
          {pending ? "…" : "Appliquer"}
        </button>
      </div>
      {state.error && (
        <p id="code-promo-erreur" role="alert" className="size-picker__warning m-0">
          {state.error}
        </p>
      )}
    </form>
  );
}
