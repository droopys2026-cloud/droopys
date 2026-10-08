import { describe, expect, it } from "vitest";
import { isAdmin } from "@/lib/account/roles";

describe("isAdmin", () => {
  it("reconnaît le rôle posé côté serveur", () => {
    expect(isAdmin({ app_metadata: { role: "admin" } })).toBe(true);
  });

  it("refuse un client sans rôle", () => {
    expect(isAdmin({ app_metadata: {} })).toBe(false);
  });

  it("ignore un rôle écrit dans les métadonnées modifiables par l'utilisateur", () => {
    expect(
      isAdmin({ app_metadata: {}, user_metadata: { role: "admin" } }),
    ).toBe(false);
  });

  it("refuse l'absence d'utilisateur", () => {
    expect(isAdmin(null)).toBe(false);
  });
});
