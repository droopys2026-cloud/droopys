import { describe, expect, it } from "vitest";
import { evaluatePromo, type PromoRules } from "@/lib/promo/discount";

const now = new Date("2026-11-01T12:00:00Z");

const rules = (overrides: Partial<PromoRules> = {}): PromoRules => ({
  code: "BLACK20",
  kind: "percent",
  value: 20,
  scope: "site",
  productIds: [],
  endsAt: null,
  maxUses: null,
  minSubtotalCents: null,
  oncePerCustomer: false,
  uses: 0,
  active: true,
  ...overrides,
});

const line = (productId: string, unitPriceCents: number, quantity = 1, onSale = false) => ({
  productId,
  unitPriceCents,
  quantity,
  onSale,
});

const evaluate = (r: PromoRules, lines = [line("a", 10000), line("b", 5000, 2)], usedByCustomer = 0) =>
  evaluatePromo(r, { lines, usedByCustomer, now });

describe("evaluatePromo — calcul", () => {
  it("applique un pourcentage à tout le panier", () => {
    expect(evaluate(rules())).toEqual({ ok: true, discountCents: 4000, eligibleCents: 20000 });
  });

  it("arrondit le pourcentage au centime", () => {
    expect(evaluate(rules({ value: 15 }), [line("a", 3333)])).toMatchObject({ discountCents: 500 });
  });

  it("plafonne un montant fixe au total des articles concernés", () => {
    expect(evaluate(rules({ kind: "amount", value: 2000 }))).toMatchObject({ discountCents: 2000 });
    expect(evaluate(rules({ kind: "amount", value: 50000 }))).toMatchObject({ discountCents: 20000 });
  });

  it("n'applique pas la remise aux articles soldés", () => {
    expect(evaluate(rules(), [line("a", 10000), line("b", 5000, 1, true)])).toEqual({
      ok: true,
      discountCents: 2000,
      eligibleCents: 10000,
    });
  });

  it("ne réduit que les produits choisis", () => {
    expect(evaluate(rules({ scope: "products", productIds: ["b"] }))).toMatchObject({
      discountCents: 2000,
      eligibleCents: 10000,
    });
  });
});

describe("evaluatePromo — refus", () => {
  it("refuse un code désactivé", () => {
    expect(evaluate(rules({ active: false }))).toEqual({ ok: false, reason: "inactif" });
  });

  it("refuse un code expiré", () => {
    expect(evaluate(rules({ endsAt: new Date("2026-10-31T23:59:59Z") }))).toEqual({
      ok: false,
      reason: "expire",
    });
  });

  it("refuse un code épuisé", () => {
    expect(evaluate(rules({ maxUses: 10, uses: 10 }))).toEqual({ ok: false, reason: "epuise" });
  });

  it("refuse sous le minimum d'achat, en disant le minimum", () => {
    expect(evaluate(rules({ minSubtotalCents: 30000 }))).toEqual({
      ok: false,
      reason: "minimum",
      minSubtotalCents: 30000,
    });
  });

  it("compte les soldés dans le minimum d'achat", () => {
    expect(
      evaluate(rules({ minSubtotalCents: 15000 }), [line("a", 10000), line("b", 5000, 1, true)]),
    ).toMatchObject({ ok: true });
  });

  it("refuse une deuxième utilisation par la même cliente", () => {
    expect(evaluate(rules({ oncePerCustomer: true }), undefined, 1)).toEqual({
      ok: false,
      reason: "deja-utilise",
    });
  });

  it("refuse un panier sans article concerné", () => {
    expect(evaluate(rules({ scope: "products", productIds: ["z"] }))).toEqual({
      ok: false,
      reason: "aucun-article",
    });
    expect(evaluate(rules(), [line("a", 10000, 1, true)])).toEqual({
      ok: false,
      reason: "aucun-article",
    });
  });
});
