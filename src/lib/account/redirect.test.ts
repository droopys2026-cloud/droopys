import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "@/lib/account/redirect";

describe("safeRedirectPath", () => {
  it("garde un chemin interne", () => {
    expect(safeRedirectPath("/compte/adresses", "/compte")).toBe("/compte/adresses");
  });

  it("garde la requête d'un chemin interne", () => {
    expect(safeRedirectPath("/favoris?tri=prix", "/compte")).toBe("/favoris?tri=prix");
  });

  it.each([
    ["absent", null],
    ["vide", ""],
    ["autre site", "https://exemple.com"],
    ["protocole relatif", "//exemple.com"],
    ["barre inverse", "/\\exemple.com"],
    ["javascript", "javascript:alert(1)"],
    ["chemin relatif", "compte"],
    ["pas une chaîne", 42],
  ])("retombe sur la valeur par défaut : %s", (_label, value) => {
    expect(safeRedirectPath(value, "/compte")).toBe("/compte");
  });
});
