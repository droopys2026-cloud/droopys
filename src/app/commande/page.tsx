import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { CheckoutWizard } from "@/components/checkout/checkout-wizard";
import type { SavedAddress } from "@/components/checkout/delivery-step";
import { SiteAnnouncement } from "@/components/layout/site-announcement";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { db } from "@/db";
import { customerAddresses, customers } from "@/db/schema";
import { COUNTRY_CODES } from "@/lib/account/schema";
import { publicEnv, serverEnv } from "@/lib/env";
import { parcelWeightKg, quoteParcel } from "@/lib/shipping/quote";
import { getCart } from "@/lib/queries/cart";
import { getShopSettings } from "@/lib/queries/settings";
import { SHOPS } from "@/lib/shops";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Commande | Droopy's",
  robots: { index: false, follow: false },
};

/**
 * Tunnel de commande. Cette page ne fait que rassembler ce que le formulaire
 * doit savoir — panier, tarifs, boutique de retrait, ce qu'on sait d'un client
 * connecté — puis passe la main à `CheckoutWizard`.
 */
export default async function CheckoutPage() {
  const [lines, { livraison }, user] = await Promise.all([
    getCart(),
    getShopSettings(),
    getCurrentUser(),
  ]);
  // Un tunnel sans article n'a rien à payer : retour au panier, qui le dit.
  if (lines.length === 0) redirect("/panier");

  let prefill = null;
  let savedAddresses: SavedAddress[] = [];
  if (user) {
    // Lecture seule : la ligne `customers` est garantie à la connexion. Si elle
    // manque, le client saisit simplement ses coordonnées.
    const [customer, addresses] = await Promise.all([
      db.query.customers.findFirst({ where: eq(customers.id, user.id) }),
      db
        .select()
        .from(customerAddresses)
        .where(eq(customerAddresses.customerId, user.id))
        .orderBy(desc(customerAddresses.isDefault), asc(customerAddresses.createdAt)),
    ]);
    prefill = {
      email: user.email ?? "",
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      phone: addresses.find((address) => address.phone)?.phone ?? "",
    };
    savedAddresses = addresses.map((address) => ({
      id: address.id,
      label: `${address.line1}, ${address.postalCode} ${address.city}`,
      line1: address.line1,
      line2: address.line2 ?? "",
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    }));
  }

  // Tarifs réels Sendcloud pour ce colis, vers chaque pays desservi : le prix
  // à domicile suit le pays de l'adresse sans recharger la page. Six appels
  // au plus, mis en cache six heures — `quoteParcel` rend `null` si Sendcloud
  // ne répond pas, et le tunnel retombe sur le retrait en boutique.
  const weightKg = parcelWeightKg(
    lines.map((line) => ({
      categorySlug: line.product.categorySlug ?? null,
      subcategorySlug: line.product.subcategory?.slug ?? null,
      quantity: line.quantity,
    })),
    livraison.weights,
  );
  const quotes = await Promise.all(
    COUNTRY_CODES.map(async (country) => [country, await quoteParcel(country, weightKg)] as const),
  );
  const optionsByCountry = Object.fromEntries(quotes);

  const shop = SHOPS[0];

  return (
    <>
      <SiteAnnouncement />
      {/* Pas de grand titre dans l'en-tête : ses marges, pensées pour les
          pages vitrines, repoussaient le formulaire loin sous le menu. La
          barre d'étapes et le titre de chaque étape disent où l'on est. */}
      <SiteHeader />

      <main className="section-main min-h-[50vh]">
        <h1 className="sr-only">Commande</h1>
        <div className="container-page pt-9 pb-17">
          <CheckoutWizard
            lines={lines}
            freeFromCents={livraison.freeFromCents}
            optionsByCountry={optionsByCountry}
            sendcloudKey={serverEnv.SENDCLOUD_PUBLIC_KEY ?? null}
            shop={{ name: shop.name, address: shop.address }}
            prefill={prefill}
            savedAddresses={savedAddresses}
            publishableKey={publicEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
