import { describe, expect, it } from "vitest";
import {
  buildGarmentPackshotPrompt,
  buildOnModelPrompt,
  buildShoePackshotPrompt,
} from "@/lib/photo-prompts";

describe("prompts photo sans nom de produit", () => {
  it("parle d'une paire de chaussures plutôt que d'un nom vide", () => {
    const prompt = buildShoePackshotPrompt({ brand: "", productName: "" });
    expect(prompt).toContain("a pair of shoes from the reference image");
  });

  it("garde la marque devant le mot générique", () => {
    const prompt = buildGarmentPackshotPrompt({ brand: "Moncler", productName: "  " });
    expect(prompt).toContain("the Moncler item from the reference image");
  });

  it("reprend le nom saisi quand il existe", () => {
    const prompt = buildOnModelPrompt({
      subject: "garcon",
      garment: "manteau",
      brand: "Moncler",
      productName: "Doudoune Maya",
    });
    expect(prompt).toContain("wearing the Moncler doudoune maya from the reference image");
  });
});

describe("âge du mannequin", () => {
  const base = { garment: "haut", brand: "", productName: "" } as const;

  it("écrit l'âge choisi dans le prompt", () => {
    expect(buildOnModelPrompt({ ...base, subject: "fille", age: "16-ans" })).toContain(
      "girl, around 16 years old",
    );
  });

  it("retombe sur l'âge par défaut quand l'âge est inconnu", () => {
    expect(buildOnModelPrompt({ ...base, subject: "garcon", age: "99-ans" })).toContain(
      "boy, around 10 years old",
    );
  });

  it("assoit un bébé qui ne tient pas encore debout", () => {
    const prompt = buildOnModelPrompt({ ...base, subject: "bebe", age: "6-mois" });
    expect(prompt).toContain("around 6 months old");
    expect(prompt).toContain("Sitting on the floor");
    expect(prompt).not.toContain("Standing on their own");
  });
});
