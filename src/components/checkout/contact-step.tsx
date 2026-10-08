"use client";

import Link from "next/link";
import { CheckoutField } from "@/components/checkout/checkout-field";
import type { CheckoutDraft, FieldErrors } from "@/lib/checkout/draft";

type Contact = CheckoutDraft["contact"];

/** Étape 1 : qui commande, et comment le joindre. */
export function ContactStep({
  contact,
  errors,
  touched,
  signedIn,
  onChange,
  onBlur,
}: {
  contact: Contact;
  errors: FieldErrors;
  touched: Set<string>;
  signedIn: boolean;
  onChange: (field: keyof Contact, value: string) => void;
  onBlur: (field: keyof Contact) => void;
}) {
  const error = (field: keyof Contact) =>
    touched.has(`contact.${field}`) ? errors[`contact.${field}`] : undefined;

  return (
    <div className="checkout-step">
      <h2 className="account-title" tabIndex={-1}>Vos coordonnées</h2>
      {!signedIn && (
        <p className="text-paragraph m-0">
          Déjà client ?{" "}
          <Link href="/compte/connexion?suite=%2Fcommande" className="link-underline-sm">
            Me connecter
          </Link>{" "}
          pour retrouver mes adresses. Sinon, continuez sans compte.
        </p>
      )}

      <div className="content-form">
        <div className="content-form__grid">
          <CheckoutField
            id="tunnel-email"
            label="Adresse e-mail"
            type="email"
            autoComplete="email"
            value={contact.email}
            onChange={(value) => onChange("email", value)}
            onBlur={() => onBlur("email")}
            error={error("email")}
            hint="La confirmation de commande y sera envoyée."
            full
          />
          <CheckoutField
            id="tunnel-prenom"
            label="Prénom"
            autoComplete="given-name"
            value={contact.firstName}
            onChange={(value) => onChange("firstName", value)}
            onBlur={() => onBlur("firstName")}
            error={error("firstName")}
          />
          <CheckoutField
            id="tunnel-nom"
            label="Nom"
            autoComplete="family-name"
            value={contact.lastName}
            onChange={(value) => onChange("lastName", value)}
            onBlur={() => onBlur("lastName")}
            error={error("lastName")}
          />
          <CheckoutField
            id="tunnel-telephone"
            label="Téléphone"
            type="tel"
            autoComplete="tel"
            value={contact.phone}
            onChange={(value) => onChange("phone", value)}
            onBlur={() => onBlur("phone")}
            error={error("phone")}
            hint="Pour le transporteur, ou pour vous prévenir quand le retrait est prêt."
            full
          />
        </div>
      </div>
    </div>
  );
}
