import { describe, expect, it } from "vitest";
import { renderAccountEmail } from "@/lib/email/account-emails";

describe("e-mails du compte", () => {
  it("met le lien de confirmation dans le bouton et dans le texte", () => {
    const link = "https://droopys.example/compte/confirmation?token_hash=abc&type=signup";
    const email = renderAccountEmail({ kind: "confirm", firstName: "Inès", link });
    expect(email.subject).toContain("Confirmez");
    expect(email.html).toContain(link.replaceAll("&", "&amp;"));
    expect(email.text).toContain(link);
    expect(email.html).toContain("Bienvenue, Inès");
  });

  it("échappe le prénom saisi", () => {
    const email = renderAccountEmail({ kind: "confirm", firstName: "<b>x</b>", link: "https://x" });
    expect(email.html).not.toContain("<b>x</b>");
  });

  it("parle de nouveau mot de passe pour une réinitialisation", () => {
    const email = renderAccountEmail({ kind: "reset", link: "https://x" });
    expect(email.subject).toContain("nouveau mot de passe");
    expect(email.text).toContain("https://x");
  });
});
