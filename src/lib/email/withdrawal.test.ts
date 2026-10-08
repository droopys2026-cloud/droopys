import { describe, expect, it } from "vitest";
import { renderWithdrawalAlert, renderWithdrawalReceipt } from "@/lib/email/withdrawal";

const notice = {
  reference: "DR-2026-0042",
  customerName: "Léa <b>Martin</b>",
  customerEmail: "lea@exemple.fr",
  items: ["Moncler — Doudoune, taille 8 ans, ×1"],
  receivedAt: "8 octobre 2026 à 15:42",
  late: true,
  siteUrl: "https://www.droopys-marseille.com",
};

describe("accusé de réception", () => {
  const email = renderWithdrawalReceipt(notice);
  it("porte la date, l'heure et la commande", () => {
    expect(email.text).toContain("8 octobre 2026 à 15:42");
    expect(email.subject).toContain("DR-2026-0042");
  });
  it("liste les articles", () => {
    expect(email.html).toContain("Doudoune, taille 8 ans");
  });
  it("échappe le nom saisi", () => {
    expect(email.html).not.toContain("<b>Martin</b>");
  });
});

describe("alerte boutique", () => {
  it("signale une demande tardive dans l'objet", () => {
    expect(renderWithdrawalAlert(notice).subject.startsWith("[Tardive]")).toBe(true);
  });
});
