import { describe, expect, it } from "vitest";
import { renderContactMessage } from "@/lib/email/contact-message";

const contact = {
  name: "Léa <b>Martin</b>",
  email: "lea@exemple.fr",
  phone: "",
  subject: "Ma commande",
  orderReference: "DRP-000123",
  message: "Bonjour,\n<script>alert(1)</script>",
  receivedAt: "13 octobre 2026 à 10:12",
};

describe("message de contact", () => {
  const email = renderContactMessage(contact);

  it("met le sujet et le nom dans l'objet", () => {
    expect(email.subject).toBe("[Contact] Ma commande — Léa <b>Martin</b>");
  });

  it("échappe tout ce que le visiteur a saisi", () => {
    expect(email.html).not.toContain("<b>Martin</b>");
    expect(email.html).not.toContain("<script>");
  });

  it("omet les champs facultatifs laissés vides", () => {
    expect(email.text).not.toContain("Téléphone");
    expect(email.text).toContain("Commande : DRP-000123");
  });
});
