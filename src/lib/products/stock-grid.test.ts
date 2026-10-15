import { describe, expect, it } from "vitest";
import { alignStock, type StockCell } from "@/lib/products/stock-grid";

const rose = { key: "c1", name: "Rose", hex: "#e8b4b8" };
const bleu = { key: "c2", name: "Bleu", hex: "#1f3a5f" };

describe("alignStock", () => {
  it("crée une case vide par taille sans couleur", () => {
    expect(alignStock([], ["8 ans", "10 ans"], [])).toEqual([
      { colorKey: null, size: "8 ans", quantity: 0, price: "" },
      { colorKey: null, size: "10 ans", quantity: 0, price: "" },
    ]);
  });

  it("garde ce qui est saisi et range couleur par couleur", () => {
    const stock: StockCell[] = [{ colorKey: "c2", size: "8 ans", quantity: 3, price: "52" }];
    expect(alignStock([rose, bleu], ["8 ans"], stock)).toEqual([
      { colorKey: "c1", size: "8 ans", quantity: 0, price: "" },
      { colorKey: "c2", size: "8 ans", quantity: 3, price: "52" },
    ]);
  });

  it("reporte le stock sans couleur sur la première couleur ajoutée", () => {
    const stock: StockCell[] = [{ colorKey: null, size: "8 ans", quantity: 2, price: "" }];
    expect(alignStock([rose, bleu], ["8 ans"], stock)).toEqual([
      { colorKey: "c1", size: "8 ans", quantity: 2, price: "" },
      { colorKey: "c2", size: "8 ans", quantity: 0, price: "" },
    ]);
  });

  it("revient sans couleur en gardant le stock d'une couleur", () => {
    const stock: StockCell[] = [{ colorKey: "c1", size: "8 ans", quantity: 2, price: "40" }];
    expect(alignStock([], ["8 ans"], stock)).toEqual([
      { colorKey: null, size: "8 ans", quantity: 2, price: "40" },
    ]);
  });

  it("oublie une taille retirée", () => {
    const stock: StockCell[] = [
      { colorKey: null, size: "8 ans", quantity: 2, price: "" },
      { colorKey: null, size: "10 ans", quantity: 1, price: "" },
    ];
    expect(alignStock([], ["10 ans"], stock)).toEqual([
      { colorKey: null, size: "10 ans", quantity: 1, price: "" },
    ]);
  });
});
