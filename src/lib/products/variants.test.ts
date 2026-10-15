import { describe, expect, it } from "vitest";
import {
  displayPrice,
  inlineVariantLabel,
  priceRange,
  variantLabel,
  variantPriceCents,
} from "@/lib/products/variants";

describe("variantPriceCents", () => {
  it("prend le prix du produit quand la déclinaison n'en a pas", () => {
    expect(variantPriceCents({ priceCents: null }, 4500)).toBe(4500);
  });

  it("prend le prix propre de la déclinaison quand il est saisi", () => {
    expect(variantPriceCents({ priceCents: 5200 }, 4500)).toBe(5200);
  });
});

describe("priceRange", () => {
  it("ne dit rien d'une liste vide", () => {
    expect(priceRange([])).toBeUndefined();
  });

  it("signale des prix égaux comme fixes", () => {
    expect(priceRange([4500, 4500])).toEqual({ fromCents: 4500, varies: false });
  });

  it("rend le plus bas quand les prix varient", () => {
    expect(priceRange([5200, 4500, 4900])).toEqual({ fromCents: 4500, varies: true });
  });
});

describe("variantLabel", () => {
  it("se limite à la taille sans couleur", () => {
    expect(variantLabel({ size: "8 ans" })).toBe("Taille 8 ans");
    expect(variantLabel({ color: null, size: "8 ans" })).toBe("Taille 8 ans");
  });

  it("place la couleur devant la taille", () => {
    expect(variantLabel({ color: "Rose poudré", size: "8 ans" })).toBe(
      "Rose poudré · taille 8 ans",
    );
  });
});

describe("inlineVariantLabel", () => {
  it("reste en minuscule sans couleur", () => {
    expect(inlineVariantLabel({ size: "8 ans" })).toBe("taille 8 ans");
  });

  it("garde le nom de la couleur tel que saisi", () => {
    expect(inlineVariantLabel({ color: "Rose poudré", size: "8 ans" })).toBe(
      "Rose poudré, taille 8 ans",
    );
  });
});

describe("displayPrice", () => {
  const product = { priceCents: 4500, compareAtPriceCents: 6000 };
  const size = (priceCents: number, ownPrice: boolean, quantity = 1) => ({
    priceCents,
    ownPrice,
    quantity,
  });

  it("garde le prix et le prix barré de la fiche sans prix de taille", () => {
    expect(displayPrice(product, [size(4500, false), size(4500, false)])).toEqual({
      cents: 4500,
      from: false,
      compareAtCents: 6000,
    });
  });

  it("annonce « dès » le plus bas et retire le prix barré quand les prix varient", () => {
    expect(displayPrice(product, [size(4500, false), size(5200, true)])).toEqual({
      cents: 4500,
      from: true,
      compareAtCents: undefined,
    });
  });

  it("ignore une taille épuisée tant qu'une autre est en stock", () => {
    expect(displayPrice(product, [size(3900, true, 0), size(5200, true)])).toEqual({
      cents: 5200,
      from: false,
      compareAtCents: undefined,
    });
  });

  it("retombe sur le prix de la fiche sans aucune taille", () => {
    expect(displayPrice({ priceCents: 4500 }, [])).toEqual({
      cents: 4500,
      from: false,
      compareAtCents: undefined,
    });
  });
});
