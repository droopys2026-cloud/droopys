import { describe, expect, it } from "vitest";
import { orderTotalCents } from "@/lib/orders/total";

describe("orderTotalCents", () => {
  it("retire la remise des articles et ajoute le port", () => {
    expect(
      orderTotalCents({
        lines: [{ unitPriceCents: 4500, quantity: 2 }],
        shippingCents: 690,
        discountCents: 500,
      }),
    ).toBe(9190);
  });
});
