import { describe, expect, it } from "vitest";
import {
  EMPTY_DRAFT,
  parseStoredDraft,
  toDetails,
  validateContact,
  validateDelivery,
  type CheckoutDraft,
} from "@/lib/checkout/draft";

const filled: CheckoutDraft = {
  contact: { email: "lea@exemple.fr", firstName: "Léa", lastName: "Martin", phone: "0612345678" },
  method: "domicile",
  service: "colissimo-domicile",
  address: { line1: "1 rue de Rome", line2: "", postalCode: "13001", city: "Marseille", country: "FR" },
  servicePoint: null,
};

describe("validation des étapes", () => {
  it("signale chaque champ de contact manquant", () => {
    const errors = validateContact(EMPTY_DRAFT);
    expect(Object.keys(errors).sort()).toEqual([
      "contact.email",
      "contact.firstName",
      "contact.lastName",
      "contact.phone",
    ]);
  });

  it("exige un mode de livraison", () => {
    expect(validateDelivery(EMPTY_DRAFT)).toHaveProperty("method");
  });

  it("n'exige pas d'adresse pour le retrait", () => {
    expect(validateDelivery({ ...EMPTY_DRAFT, method: "retrait" })).toEqual({});
  });

  it("exige un transporteur à domicile", () => {
    expect(validateDelivery({ ...filled, service: "" })).toHaveProperty("service");
  });

  it("exige un point relais en mode relais", () => {
    expect(validateDelivery({ ...filled, method: "relais", service: "mondial-relay-relais" })).toHaveProperty("servicePointId");
  });

  it("refuse un point relais d'un autre transporteur", () => {
    const draft: CheckoutDraft = {
      ...filled,
      method: "relais",
      service: "colissimo-relais",
      servicePoint: { id: 1, label: "Relais", carrier: "mondial_relay" },
    };
    expect(validateDelivery(draft)).toHaveProperty("servicePointId");
    expect(validateDelivery({ ...draft, service: "mondial-relay-relais" })).toEqual({});
  });

  it("nomme les champs d'adresse manquants", () => {
    const errors = validateDelivery({ ...filled, address: { ...filled.address, city: "" } });
    expect(errors).toHaveProperty(["address.city"]);
  });
});

describe("toDetails", () => {
  it("rend des coordonnées validées", () => {
    expect(toDetails(filled)?.delivery).toMatchObject({ method: "domicile" });
  });
  it("rend null tant qu'une étape est incomplète", () => {
    expect(toDetails({ ...filled, method: "" })).toBeNull();
  });
});

describe("parseStoredDraft", () => {
  it("relit un brouillon enregistré", () => {
    expect(parseStoredDraft(JSON.stringify(filled))).toEqual(filled);
  });
  it.each([null, "{cassé", JSON.stringify({ method: "fusée", contact: 3 })])(
    "remplace un brouillon illisible par des valeurs vides : %s",
    (raw) => {
      const draft = parseStoredDraft(raw);
      expect(draft.method).toBe("");
      expect(draft.contact.email).toBe("");
    },
  );
});
