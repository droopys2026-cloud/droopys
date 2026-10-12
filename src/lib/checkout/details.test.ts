import { describe, expect, it } from "vitest";
import {
  billingContact,
  checkoutDetailsSchema,
  readSessionMetadata,
  shippingCentsFor,
  toSessionMetadata,
  type CheckoutDetails,
} from "@/lib/checkout/details";
import type { ShippingOption } from "@/lib/shipping/services";

const options: ShippingOption[] = [
  { key: "colissimo-domicile", carrier: "colissimo", kind: "domicile", label: "", detail: "", methodId: 366, priceCents: 1062 },
  { key: "mondial-relay-relais", carrier: "mondial_relay", kind: "relais", label: "", detail: "", methodId: 28036, priceCents: 469 },
];

const contact = {
  email: "Client@Exemple.fr",
  firstName: "Léa",
  lastName: "Martin",
  phone: "06 12 34 56 78",
};

const home = {
  method: "domicile" as const,
  service: "colissimo-domicile" as const,
  address: { line1: "1 rue de Rome", line2: null, postalCode: "13001", city: "Marseille", country: "FR" as const },
};

describe("shippingCentsFor", () => {
  it("prend le prix Sendcloud du service choisi", () => {
    expect(shippingCentsFor(home, options, 10_000, null)).toBe(1062);
  });
  it("prend le prix du relais choisi", () => {
    expect(
      shippingCentsFor({ method: "relais", service: "mondial-relay-relais", servicePointId: 1 }, options, 10_000, null),
    ).toBe(469);
  });
  it("rend null pour un service indisponible", () => {
    expect(shippingCentsFor({ ...home, service: "chronopost-domicile" }, options, 10_000, null)).toBeNull();
  });
  it("ne facture jamais le retrait en boutique", () => {
    expect(shippingCentsFor({ method: "retrait" }, [], 1_000, null)).toBe(0);
  });
  it("offre le port au-delà d'une franchise, si elle existe", () => {
    expect(shippingCentsFor(home, options, 20_000, 15_000)).toBe(0);
  });
});

describe("checkoutDetailsSchema", () => {
  it("accepte une livraison à domicile et normalise l'e-mail", () => {
    const parsed = checkoutDetailsSchema.parse({
      contact,
      delivery: { ...home, address: { ...home.address, line2: "" } },
    });
    expect(parsed.contact.email).toBe("client@exemple.fr");
    expect(parsed.delivery.method === "domicile" && parsed.delivery.address.line2).toBeNull();
  });

  it("accepte sa propre sortie (revalidation côté serveur)", () => {
    const once = checkoutDetailsSchema.parse({ contact, delivery: home });
    expect(checkoutDetailsSchema.parse(once)).toEqual(once);
  });

  it("accepte un point relais par son seul identifiant", () => {
    expect(
      checkoutDetailsSchema.safeParse({
        contact,
        delivery: { method: "relais", service: "mondial-relay-relais", servicePointId: 15131624 },
      }).success,
    ).toBe(true);
  });

  it("refuse un point relais sans identifiant", () => {
    expect(
      checkoutDetailsSchema.safeParse({ contact, delivery: { method: "relais", service: "mondial-relay-relais" } }).success,
    ).toBe(false);
  });

  it("refuse un service domicile en mode relais", () => {
    expect(
      checkoutDetailsSchema.safeParse({
        contact,
        delivery: { method: "relais", service: "colissimo-domicile", servicePointId: 1 },
      }).success,
    ).toBe(false);
  });

  it("accepte le retrait sans adresse", () => {
    expect(checkoutDetailsSchema.safeParse({ contact, delivery: { method: "retrait" } }).success).toBe(true);
  });

  it("refuse un pays non desservi", () => {
    const result = checkoutDetailsSchema.safeParse({
      contact,
      delivery: { ...home, address: { ...home.address, country: "DE" } },
    });
    expect(result.success).toBe(false);
  });

  it("refuse un téléphone fantaisiste", () => {
    expect(
      checkoutDetailsSchema.safeParse({ contact: { ...contact, phone: "appelez-moi" }, delivery: { method: "retrait" } }).success,
    ).toBe(false);
  });
});

describe("métadonnées de session", () => {
  const details: CheckoutDetails = {
    contact: { email: "lea@exemple.fr", firstName: "Léa", lastName: "Martin", phone: "0612345678" },
    delivery: { method: "relais", service: "mondial-relay-relais", servicePointId: 15131624 },
  };

  it("fait l'aller-retour pour un point relais", () => {
    const meta = toSessionMetadata(details, {
      addressLines: ["Relais Enzo", "Parc Saint-Louis", "13015 Marseille", "FR"],
      methodId: 28036,
    });
    expect(readSessionMetadata(meta)).toEqual({
      method: "relais",
      service: "mondial-relay-relais",
      methodId: 28036,
      servicePointId: 15131624,
      name: "Léa Martin",
      phone: "0612345678",
      addressLines: ["Relais Enzo", "Parc Saint-Louis", "13015 Marseille", "FR"],
    });
  });

  it("fait l'aller-retour pour un retrait", () => {
    const meta = toSessionMetadata({ ...details, delivery: { method: "retrait" } }, { addressLines: [], methodId: null });
    expect(readSessionMetadata(meta)).toMatchObject({ method: "retrait", methodId: null, servicePointId: null });
  });

  it("rend null pour des métadonnées absentes ou abîmées", () => {
    expect(readSessionMetadata(null)).toBeNull();
    expect(readSessionMetadata({ livraison: "fusée" })).toBeNull();
  });

  it("tient sous la limite de 500 caractères par valeur de Stripe", () => {
    const long = "x".repeat(200);
    const meta = toSessionMetadata(details, { addressLines: [long, long, long], methodId: 1 });
    for (const value of Object.values(meta)) expect(value.length).toBeLessThanOrEqual(500);
  });
});

describe("billingContact (adresse de facturation pour Stripe, exigée par Klarna)", () => {
  it("reprend l'adresse de livraison à domicile", () => {
    expect(billingContact({ contact, delivery: home })).toEqual({
      name: "Léa Martin",
      address: { country: "FR", line1: "1 rue de Rome", line2: null, city: "Marseille", postal_code: "13001" },
    });
  });
  it("donne au moins le nom et la France en retrait ou en point relais", () => {
    expect(billingContact({ contact, delivery: { method: "retrait" } })).toEqual({
      name: "Léa Martin",
      address: { country: "FR" },
    });
    expect(
      billingContact({ contact, delivery: { method: "relais", service: "mondial-relay-relais", servicePointId: 1 } })
        .address.country,
    ).toBe("FR");
  });
});
