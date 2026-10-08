"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/connexion/actions";

/**
 * Formulaire de connexion.
 *
 * L'erreur est annoncée dans une région `alert` placée **avant** les champs :
 * un message glissé sous le bouton n'est lu ni par un lecteur d'écran qui
 * vient de remonter en haut du formulaire, ni par un œil pressé.
 */
export function LoginForm({ suite }: { suite?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={action} className="admin-form">
      {suite && <input type="hidden" name="suite" value={suite} />}

      {state.error && (
        <p role="alert" className="admin-form__error">
          {state.error}
        </p>
      )}

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="email">
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="admin-field__input"
        />
      </div>

      <div className="admin-field">
        <label className="admin-field__label" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="admin-field__input"
        />
      </div>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </div>
    </form>
  );
}
