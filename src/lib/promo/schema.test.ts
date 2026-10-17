import { describe, expect, it } from "vitest";
import { parisEndOfDay, promoInputSchema } from "@/lib/promo/schema";

const base = {
  code: " black 20 ",
  kind: "percent",
  value: "20",
  scope: "site",
  productIds: [],
  endsOn: "",
  maxUses: "",
  minSubtotal: "",
  oncePerCustomer: false,
  active: true,
  announce: true,
  announcement: "",
};

describe("promoInputSchema", () => {
  it("normalise le code et lit un pourcentage", () => {
    expect(promoInputSchema.parse(base)).toMatchObject({
      code: "BLACK20",
      kind: "percent",
      value: 20,
      endsAt: null,
      maxUses: null,
      minSubtotalCents: null,
      announce: true,
      announcement: null,
    });
  });

  it("lit un montant en euros comme des centimes", () => {
    expect(
      promoInputSchema.parse({ ...base, kind: "amount", value: "10,50", minSubtotal: "100" }),
    ).toMatchObject({ value: 1050, minSubtotalCents: 10000 });
  });

  it("refuse un pourcentage hors de 1 à 100", () => {
    expect(promoInputSchema.safeParse({ ...base, value: "120" }).success).toBe(false);
    expect(promoInputSchema.safeParse({ ...base, value: "0" }).success).toBe(false);
  });

  it("refuse un code trop court ou accentué", () => {
    expect(promoInputSchema.safeParse({ ...base, code: "AB" }).success).toBe(false);
    expect(promoInputSchema.safeParse({ ...base, code: "NOËL" }).success).toBe(false);
  });

  it("exige au moins un produit pour la portée « certains produits »", () => {
    expect(promoInputSchema.safeParse({ ...base, scope: "products" }).success).toBe(false);
  });

  it("n'annonce jamais un code limité à certains produits", () => {
    const parsed = promoInputSchema.parse({
      ...base,
      scope: "products",
      productIds: ["6c1d3f0e-6f43-4c39-9a3a-0a0b0c0d0e0f"],
    });
    expect(parsed.announce).toBe(false);
  });
});

describe("parisEndOfDay", () => {
  it("vaut 23:59:59 à Paris, en hiver comme en été", () => {
    expect(parisEndOfDay("2026-11-30").toISOString()).toBe("2026-11-30T22:59:59.000Z");
    expect(parisEndOfDay("2026-07-14").toISOString()).toBe("2026-07-14T21:59:59.000Z");
  });
});
