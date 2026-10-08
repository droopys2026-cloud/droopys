"use client";

import { useActionState } from "react";
import { updatePassword, type AuthFormState } from "@/app/compte/actions";
import { FormAlert } from "@/components/account/form-alert";

/**
 * Nouveau mot de passe. Sert au lien de réinitialisation comme au profil ;
 * `suite` dit où revenir après l'enregistrement.
 */
export function NewPasswordForm({ suite }: { suite?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    updatePassword,
    { status: "idle" },
  );

  return (
    <form action={action} className="content-form">
      {suite && <input type="hidden" name="suite" value={suite} />}
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="nouveau-mot-de-passe">
            Nouveau mot de passe
          </label>
          <input
            id="nouveau-mot-de-passe"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className="content-field__input"
          />
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="nouveau-mot-de-passe-bis">
            Confirmer
          </label>
          <input
            id="nouveau-mot-de-passe-bis"
            name="confirmation"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            className="content-field__input"
          />
        </div>
      </div>

      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer le mot de passe"}
      </button>
    </form>
  );
}
