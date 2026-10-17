import { describe, expect, it } from "vitest";
import { renderOrderConfirmation, type ConfirmationOrder } from "@/lib/email/order-confirmation";

const order: ConfirmationOrder = {
  reference: "DR-2026-0042",
  customerName: "Léa Martin",
  deliveryMethod: "domicile",
  serviceLabel: "Colissimo à domicile",
  shippingAddress: ["1 rue de Rome", "13001 Marseille", "FR"],
  shippingCents: 690,
  promoCode: null,
  discountCents: 0,
  lines: [
    { brand: "Moncler", productName: "Doudoune Maya", color: "Rose poudré", size: "8 ans", quantity: 1, unitPriceCents: 45000, imageUrl: "https://droopys.fr/imgdress/maya.webp" },
    { brand: null, productName: "Bonnet <script>", color: null, size: "TU", quantity: 2, unitPriceCents: 3500, imageUrl: null },
  ],
  shop: { name: "Droopy's Marseille — Grand Littoral", address: ["139 avenue de la Viste", "13015 Marseille"] },
  siteUrl: "https://droopys.fr",
};

describe("renderOrderConfirmation", () => {
  const email = renderOrderConfirmation(order);

  it("cite la référence dans l'objet", () => {
    expect(email.subject).toContain("DR-2026-0042");
  });

  it("additionne lignes et port en centimes", () => {
    // 450 + 2 × 35 + 6,90 = 526,90 €
    expect(email.text).toContain("526,90");
    expect(email.html).toContain("526,90");
  });

  it("montre la photo d'un article, et un cadre vide sans photo", () => {
    expect(email.html).toContain('src="https://droopys.fr/imgdress/maya.webp"');
    expect(email.html.match(/<img /g)).toHaveLength(1);
  });

  it("nomme la couleur achetée, et rien pour une pièce sans couleur", () => {
    expect(email.text).toContain("Doudoune Maya, Rose poudré, taille 8 ans");
    expect(email.text).toContain("Bonnet <script>, taille TU");
    expect(email.html).toContain("Rose poudré · taille 8 ans");
  });

  it("montre la remise du code promo et la retire du total", () => {
    const withPromo = renderOrderConfirmation({ ...order, promoCode: "BLACK20", discountCents: 5000 });
    expect(withPromo.text).toContain("Code promo BLACK20 : −50,00");
    // 526,90 − 50 = 476,90 €
    expect(withPromo.text).toContain("Total payé : 476,90");
    expect(withPromo.html).toContain("476,90");
  });

  it("échappe ce qui vient de la base", () => {
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("Bonnet &lt;script&gt;");
  });

  it("donne l'adresse de livraison à domicile", () => {
    expect(email.text).toContain("13001 Marseille");
  });

  it("donne l'adresse de la boutique pour un retrait", () => {
    const pickup = renderOrderConfirmation({ ...order, deliveryMethod: "retrait", shippingAddress: [], shippingCents: 0 });
    expect(pickup.text).toContain("Grand Littoral");
    expect(pickup.text).toContain("Offerte");
  });
});
