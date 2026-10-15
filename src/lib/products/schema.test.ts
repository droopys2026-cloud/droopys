import { describe, expect, it } from "vitest";
import {
  colorPhotoIssues,
  productInputSchema,
  productIssues,
  type ProductInput,
} from "@/lib/products/schema";

/** Une fiche valide, à retoucher test par test. */
function draft(overrides: Partial<Record<string, unknown>> = {}): ProductInput {
  return productInputSchema.parse({
    brandSlug: "moncler",
    name: "Doudoune Maya",
    priceCents: "450",
    compareAtPriceCents: "",
    reference: "",
    categorySlug: "fille",
    subcategoryId: "",
    description: "",
    madeIn: "",
    composition: "",
    care: "",
    modelNote: "",
    sizeAdvice: "",
    badge: "",
    colors: [],
    sizes: ["8 ans", "10 ans"],
    stock: [
      { colorKey: null, size: "8 ans", quantity: 1, price: "" },
      { colorKey: null, size: "10 ans", quantity: 0, price: "" },
    ],
    measurements: [],
    published: true,
    ...overrides,
  });
}

const rose = { key: "c1", name: "Rose poudré", hex: "#E8B4B8" };
const bleu = { key: "c2", name: "Bleu", hex: "#1f3a5f" };

describe("productInputSchema", () => {
  it("lit le prix d'une taille, et vide comme « prix du produit »", () => {
    const input = draft({
      stock: [
        { colorKey: null, size: "8 ans", quantity: 1, price: "52,00" },
        { colorKey: null, size: "10 ans", quantity: 0, price: "" },
      ],
    });
    expect(input.stock.map((entry) => entry.price)).toEqual([5200, undefined]);
  });

  it("met la teinte en minuscules et refuse une teinte mal formée", () => {
    expect(draft({ colors: [rose] }).colors[0].hex).toBe("#e8b4b8");
    expect(() => draft({ colors: [{ ...rose, hex: "rose" }] })).toThrow();
  });
});

describe("productIssues", () => {
  it("accepte une fiche sans couleur", () => {
    expect(productIssues(draft())).toEqual([]);
  });

  it("accepte une case par couleur × taille", () => {
    const input = draft({
      colors: [rose, bleu],
      stock: ["c1", "c2"].flatMap((colorKey) =>
        ["8 ans", "10 ans"].map((size) => ({ colorKey, size, quantity: 1, price: "" })),
      ),
    });
    expect(productIssues(input)).toEqual([]);
  });

  it("refuse une case de stock manquante", () => {
    const input = draft({
      colors: [rose, bleu],
      stock: [{ colorKey: "c1", size: "8 ans", quantity: 1, price: "" }],
    });
    expect(productIssues(input).join(" ")).toContain("ne correspond pas");
  });

  it("refuse deux couleurs à la même adresse", () => {
    const input = draft({
      colors: [rose, { ...bleu, name: "rose poudre" }],
      stock: ["c1", "c2"].flatMap((colorKey) =>
        ["8 ans", "10 ans"].map((size) => ({ colorKey, size, quantity: 1, price: "" })),
      ),
    });
    expect(productIssues(input).join(" ")).toContain("Couleur en double");
  });

  it("refuse un prix de taille à zéro", () => {
    const input = draft({
      stock: [
        { colorKey: null, size: "8 ans", quantity: 1, price: "0" },
        { colorKey: null, size: "10 ans", quantity: 0, price: "" },
      ],
    });
    expect(productIssues(input).join(" ")).toContain("0 €");
  });
});

describe("colorPhotoIssues", () => {
  it("signale une couleur sans photo, sans compter les photos communes", () => {
    expect(colorPhotoIssues([rose, bleu], ["c1", null])).toEqual([
      "Ajoutez au moins une photo pour la couleur « Bleu ».",
    ]);
  });
});
