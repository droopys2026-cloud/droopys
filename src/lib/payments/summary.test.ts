import { describe, expect, it } from "vitest";
import { summarizeMovements } from "@/lib/payments/summary";

const charge = (amount: number, fee: number) => ({
  amount, fee, net: amount - fee, currency: "eur", reporting_category: "charge",
});

describe("summarizeMovements", () => {
  it("additionne encaissements, frais et net", () => {
    expect(summarizeMovements([charge(10_000, 165), charge(5_000, 100)])).toEqual({
      grossCents: 15_000, feesCents: 265, refundedCents: 0, netCents: 14_735, paymentCount: 2,
    });
  });

  it("déduit les remboursements du net", () => {
    const refund = { amount: -5_000, fee: 0, net: -5_000, currency: "eur", reporting_category: "refund" };
    const summary = summarizeMovements([charge(10_000, 165), refund]);
    expect(summary.refundedCents).toBe(5_000);
    expect(summary.netCents).toBe(4_835);
  });

  it("ignore les virements et les autres devises", () => {
    const payout = { amount: -9_000, fee: 0, net: -9_000, currency: "eur", reporting_category: "payout" };
    const usd = { ...charge(10_000, 300), currency: "usd" };
    expect(summarizeMovements([payout, usd]).paymentCount).toBe(0);
  });
});
