import { describe, expect, it } from "vitest";
import { splitAddressLines } from "@/lib/shipping/address";
import { addressLines } from "@/lib/checkout/details";

describe("splitAddressLines", () => {
  it("relit une adresse sans complément", () => {
    expect(splitAddressLines(["1 rue de Rome", "13001 Marseille", "FR"])).toEqual({
      line1: "1 rue de Rome", line2: null, postalCode: "13001", city: "Marseille", countryCode: "FR",
    });
  });

  it("relit une adresse avec complément et ville composée", () => {
    expect(splitAddressLines(["5 rue Chapon", "Bât. B", "75003 Paris Cedex 03", "FR"])).toEqual({
      line1: "5 rue Chapon", line2: "Bât. B", postalCode: "75003", city: "Paris Cedex 03", countryCode: "FR",
    });
  });

  it("fait l'aller-retour avec addressLines", () => {
    const address = { line1: "139 avenue de la Viste", line2: "Centre commercial", postalCode: "13015", city: "Marseille", country: "FR" as const };
    expect(splitAddressLines(addressLines(address))).toMatchObject({ line1: address.line1, line2: address.line2, postalCode: "13015", city: "Marseille", countryCode: "FR" });
  });

  it.each([[[]], [["seule ligne"]], [["rue", "13001 Marseille", "France"]], [["rue", "Marseille", "FR"]]])(
    "refuse une forme inconnue : %j",
    (lines) => {
      expect(splitAddressLines(lines)).toBeNull();
    },
  );
});
