import { describe, expect, it } from "vitest";
import { promoAnnouncement } from "@/lib/promo/announcement";

describe("promoAnnouncement", () => {
  it("compose le message d'un pourcentage, avec le code", () => {
    expect(promoAnnouncement({ code: "BLACK20", kind: "percent", value: 20, announcement: null })).toBe(
      "−20\u00a0% sur tout le site avec le code BLACK20",
    );
  });

  it("compose le message d'un montant, sans centimes inutiles", () => {
    expect(promoAnnouncement({ code: "DIX", kind: "amount", value: 1000, announcement: "" })).toBe(
      "−10\u00a0€ sur tout le site avec le code DIX",
    );
    expect(promoAnnouncement({ code: "DIX", kind: "amount", value: 1050, announcement: null })).toBe(
      "−10,50\u00a0€ sur tout le site avec le code DIX",
    );
  });

  it("garde le message saisi à l'admin", () => {
    expect(
      promoAnnouncement({ code: "NOEL", kind: "percent", value: 15, announcement: "  Noël : −15 % avec NOEL  " }),
    ).toBe("Noël : −15 % avec NOEL");
  });
});
