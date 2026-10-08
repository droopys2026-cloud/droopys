import { describe, expect, it } from "vitest";
import {
  MAX_WISHLIST,
  parseWishlist,
  toggleInWishlist,
} from "@/lib/wishlist/list";

const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";

describe("parseWishlist", () => {
  it("lit une liste valide", () => {
    expect(parseWishlist(JSON.stringify([A, B]))).toEqual([A, B]);
  });

  it.each([
    ["absent", undefined],
    ["JSON cassé", "[oups"],
    ["pas une liste", JSON.stringify({ a: 1 })],
    ["identifiant invalide", JSON.stringify(["pas-un-uuid"])],
  ])("rend une liste vide si le cookie est %s", (_label, raw) => {
    expect(parseWishlist(raw)).toEqual([]);
  });

  it("retire les doublons", () => {
    expect(parseWishlist(JSON.stringify([A, A, B]))).toEqual([A, B]);
  });
});

describe("toggleInWishlist", () => {
  it("ajoute en tête un produit absent", () => {
    expect(toggleInWishlist([B], A)).toEqual({ list: [A, B], saved: true });
  });

  it("retire un produit présent", () => {
    expect(toggleInWishlist([A, B], A)).toEqual({ list: [B], saved: false });
  });

  it("oublie le plus ancien quand la liste est pleine", () => {
    const full = Array.from({ length: MAX_WISHLIST }, (_, index) =>
      `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
    );
    const { list } = toggleInWishlist(full, A);
    expect(list).toHaveLength(MAX_WISHLIST);
    expect(list[0]).toBe(A);
    expect(list).not.toContain(full[MAX_WISHLIST - 1]);
  });
});
