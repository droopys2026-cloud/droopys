import { describe, expect, it } from "vitest";
import { addressKey, isSameCustomer, phoneKey } from "@/lib/promo/identity";

describe("phoneKey", () => {
  it("rapproche les écritures d'un même numéro français", () => {
    expect(phoneKey("06 27 75 48 39")).toBe(phoneKey("+33627754839"));
    expect(phoneKey("0033 6.27.75.48.39")).toBe("627754839");
  });

  it("ignore un numéro trop court pour identifier quelqu'un", () => {
    expect(phoneKey("12 34")).toBeNull();
  });
});

describe("addressKey", () => {
  it("ignore casse, espaces, ponctuation et complément d'adresse", () => {
    expect(addressKey(["12, Rue de Rome", "Apt 3", "13001 Marseille", "FR"])).toBe(
      addressKey(["12 rue de rome", "13001 MARSEILLE", "FR"]),
    );
  });

  it("ne prend pas un numéro de rue pour un code postal", () => {
    expect(addressKey(["1234 route de Lyon", "13001 Marseille", "FR"])).toBe("1234routedelyon|13001");
  });

  it("distingue deux rues différentes", () => {
    expect(addressKey(["12 rue de Rome", "13001 Marseille", "FR"])).not.toBe(
      addressKey(["14 rue de Rome", "13001 Marseille", "FR"]),
    );
  });
});

describe("isSameCustomer", () => {
  const previous = {
    customerId: null,
    email: "lea@exemple.fr",
    phone: "+33627754839",
    deliveryMethod: "domicile" as const,
    addressLines: ["12 rue de Rome", "13001 Marseille", "FR"],
  };

  it("reconnaît la cliente à son e-mail, quelle que soit la casse", () => {
    expect(isSameCustomer({ email: "LEA@exemple.fr " }, previous)).toBe(true);
  });

  it("reconnaît la cliente qui change d'e-mail mais garde son téléphone", () => {
    expect(isSameCustomer({ email: "autre@exemple.fr", phone: "06 27 75 48 39" }, previous)).toBe(true);
  });

  it("reconnaît la cliente qui change d'e-mail et de téléphone mais garde son adresse", () => {
    expect(
      isSameCustomer(
        {
          email: "autre@exemple.fr",
          phone: "0700000000",
          deliveryMethod: "domicile",
          addressLines: ["12, Rue de Rome", "13001 MARSEILLE", "FR"],
        },
        previous,
      ),
    ).toBe(true);
  });

  it("reconnaît la cliente à son compte", () => {
    expect(isSameCustomer({ customerId: "u1" }, { ...previous, email: "x@y.fr", customerId: "u1" })).toBe(true);
  });

  it("ne confond pas deux clientes du même point relais", () => {
    const relay = ["Relais Tabac", "3 place du Marché", "13001 Marseille", "FR"];
    expect(
      isSameCustomer(
        { email: "b@exemple.fr", phone: "0700000000", deliveryMethod: "relais", addressLines: relay },
        { ...previous, deliveryMethod: "relais", addressLines: relay },
      ),
    ).toBe(false);
  });

  it("laisse passer une autre cliente", () => {
    expect(isSameCustomer({ email: "b@exemple.fr", phone: "0700000000" }, previous)).toBe(false);
  });
});
