"use client";

import { useActionState } from "react";
import { requestPasswordReset, type AuthFormState } from "@/app/compte/actions";
import { FormAlert } from "@/components/account/form-alert";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    requestPasswordReset,
    { status: "idle" },
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="account-notice">
        <p className="m-0">
          Si un compte existe à cette adresse, un lien pour choisir un nouveau
          mot de passe vient de partir. Il est valable une heure.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="content-form">
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-field">
        <label className="content-field__label" htmlFor="oubli-email">
          Adresse e-mail du compte
        </label>
        <input
          id="oubli-email"
            defaultValue={state.status === "error" ? state.values?.email : undefined}
          name="email"
          type="email"
          required
          autoComplete="email"
          className="content-field__input"
        />
      </div>

      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Envoi…" : "Recevoir le lien"}
      </button>
    </form>
  );
}
