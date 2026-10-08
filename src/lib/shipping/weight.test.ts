import { describe, expect, it } from "vitest";
import { itemWeightGrams, parcelWeightGrams, type ParcelWeights } from "@/lib/shipping/weight";

const weights: ParcelWeights = { clothes: 350, baby: 200, shoes: 900, coat: 1000, accessory: 200 };

describe("itemWeightGrams", () => {
  it.each([
    [{ categorySlug: "garcon", subcategorySlug: "manteaux" }, 1000],
    [{ categorySlug: "manteaux", subcategorySlug: "doudounes" }, 1000],
    [{ categorySlug: "fille", subcategorySlug: "chaussures" }, 900],
    [{ categorySlug: "chaussures", subcategorySlug: "baskets" }, 900],
    [{ categorySlug: "accessoires", subcategorySlug: "bonnets" }, 200],
    [{ categorySlug: "bebe", subcategorySlug: "accessoires" }, 200],
    [{ categorySlug: "bebe", subcategorySlug: null }, 200],
    [{ categorySlug: "bebe", subcategorySlug: "manteaux" }, 1000],
    [{ categorySlug: "fille", subcategorySlug: "robes" }, 350],
    [{ categorySlug: "garcon", subcategorySlug: null }, 350],
    [{ categorySlug: null, subcategorySlug: null }, 350],
  ])("%o pèse %i g", (product, grams) => {
    expect(itemWeightGrams(product, weights)).toBe(grams);
  });
});

describe("parcelWeightGrams", () => {
  it("additionne les articles, quantités comprises", () => {
    expect(
      parcelWeightGrams(
        [
          { categorySlug: "garcon", subcategorySlug: "manteaux", quantity: 1 },
          { categorySlug: "bebe", subcategorySlug: null, quantity: 2 },
        ],
        weights,
      ),
    ).toBe(1400);
  });
});
