"use client";

import { useActionState } from "react";
import {
  updateEmail,
  updateProfile,
  type ProfileFormState,
} from "@/app/compte/(espace)/profil/actions";
import { FormAlert } from "@/components/account/form-alert";

function Feedback({ state }: { state: ProfileFormState }) {
  if (state.status === "error") return <FormAlert errors={state.errors} />;
  if (state.status === "saved") {
    return (
      <p role="status" className="account-notice m-0">
        {state.message}
      </p>
    );
  }
  return null;
}

export function ProfileForm({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    { status: "idle" },
  );

  return (
    <form action={action} className="content-form">
      <Feedback state={state} />
      <div className="content-form__grid">
        <div className="content-field">
          <label className="content-field__label" htmlFor="profil-prenom">
            Prénom
          </label>
          <input id="profil-prenom" name="firstName" required maxLength={80} autoComplete="given-name" defaultValue={state.status === "error" ? state.values.firstName : firstName} className="content-field__input" />
        </div>
        <div className="content-field">
          <label className="content-field__label" htmlFor="profil-nom">
            Nom
          </label>
          <input id="profil-nom" name="lastName" required maxLength={80} autoComplete="family-name" defaultValue={state.status === "error" ? state.values.lastName : lastName} className="content-field__input" />
        </div>
      </div>
      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

export function EmailForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateEmail,
    { status: "idle" },
  );

  return (
    <form action={action} className="content-form">
      <Feedback state={state} />
      <div className="content-field">
        <label className="content-field__label" htmlFor="profil-email">
          Adresse e-mail
        </label>
        <input id="profil-email" name="email" type="email" required autoComplete="email" defaultValue={state.status === "error" ? state.values.email : email} className="content-field__input" />
        <span className="content-field__hint">
          La nouvelle adresse devra être confirmée par un lien avant d&apos;être utilisée.
        </span>
      </div>
      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Envoi…" : "Changer d'adresse"}
      </button>
    </form>
  );
}
