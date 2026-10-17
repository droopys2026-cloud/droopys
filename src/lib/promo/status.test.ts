import { describe, expect, it } from "vitest";
import { promoStatus } from "@/lib/promo/status";

const now = new Date("2026-11-01T12:00:00Z");
const base = { active: true, endsAt: null, maxUses: null, uses: 0 };

describe("promoStatus", () => {
  it("dit actif un code sans limite", () => {
    expect(promoStatus(base, now)).toBe("actif");
  });

  it("dit désactivé avant tout le reste", () => {
    expect(promoStatus({ ...base, active: false, maxUses: 1, uses: 1 }, now)).toBe("desactive");
  });

  it("dit expiré après la date de fin", () => {
    expect(promoStatus({ ...base, endsAt: new Date("2026-10-31T00:00:00Z") }, now)).toBe("expire");
  });

  it("dit épuisé au plafond d'utilisations", () => {
    expect(promoStatus({ ...base, maxUses: 3, uses: 3 }, now)).toBe("epuise");
  });
});
