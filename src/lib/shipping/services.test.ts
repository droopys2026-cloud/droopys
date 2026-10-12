import { describe, expect, it } from "vitest";
import { quoteServices, type SendcloudMethod } from "@/lib/shipping/services";

const method = (id: number, name: string, min: number, max: number, price: number, country = "FR"): SendcloudMethod => ({
  id, name, carrier: name.startsWith("Colissimo") ? "colissimo" : name.startsWith("Mondial") ? "mondial_relay" : "chronopost",
  min_weight: String(min), max_weight: String(max),
  countries: [{ iso_2: country, price }],
});

const methods: SendcloudMethod[] = [
  method(376, "Colissimo Service Point 0-0.25kg", 0.001, 0.251, 5.99),
  method(372, "Colissimo Service Point 0.25-0.5kg", 0.251, 0.501, 6.97),
  method(1, "Colissimo Home 0.25-0.5kg", 0.251, 0.501, 8.85),
  method(2, "Colissimo Home Signature 0.25-0.5kg", 0.251, 0.501, 10.5),
  method(3, "Mondial Relay Point Relais 0.25-0.5kg", 0.251, 0.501, 3.91),
  method(4, "Mondial Relay Point Relais QR 0.25-0.5kg", 0.251, 0.501, 3.91),
  method(5, "Mondial Relay Home Domestic 0.25-0.5kg", 0.251, 0.501, 5.17),
  method(6, "Chrono 18 0-2kg", 0.001, 2.001, 13.35),
  method(7, "Chrono Relais 0-2kg", 0.001, 2.001, 9.14),
  method(8, "Chrono Shop2Shop 0-0.5kg", 0.001, 0.501, 3.46),
];

describe("quoteServices", () => {
  const options = quoteServices(methods, "FR", 0.5);

  it("prend la tranche de poids qui contient le colis", () => {
    expect(options.find((o) => o.key === "colissimo-relais")?.methodId).toBe(372);
  });

  it("ajoute la TVA de 20 % au prix hors taxes, en centimes", () => {
    // 3,91 € HT × 1,2 = 4,692 → 4,69 €
    expect(options.find((o) => o.key === "mondial-relay-relais")?.priceCents).toBe(469);
  });

  it("ignore les variantes signature et QR", () => {
    expect(options.find((o) => o.key === "colissimo-domicile")?.methodId).toBe(1);
    expect(options.find((o) => o.key === "mondial-relay-relais")?.methodId).toBe(3);
    expect(options.find((o) => o.key === "colissimo-relais")?.methodId).toBe(372);
  });

  it("propose Chronopost en relais au tarif Shop2Shop, pas Chrono Relais", () => {
    expect(options.find((o) => o.key === "chronopost-relais")?.methodId).toBe(8);
  });

  it("propose les cinq services quand le poids le permet", () => {
    expect(options.map((o) => o.key).sort()).toEqual([
      "chronopost-relais",
      "colissimo-domicile",
      "colissimo-relais",
      "mondial-relay-domicile",
      "mondial-relay-relais",
    ]);
  });

  it("omet un service sans tranche pour ce poids", () => {
    const heavy = quoteServices(methods, "FR", 2.5);
    expect(heavy.find((o) => o.key === "chronopost-relais")).toBeUndefined();
  });

  it("omet un service sans prix pour ce pays", () => {
    expect(quoteServices(methods, "BE", 0.5)).toEqual([]);
  });

  it("classe les options de la moins chère à la plus chère dans chaque mode", () => {
    const relais = options.filter((o) => o.kind === "relais").map((o) => o.priceCents);
    expect(relais).toEqual([...relais].sort((a, b) => a - b));
  });
});
