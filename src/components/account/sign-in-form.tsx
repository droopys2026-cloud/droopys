"use client";

import { useActionState } from "react";
import { signInCustomer, type AuthFormState } from "@/app/compte/actions";
import { FormAlert } from "@/components/account/form-alert";

export function SignInForm({ suite }: { suite?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signInCustomer,
    { status: "idle" },
  );

  return (
    <form action={action} className="content-form">
      {suite && <input type="hidden" name="suite" value={suite} />}
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-field">
        <label className="content-field__label" htmlFor="connexion-email">
          Adresse e-mail
        </label>
        <input
          id="connexion-email"
            defaultValue={state.status === "error" ? state.values?.email : undefined}
          name="email"
          type="email"
          required
          autoComplete="email"
          className="content-field__input"
        />
      </div>

      <div className="content-field">
        <label className="content-field__label" htmlFor="connexion-mot-de-passe">
          Mot de passe
        </label>
        <input
          id="connexion-mot-de-passe"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="content-field__input"
        />
      </div>

      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
