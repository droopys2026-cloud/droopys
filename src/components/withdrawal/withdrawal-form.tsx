"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  confirmWithdrawal,
  findOrderForWithdrawal,
  type WithdrawalState,
} from "@/app/retractation/actions";
import { FormAlert } from "@/components/account/form-alert";

/**
 * Formulaire de rétractation en deux temps : désigner la commande, puis
 * confirmer. Le second bouton porte le libellé que demande la directive,
 * « Confirmer la rétractation », et ne fait rien d'autre.
 */
export function WithdrawalForm({
  prefill,
}: {
  prefill: { name: string; email: string; reference: string };
}) {
  const [state, action, pending] = useActionState<WithdrawalState, FormData>(
    (previous, formData) =>
      formData.get("etape") === "confirmer"
        ? confirmWithdrawal(previous, formData)
        : findOrderForWithdrawal(previous, formData),
    { status: "idle" },
  );

  if (state.status === "done") {
    return (
      <div role="status" className="content-form">
        <h2 className="account-subtitle">Votre rétractation est enregistrée</h2>
        <p className="text-paragraph m-0">
          Reçue le <strong>{state.receivedAt}</strong> pour la commande{" "}
          <strong>{state.reference}</strong>. Un accusé de réception vient de
          partir par e-mail.
        </p>
        <ul className="content-list">
          {state.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-paragraph m-0">
          Renvoyez ces articles dans les 14 jours, non portés et avec leur
          étiquette —{" "}
          <Link href="/aide/retours" className="link-underline-sm">
            la marche à suivre
          </Link>
          .
        </p>
      </div>
    );
  }

  if (state.status === "found") {
    return <ConfirmStep state={state} action={action} pending={pending} />;
  }

  const values = state.status === "error" ? state.values : prefill;
  return (
    <form action={action} className="content-form">
      <FormAlert errors={state.status === "error" ? state.errors : []} />
      <div className="content-form__grid">
        <Field id="retractation-nom" name="name" label="Nom et prénom" autoComplete="name" defaultValue={values.name} />
        <Field id="retractation-email" name="email" label="Adresse e-mail de la commande" type="email" autoComplete="email" defaultValue={values.email} />
        <Field
          id="retractation-commande"
          name="reference"
          label="Numéro de commande"
          autoComplete="off"
          defaultValue={values.reference}
          hint="Il figure dans l'e-mail de confirmation, sous la forme DR-2026-0001."
        />
      </div>
      <button type="submit" className="link-cta-block mt-0 self-start" disabled={pending}>
        {pending ? "Recherche…" : "Continuer"}
      </button>
    </form>
  );
}

function ConfirmStep({
  state,
  action,
  pending,
}: {
  state: Extract<WithdrawalState, { status: "found" }>;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const [checked, setChecked] = useState(() => new Set(state.lines.map((line) => line.id)));

  return (
    <form action={action} className="content-form">
      <input type="hidden" name="etape" value="confirmer" />
      <input type="hidden" name="name" value={state.name} />
      <input type="hidden" name="email" value={state.email} />
      <input type="hidden" name="reference" value={state.reference} />

      {state.error && <FormAlert errors={[state.error]} />}
      {state.alreadyRequested && (
        <p className="account-notice m-0">
          Une rétractation a déjà été enregistrée pour cette commande. Vous
          pouvez en ajouter une pour d&apos;autres articles.
        </p>
      )}

      <fieldset className="flex flex-col gap-5">
        <legend className="account-subtitle mb-5">
          Commande {state.reference} — articles concernés
        </legend>
        {state.lines.map((line) => (
          <label key={line.id} className="account-checkbox">
            <input
              type="checkbox"
              name="lines"
              value={line.id}
              checked={checked.has(line.id)}
              onChange={(event) =>
                setChecked((current) => {
                  const next = new Set(current);
                  if (event.target.checked) next.add(line.id);
                  else next.delete(line.id);
                  return next;
                })
              }
            />
            {line.label}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        className="link-cta-block mt-0 self-start"
        disabled={pending || checked.size === 0}
      >
        {pending ? "Enregistrement…" : "Confirmer la rétractation"}
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  defaultValue,
  autoComplete,
  type = "text",
  hint,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  autoComplete: string;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="content-field content-field--full">
      <label className="content-field__label" htmlFor={id}>
        {label}
      </label>
      <input id={id} name={name} type={type} required autoComplete={autoComplete} defaultValue={defaultValue} className="content-field__input" />
      {hint && <span className="content-field__hint">{hint}</span>}
    </div>
  );
}
