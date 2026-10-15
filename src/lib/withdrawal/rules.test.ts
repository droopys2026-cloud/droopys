import { describe, expect, it } from "vitest";
import { isLate, lineLabel, normalizeReference } from "@/lib/withdrawal/rules";

describe("isLate", () => {
  const placed = new Date("2026-10-01T10:00:00Z");
  it("n'est pas tardive dans les 30 jours", () => {
    expect(isLate(placed, new Date("2026-10-30T10:00:00Z"))).toBe(false);
  });
  it("est tardive au-delà de 30 jours", () => {
    expect(isLate(placed, new Date("2026-11-01T10:00:00Z"))).toBe(true);
  });
});

describe("normalizeReference", () => {
  it("accepte minuscules et espaces", () => {
    expect(normalizeReference("  dr-2026- 0001 ")).toBe("DR-2026-0001");
  });
});

describe("lineLabel", () => {
  it("décrit un article", () => {
    expect(lineLabel({ brand: "Moncler", productName: "Doudoune", size: "8 ans", quantity: 1 })).toBe(
      "Moncler — Doudoune, taille 8 ans, ×1",
    );
  });

  it("nomme la couleur quand la pièce en a une", () => {
    expect(
      lineLabel({ brand: null, productName: "Robe", color: "Bleu nuit", size: "6 ans", quantity: 2 }),
    ).toBe("Robe, Bleu nuit, taille 6 ans, ×2");
  });
});
