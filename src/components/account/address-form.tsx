"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  saveAddress,
  type AddressFormState,
} from "@/app/compte/(espace)/adresses/actions";
import { FormAlert } from "@/components/account/form-alert";
import { COUNTRY_CODES, COUNTRY_LABELS } from "@/lib/account/schema";

export type AddressFormValues = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
};

/**
 * Ajout ou modification d'une adresse. Les champs suivent l'ordre d'une
 * étiquette postale française, et portent les `autocomplete` qui laissent le
 * navigateur les remplir d'un geste.
 */
export function AddressForm({ address }: { address?: AddressFormValues }) {
  const [state, action, pending] = useActionState<AddressFormState, FormData>(
    saveAddress,
    { status: "idle" },
  );
  const prefix = address ? `adresse-${address.id}` : "adresse-nouvelle";
  // Après une erreur, on réaffiche ce qui avait été saisi, pas l'adresse
  // d'origine : React vient de réinitialiser le formulaire.
  const value = (name: keyof AddressFormValues) => {
    if (state.status === "error") return state.values[name];
    const stored = address?.[name];
    return typeof stored === "string" ? stored : undefined;
  };

  return (
    <form action={action} className="content-form">
      {address && <input type="hidden" name="addressId" value={address.id} />}
      <FormAlert errors={state.status === "error" ? state.errors : []} />

      <div className="content-form__grid">
        <Field id={`${prefix}-nom`} name="fullName" label="Nom du destinataire" autoComplete="name" defaultValue={value("fullName")} required full />
        <Field id={`${prefix}-ligne1`} name="line1" label="Adresse" autoComplete="address-line1" defaultValue={value("line1")} required full />
        <Field id={`${prefix}-ligne2`} name="line2" label="Complément (facultatif)" autoComplete="address-line2" defaultValue={value("line2")} full />
        <Field id={`${prefix}-cp`} name="postalCode" label="Code postal" autoComplete="postal-code" defaultValue={value("postalCode")} required />
        <Field id={`${prefix}-ville`} name="city" label="Ville" autoComplete="address-level2" defaultValue={value("city")} required />

        <div className="content-field">
          <label className="content-field__label" htmlFor={`${prefix}-pays`}>
            Pays
          </label>
          <select
            id={`${prefix}-pays`}
            name="country"
            autoComplete="country"
            defaultValue={value("country") ?? "FR"}
            className="content-field__input"
          >
            {COUNTRY_CODES.map((code) => (
              <option key={code} value={code}>
                {COUNTRY_LABELS[code]}
              </option>
            ))}
          </select>
        </div>

        <Field id={`${prefix}-tel`} name="phone" label="Téléphone (facultatif)" type="tel" autoComplete="tel" defaultValue={value("phone")} />
      </div>

      {address?.isDefault ? (
        <p className="content-field__hint m-0">
          C&apos;est votre adresse par défaut. Choisissez-en une autre pour la remplacer.
        </p>
      ) : (
        <label className="account-checkbox">
          <input type="checkbox" name="isDefault" />
          Utiliser comme adresse par défaut
        </label>
      )}

      <div className="flex flex-wrap items-center gap-9">
        <button type="submit" className="link-cta-block mt-0" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer l'adresse"}
        </button>
        {address && (
          <Link href="/compte/adresses" className="link-underline-sm">
            Annuler
          </Link>
        )}
      </div>
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
  required = false,
  full = false,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  autoComplete: string;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`content-field ${full ? "content-field--full" : ""}`}>
      <label className="content-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        className="content-field__input"
      />
    </div>
  );
}
