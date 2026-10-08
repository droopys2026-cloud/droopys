import { describe, expect, it } from "vitest";
import { socialLinks } from "@/lib/social";

describe("socialLinks", () => {
  it("garde les comptes renseignés, dans l'ordre", () => {
    expect(
      socialLinks({ tiktok: "https://tiktok.com/@droopys", instagram: "https://instagram.com/droopys" }).map((l) => l.network),
    ).toEqual(["instagram", "tiktok"]);
  });
  it("ignore un champ sans https", () => {
    expect(
      socialLinks({ instagram: "https://instagram.com/droopys", facebook: "facebook.com/droopys" }).map((l) => l.network),
    ).toEqual(["instagram"]);
  });
  it("retombe sur les trois réseaux quand rien n'est saisi", () => {
    expect(socialLinks({}).map((l) => l.network)).toEqual(["instagram", "facebook", "tiktok"]);
  });
});
