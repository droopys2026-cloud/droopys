import { describe, expect, it } from "vitest";
import { renderRefundNotice } from "@/lib/email/refund-notice";

const base = { reference: "DR-2026-0042", customerName: "Inès Martin", siteUrl: "https://x" };

describe("e-mail de remboursement", () => {
  it("annonce un remboursement total", () => {
    const email = renderRefundNotice({ ...base, amountCents: 26_900, full: true });
    expect(email.subject).toBe("Remboursement de votre commande DR-2026-0042");
    expect(email.text).toContain("entièrement remboursée");
    expect(email.text).toMatch(/269,00\s€/);
  });
  it("annonce un remboursement partiel", () => {
    const email = renderRefundNotice({ ...base, amountCents: 8_900, full: false });
    expect(email.text).toMatch(/Nous vous remboursons 89,00\s€/);
    expect(email.html).toContain("Inès");
  });
});
