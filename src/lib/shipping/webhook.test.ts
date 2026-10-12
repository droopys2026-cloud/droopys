import { describe, expect, it } from "vitest";
import { isValidSendcloudSignature } from "@/lib/shipping/webhook";

describe("isValidSendcloudSignature", () => {
  // Vecteur de test publié par Sendcloud.
  const body = '{"key": "value"}';
  const signature = "1eed4b3d41f4653ac64fd56f1bf1cbfd349e4482cbc11dff7134bd93e5da4b0a";

  it("accepte la signature de Sendcloud", () => {
    expect(isValidSendcloudSignature(body, signature, "secretkey")).toBe(true);
  });
  it("refuse un corps modifié", () => {
    expect(isValidSendcloudSignature('{"key": "autre"}', signature, "secretkey")).toBe(false);
  });
  it("refuse une autre clé", () => {
    expect(isValidSendcloudSignature(body, signature, "autre")).toBe(false);
  });
  it("refuse une signature absente ou mal formée", () => {
    expect(isValidSendcloudSignature(body, null, "secretkey")).toBe(false);
    expect(isValidSendcloudSignature(body, "zz", "secretkey")).toBe(false);
  });
});
