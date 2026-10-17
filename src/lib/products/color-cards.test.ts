import { describe, expect, it } from "vitest";
import { cardHref, cardKey, colorCards } from "@/lib/products/color-cards";
import type { Product } from "@/types/product";

const size = (variantId: string, colorId: string | undefined, quantity = 1) => ({
  variantId,
  size: "8 ans",
  quantity,
  colorId,
  priceCents: 4500,
  ownPrice: false,
});

const base: Product = {
  id: "p1",
  slug: "doudoune",
  brand: "Moncler",
  name: "Doudoune",
  priceCents: 4500,
  imageUrl: "/noir-1.webp",
};

describe("colorCards", () => {
  it("laisse un article sans couleur tel quel", () => {
    const product = { ...base, sizes: [size("v1", undefined)] };
    expect(colorCards([product])).toEqual([product]);
  });

  it("laisse un article d'une seule couleur tel quel", () => {
    const product = {
      ...base,
      colors: [{ id: "c1", slug: "noir", name: "Noir", hex: "#000000", images: ["/noir-1.webp"] }],
    };
    expect(colorCards([product])).toEqual([product]);
  });

  it("fait une carte par couleur, avec ses photos et son stock", () => {
    const cards = colorCards([
      {
        ...base,
        colors: [
          { id: "c1", slug: "noir", name: "Noir", hex: "#000000", images: ["/noir-1.webp", "/noir-2.webp"] },
          { id: "c2", slug: "kaki", name: "Kaki", hex: "#6b6b3a", images: ["/kaki-1.webp"] },
        ],
        sizes: [size("v1", "c1", 2), size("v2", "c2", 0)],
      },
    ]);

    expect(cards).toHaveLength(2);
    expect(cards[1]).toMatchObject({
      cardColor: { id: "c2", slug: "kaki", name: "Kaki" },
      imageUrl: "/kaki-1.webp",
      hoverImageUrl: undefined,
      sizes: [{ variantId: "v2", quantity: 0 }],
    });
    expect(cardKey(cards[1])).toBe("p1-c2");
    expect(cardHref(cards[1])).toBe("/produits/doudoune?couleur=kaki");
  });
});
