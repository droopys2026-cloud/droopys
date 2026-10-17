import { describe, expect, it } from "vitest";
import {
  buildGarmentPackshotPrompt,
  buildRecolorPrompt,
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

describe("origine du mannequin", () => {
  const base = { garment: "haut", brand: "", productName: "" } as const;

  it("garde le mannequin européen par défaut", () => {
    expect(buildOnModelPrompt({ ...base, subject: "fille" })).toContain(
      "a white European girl, around 10 years old, light skin",
    );
  });

  it("écrit l'origine, la peau et les cheveux choisis", () => {
    expect(buildOnModelPrompt({ ...base, subject: "fille", look: "noir" })).toContain(
      "a Black girl, around 10 years old, deep brown skin and natural black hair in neat braids",
    );
    expect(buildOnModelPrompt({ ...base, subject: "garcon", look: "maghrebin" })).toContain(
      "a North African boy, around 10 years old, olive skin",
    );
    expect(buildOnModelPrompt({ ...base, subject: "bebe", look: "metis" })).toContain(
      "a mixed-race (Black and white) baby",
    );
  });

  it("retombe sur l'origine par défaut quand elle est inconnue", () => {
    expect(buildOnModelPrompt({ ...base, subject: "garcon", look: "inconnue" })).toContain(
      "a white European boy",
    );
  });
});

describe("même photo, autre couleur", () => {
  const prompt = buildRecolorPrompt({
    brand: "Moncler",
    productName: "Doudoune Maya",
    colorName: "Rouge",
    hex: "#c0282d",
  });

  it("ne change que la couleur de l'article, vers la teinte choisie", () => {
    expect(prompt).toContain("Change only the colour of the Moncler doudoune maya: make it Rouge (#c0282d)");
  });

  it("garde le logo dans ses couleurs d'origine", () => {
    expect(prompt).toContain("Logos, labels and brand patches keep their original colours");
  });
});
