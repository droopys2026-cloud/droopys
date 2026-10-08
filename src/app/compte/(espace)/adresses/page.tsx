import type { Metadata } from "next";
import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import {
  deleteAddress,
  setDefaultAddress,
} from "@/app/compte/(espace)/adresses/actions";
import { AddressForm } from "@/components/account/address-form";
import { db } from "@/db";
import { customerAddresses } from "@/db/schema";
import { requireCustomer } from "@/lib/auth";
import { COUNTRY_LABELS, COUNTRY_CODES } from "@/lib/account/schema";

export const metadata: Metadata = {
  title: "Mes adresses | Droopy's",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ modifier?: string | string[] }> };

function countryLabel(code: string): string {
  const known = COUNTRY_CODES.find((entry) => entry === code);
  return known ? COUNTRY_LABELS[known] : code;
}

/**
 * Carnet d'adresses. La modification se fait sur la même page
 * (`?modifier=<id>`) : un lien, pas d'état client, et le bouton retour du
 * navigateur annule.
 */
export default async function AddressesPage({ searchParams }: PageProps) {
  const { customer } = await requireCustomer("/compte/adresses");
  const { modifier } = await searchParams;

  const addresses = await db
    .select()
    .from(customerAddresses)
    .where(eq(customerAddresses.customerId, customer.id))
    .orderBy(desc(customerAddresses.isDefault), asc(customerAddresses.createdAt));

  const editing = addresses.find((address) => address.id === modifier);

  return (
    <>
      <section className="account-section">
        <h2 className="account-title">Mes adresses</h2>

        {addresses.length === 0 ? (
          <p className="text-paragraph m-0">Aucune adresse enregistrée.</p>
        ) : (
          <ul className="account-cards">
            {addresses.map((address) => (
              <li key={address.id} className="account-card">
                <span className="account-card__title">
                  {address.fullName}
                  {address.isDefault && (
                    <span className="account-card__muted"> · par défaut</span>
                  )}
                </span>
                <address className="not-italic">
                  <span className="block">{address.line1}</span>
                  {address.line2 && <span className="block">{address.line2}</span>}
                  <span className="block">
                    {address.postalCode} {address.city}
                  </span>
                  <span className="block">{countryLabel(address.country)}</span>
                  {address.phone && (
                    <span className="account-card__muted block">{address.phone}</span>
                  )}
                </address>

                <div className="account-card__actions">
                  <Link
                    href={`/compte/adresses?modifier=${address.id}`}
                    className="link-underline-sm"
                  >
                    Modifier
                  </Link>
                  {!address.isDefault && (
                    <form action={setDefaultAddress}>
                      <input type="hidden" name="addressId" value={address.id} />
                      <button type="submit" className="link-underline-sm">
                        Par défaut
                      </button>
                    </form>
                  )}
                  <form action={deleteAddress}>
                    <input type="hidden" name="addressId" value={address.id} />
                    <button
                      type="submit"
                      className="link-underline-sm"
                      aria-label={`Supprimer l'adresse ${address.line1}`}
                    >
                      Supprimer
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="account-section" aria-labelledby="adresse-formulaire">
        <h3 id="adresse-formulaire" className="account-subtitle">
          {editing ? "Modifier l'adresse" : "Ajouter une adresse"}
        </h3>
        {/* La clé force un formulaire neuf quand on passe d'une adresse à une
            autre : sans elle, les valeurs de la précédente resteraient. */}
        <AddressForm key={editing?.id ?? "nouvelle"} address={editing} />
      </section>
    </>
  );
}
