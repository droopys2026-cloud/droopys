import { describe, expect, it } from "vitest";
import { readableInk } from "@/lib/products/color";

describe("readableInk", () => {
  it("écrit en blanc sur une teinte foncée", () => {
    expect(readableInk("#111111")).toBe("#ffffff");
    expect(readableInk("#1f2a44")).toBe("#ffffff");
    expect(readableInk("#6b6b3a")).toBe("#ffffff");
  });

  it("écrit en noir sur une teinte claire", () => {
    expect(readableInk("#ffffff")).toBe("#000000");
    expect(readableInk("#e8b4b8")).toBe("#000000");
    expect(readableInk("#ffd700")).toBe("#000000");
  });
});
