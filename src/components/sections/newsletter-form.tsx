"use client";

import { useActionState } from "react";
import {
  subscribe,
  type NewsletterState,
} from "@/app/actions/newsletter";

/**
 * Formulaire d'inscription.
 *
 * Il fonctionne même sans prestataire d'emailing : l'adresse est gardée en
 * base, et le message le dit franchement plutôt que de promettre un envoi qui
 * n'aura pas lieu.
 */
export function NewsletterForm({
  placeholder,
  buttonLabel,
  provider,
}: {
  placeholder: string;
  buttonLabel: string;
  provider: string | null;
}) {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    subscribe,
    {},
  );

  if (state.done) {
    return (
      <p role="status" className="text-paragraph m-0 max-w-md">
        {provider
          ? "C'est noté — vous recevrez la prochaine sélection Droopy's."
          : "C'est noté, votre adresse est enregistrée. Les envois commenceront dès le premier numéro."}
      </p>
    );
  }

  return (
    <form
      action={action}
      className="flex w-full max-w-md flex-col items-center gap-6 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse e-mail
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder={placeholder}
        className="input--newsletter flex-1"
        aria-describedby={state.error ? "newsletter-erreur" : undefined}
      />
      <button
        type="submit"
        className="button--cta-dark border px-9 py-4"
        disabled={pending}
      >
        {pending ? "Envoi…" : buttonLabel}
      </button>

      {state.error && (
        <p id="newsletter-erreur" role="alert" className="text-paragraph m-0">
          {state.error}
        </p>
      )}
    </form>
  );
}
