"use client";

import { useActionState } from "react";
import { signUpCustomer, type AuthFormState } from "@/app/compte/actions";
import { FormAlert } from "@/components/account/form-alert";

export function SignUpForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signUpCustomer,
    { status: "idle" },
  );

  // Même écran qu'une adresse soit nouvelle ou déjà inscrite : le dire
  // révélerait qui est client.
  if (state.status === "sent") {
    return (
      <div role="status" className="account-notice">
        <p className="m-0">
          Vérifiez votre boîte mail : un lien de confirmation vient de partir.
          Cliquez dessus pour activer votre compte. Pensez à regarder dans les
          indésirables.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="content-form">
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="inscription-prenom">
            Prénom
          </label>
          <input
            id="inscription-prenom"
            defaultValue={state.status === "error" ? state.values?.firstName : undefined}
            name="firstName"
            required
            maxLength={80}
            autoComplete="given-name"
            className="content-field__input"
          />
        </div>

        <div className="content-field">
          <label className="content-field__label" htmlFor="inscription-nom">
            Nom
          </label>
          <input
            id="inscription-nom"
            defaultValue={state.status === "error" ? state.values?.lastName : undefined}
            name="lastName"
            required
            maxLength={80}
            autoComplete="family-name"
            className="content-field__input"
          />
        </div>

        <div className="content-field content-field--full">
          <label className="content-field__label" htmlFor="inscription-email">
            Adresse e-mail
          </label>
          <input
            id="inscription-email"
            defaultValue={state.status === "error" ? state.values?.email : undefined}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="content-field__input"
          />
        </div>

        <div className="content-field content-field--full">
          <label className="content-field__label" htmlFor="inscription-mot-de-passe">
            Mot de passe
          </label>
          <input
            id="inscription-mot-de-passe"
            name="password"
            type="password"
            required
            minLength={8}
            maxLength={72}
            autoComplete="new-password"
            aria-describedby="inscription-mot-de-passe-aide"
            className="content-field__input"
          />
          <span id="inscription-mot-de-passe-aide" className="content-field__hint">
            8 caractères minimum.
          </span>
        </div>
      </div>

      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}
