/**
 * Génère les prompts photo d'un produit.
 *
 * Le paragraphe de décor est recopié tel quel d'un prompt à l'autre : c'est
 * lui, et non la pose, qui fait tenir toute la grille comme une seule séance.
 * Le reste change avec le vêtement et l'âge — voir docs/prompts-photo.md.
 */

/** Le décor commun. Ne pas le reformuler, même pour l'améliorer. */
const DECOR =
  "Plain pale off-white concrete wall, faintly textured and slightly uneven, with a matching pale concrete floor, filling the whole background. Even soft daylight, flat and shadowless, no flash, no visible shadow cast on the wall. Muted neutral palette: warm white, stone grey, beige, deep black. Nothing else in frame. Shot on 85mm, shallow depth of field, fine natural film grain, true-to-life skin tones and visible fabric texture.";

const STYLE = "Luxury e-commerce editorial style — quiet, refined, premium.";

/** Rayons de la boutique, avec le modèle que chacun appelle. */
export const PHOTO_SUBJECTS = {
  bebe: {
    label: "Bébé 0-24 mois",
    model:
      "a white European baby, around 18 months old, light skin and fine light hair",
    pose: "Standing on their own, feet slightly apart, arms relaxed, genuinely smiling at the camera with a natural open baby smile — happy, unposed, candid.",
    closePose:
      "Sitting on the floor the way a baby sits, legs folded loosely in front, looking up at the camera and laughing openly — a real unposed baby smile.",
  },
  fille: {
    label: "Fille 2-16 ans",
    model:
      "a white European girl, around 10 years old, light skin and long brown hair",
    pose: "Standing relaxed facing the camera, weight on one leg, arms loose, calm natural expression with a faint easy smile. Age-appropriate and unforced — a child standing naturally, not posing like an adult model.",
    closePose:
      "Head slightly turned, chin level, calm natural expression looking just past the camera.",
  },
  garcon: {
    label: "Garçon 2-16 ans",
    model:
      "a white European boy, around 10 years old, light skin and short light brown hair",
    pose: "Standing relaxed facing the camera, weight on one leg, hands loose or one in pocket, calm natural expression looking slightly off-camera. Age-appropriate and unforced.",
    closePose:
      "Head slightly turned, chin level, calm natural expression looking just past the camera.",
  },
} as const;

export type PhotoSubject = keyof typeof PHOTO_SUBJECTS;

/** Familles de vêtements. Chacune dicte son cadrage et son styling. */
export const PHOTO_GARMENTS = {
  manteau: {
    label: "Manteau, doudoune, parka",
    styling:
      "worn open over a plain tee or hooded sweatshirt, with straight-leg dark denim and clean white low-top sneakers",
    detail:
      "the quilting or weave, the collar, the zip and the brand patch at their exact size and position",
    closeFraming:
      "head and shoulders only, collar up, framed tight so the fabric, the stitching and the brand patch are large and fully legible",
  },
  haut: {
    label: "Haut, sweat, chemise",
    styling:
      "worn with straight-leg dark denim and clean white low-top sneakers",
    detail:
      "the knit or weave, the neckline, the sleeves and any chest logo at its exact size, typography and position",
    closeFraming:
      "head, shoulders and chest only, framed tight so the neckline and the chest logo are large and fully legible",
  },
  robe: {
    label: "Robe, jupe",
    styling: "worn on its own, with plain white leather shoes",
    detail:
      "the fabric, the sleeves, the waist seam, the skirt gathers and any chest logo at its exact size and position",
    closeFraming:
      "from the hem of the skirt up to just above the head, so the fabric and the logo are large and fully legible",
  },
  pantalon: {
    label: "Pantalon, jean, short",
    styling:
      "worn with a plain white tee tucked in and clean white low-top sneakers, so the trousers read as the subject of the photograph",
    detail: "the denim wash, the seams, the pockets and the waistband",
    closeFraming:
      "from mid-chest down to the shoes, so the cut, the seams and the pockets are large and fully legible",
  },
  chaussures: {
    label: "Chaussures",
    styling:
      "worn with straight-leg dark denim cropped just above the ankle, so the shoes read as the subject of the photograph",
    detail:
      "the panels, the laces, the perforations, the midsole and the heel tab",
    closeFraming:
      "the pair alone on the floor, side by side, shot slightly from above at a three-quarter angle, filling the frame",
  },
  accessoire: {
    label: "Accessoire (bonnet, sac, écharpe)",
    styling: "worn with a plain outfit in neutral tones",
    detail: "the material, the hardware and any logo at its exact position",
    closeFraming:
      "framed tight on the accessory so its material and hardware are large and fully legible",
  },
} as const;

export type PhotoGarment = keyof typeof PHOTO_GARMENTS;

export type PromptInput = {
  subject: PhotoSubject;
  garment: PhotoGarment;
  /** Vide pour un article sans marque : la phrase s'écrit alors sans elle. */
  brand: string;
  productName: string;
};

/** « Lanvin baskets curb » ou simplement « baskets curb ». */
function subjectOf(brand: string, productName: string): string {
  const name = productName.toLowerCase();
  return brand ? `${brand} ${name}` : name;
}

/** Plan complet : la vue révélée au survol d'une carte produit. */
export function buildFullShotPrompt({
  subject,
  garment,
  brand,
  productName,
}: PromptInput): string {
  const s = PHOTO_SUBJECTS[subject];
  const g = PHOTO_GARMENTS[garment];

  return [
    `Full-body editorial fashion photograph of ${s.model}, wearing the ${subjectOf(brand, productName)} from the reference image — reproduce the garment exactly: same colour, fabric and proportions, including ${g.detail}. Styled ${g.styling}.`,
    s.pose,
    DECOR,
    `${STYLE} Vertical framing, full body in frame with headroom and space at the bottom for caption text. --ar 2:3`,
  ].join("\n\n");
}

/** Gros plan : la vue affichée au repos. */
export function buildCloseShotPrompt({
  subject,
  garment,
  brand,
  productName,
}: PromptInput): string {
  const s = PHOTO_SUBJECTS[subject];
  const g = PHOTO_GARMENTS[garment];

  // Les chaussures se photographient sans modèle : le cadrage rapproché est un
  // packshot, pas un portrait.
  const framing =
    garment === "chaussures"
      ? `Close-up product photograph of the ${subjectOf(brand, productName)} from the reference image — ${g.closeFraming}. Reproduce the pair exactly: ${g.detail}. Nothing else in shot — no box, no props, no hands.`
      : `Close-up editorial fashion photograph of the same ${s.model}, wearing the ${subjectOf(brand, productName)} from the reference image — ${g.closeFraming}. Reproduce the garment exactly, including ${g.detail}.`;

  const pose = garment === "chaussures" ? "" : s.closePose;

  return [
    framing,
    pose,
    DECOR,
    `${STYLE} Vertical framing, generous space above the subject. --ar 2:3`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * Modes de génération. Chacun appelle une IA différente, parce que chacun
 * demande autre chose : un packshot doit être net d'un bout à l'autre et
 * centré, une photo portée doit tenir un modèle et une pose crédibles.
 */
export type GenerationMode =
  "chaussures" | "vetement" | "accessoire" | "outlet" | "porte";

export const GENERATION_MODES: {
  id: GenerationMode;
  label: string;
  hint: string;
}[] = [
  {
    id: "chaussures",
    label: "Chaussures",
    hint: "La paire seule, sans modèle",
  },
  {
    id: "vetement",
    label: "Vêtement",
    hint: "La pièce seule, à plat",
  },
  {
    id: "accessoire",
    label: "Accessoire",
    hint: "L'objet seul, de près",
  },
  {
    id: "outlet",
    label: "Outlet",
    hint: "Prise de vue simple et rapide",
  },
  {
    id: "porte",
    label: "Porté",
    hint: "Sur un mannequin, en pied",
  },
];

/** Packshot d'une paire de chaussures : pas de modèle, netteté totale. */
export function buildShoePackshotPrompt({
  brand,
  productName,
}: Pick<PromptInput, "brand" | "productName">): string {
  return [
    `E-commerce product photograph of a pair of ${subjectOf(brand, productName)} from the reference image, both shoes shown together in three-quarter front view, angled slightly to the right, one set a little forward and the other just behind and overlapping it, both standing level — reproduce the shoes exactly: materials, panels, laces, perforations, midsole, heel tab, stitching and every logo at its exact size and position.`,
    "The pair only, centred in the frame and seen from slightly above, nothing else in shot — no box, no props, no hands, no reflections.",
    "Plain very pale grey seamless background with a soft even gradient, no visible floor line or corner, no texture. Even soft studio daylight, flat, with only a faint contact shadow beneath each sole. Shot on 85mm, everything in sharp focus front to back, true-to-life colours and visible material texture.",
    `${STYLE} Generous even margin around the pair. --ar 2:3`,
  ].join("\n\n");
}

/** Packshot d'un vêtement : la pièce seule, sans modèle. */
export function buildGarmentPackshotPrompt({
  brand,
  productName,
}: Pick<PromptInput, "brand" | "productName">): string {
  return [
    `E-commerce product photograph of the ${subjectOf(brand, productName)} from the reference image, laid flat and shot straight from above, sleeves and hems arranged neatly and symmetrically — reproduce the garment exactly: colour, fabric, weave, seams, buttons, zips, pockets and every logo at its exact size, typography and position.`,
    "The garment only, centred and filling the frame, nothing else in shot — no hanger, no model, no props, no hands.",
    "Plain very pale grey seamless background, no texture, no visible floor line. Even soft studio daylight, flat and shadowless. Shot on 85mm, everything in sharp focus front to back, true-to-life colours and visible fabric texture.",
    `${STYLE} Generous even margin around the garment. --ar 2:3`,
  ].join("\n\n");
}

/** Photo portée : la seule qui met un modèle en scène. */
export function buildOnModelPrompt(input: PromptInput): string {
  return buildFullShotPrompt(input);
}

/** Packshot d'accessoire : l'objet seul, cadré serré sur sa matière. */
export function buildAccessoryPackshotPrompt({
  brand,
  productName,
}: Pick<PromptInput, "brand" | "productName">): string {
  return [
    `E-commerce product photograph of the ${subjectOf(brand, productName)} from the reference image, shown alone at a three-quarter angle, its front face clearly readable — reproduce the accessory exactly: material, weave or grain, hardware, stitching, straps or fastenings, and every logo at its exact size, typography and position.`,
    "The object only, centred and filling most of the frame, nothing else in shot — no model, no box, no props, no hands.",
    "Plain very pale grey seamless background, no texture, no visible floor line. Even soft studio daylight, flat, with only a faint contact shadow beneath the object. Shot on 85mm, everything in sharp focus front to back, true-to-life colours and visible material texture.",
    `${STYLE} Generous even margin around the object. --ar 2:3`,
  ].join("\n\n");
}

/**
 * Prise de vue outlet : le même studio, mais sans mise en scène. Une pièce en
 * fin de série se photographie vite et bien, pas comme une campagne.
 */
export function buildOutletPackshotPrompt({
  brand,
  productName,
}: Pick<PromptInput, "brand" | "productName">): string {
  return [
    `Simple e-commerce product photograph of the ${subjectOf(brand, productName)} from the reference image, shown straight on, flat and centred — reproduce the item exactly as it is: colour, fabric, seams, fastenings and every logo at its exact size and position. Show the item as it really looks, without styling or embellishment.`,
    "The item only, nothing else in shot — no model, no props, no hands, no reflections.",
    "Plain very pale grey seamless background, no texture, no visible floor line. Even soft studio daylight, flat and shadowless. Shot on 85mm, everything in sharp focus, true-to-life colours.",
    `${STYLE} Generous even margin around the item. --ar 2:3`,
  ].join("\n\n");
}
