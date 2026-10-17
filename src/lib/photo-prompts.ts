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

/** Un âge de mannequin proposé dans l'admin. */
export type ModelAge = {
  id: string;
  label: string;
  /** Tel qu'écrit dans le prompt : « around 6 years old ». */
  words: string;
  /**
   * Faux pour un bébé qui ne tient pas encore debout seul : la photo portée
   * le montre assis. Un nourrisson debout, l'IA le dessine, et c'est faux.
   */
  stands: boolean;
};

/**
 * Origine du mannequin, choisie à l'admin. La boutique habille des enfants
 * de toutes origines ; un seul visage sur tout le catalogue ne leur ressemble
 * pas.
 *
 * Peau et cheveux sont écrits ensemble, par rayon : laissés à l'IA, ils
 * dérivent vers le même enfant d'une photo à l'autre, quelle que soit
 * l'origine demandée.
 */
export type ModelLook = {
  id: string;
  label: string;
  /** Tel qu'écrit dans le prompt : « a Black girl ». */
  people: string;
  skin: string;
  /** Par rayon : écrit à part de `PhotoSubject`, qui dépend de ce type. */
  hair: Record<"bebe" | "fille" | "garcon", string>;
};

export const MODEL_LOOKS: ModelLook[] = [
  {
    id: "europeen",
    label: "Européen",
    people: "white European",
    skin: "light skin",
    hair: { bebe: "fine light hair", fille: "long brown hair", garcon: "short light brown hair" },
  },
  {
    id: "noir",
    label: "Noir",
    people: "Black",
    skin: "deep brown skin",
    hair: {
      bebe: "short soft black curls",
      fille: "natural black hair in neat braids",
      garcon: "short black coily hair",
    },
  },
  {
    id: "metis",
    label: "Métis",
    people: "mixed-race (Black and white)",
    skin: "warm light brown skin",
    hair: { bebe: "soft dark curls", fille: "long dark curly hair", garcon: "short dark curly hair" },
  },
  {
    id: "maghrebin",
    label: "Maghrébin",
    people: "North African",
    skin: "olive skin",
    hair: {
      bebe: "fine dark hair",
      fille: "long wavy dark brown hair",
      garcon: "short dark brown hair",
    },
  },
];

/** Origine retenue quand aucune n'est choisie : le rendu d'avant le choix. */
export const DEFAULT_LOOK = "europeen";

type SubjectSpec = {
  label: string;
  ages: ModelAge[];
  /** Âge proposé d'office quand on choisit ce mannequin. */
  defaultAge: string;
  /** Le mannequin, à l'âge et à l'origine choisis. */
  person: (age: string, look: ModelLook) => string;
  pose: string;
  /** Pose de la photo portée pour un bébé qui ne tient pas debout. */
  seatedPose: string;
  closePose: string;
};

const CHILD_AGES: ModelAge[] = [
  { id: "3-ans", label: "3 ans", words: "around 3 years old", stands: true },
  { id: "6-ans", label: "6 ans", words: "around 6 years old", stands: true },
  { id: "10-ans", label: "10 ans", words: "around 10 years old", stands: true },
  { id: "13-ans", label: "13 ans", words: "around 13 years old", stands: true },
  { id: "16-ans", label: "16 ans", words: "around 16 years old", stands: true },
];

/** Rayons de la boutique, avec le mannequin que chacun appelle. */
export const PHOTO_SUBJECTS = {
  bebe: {
    label: "Bébé 0-24 mois",
    ages: [
      { id: "6-mois", label: "6 mois", words: "around 6 months old", stands: false },
      { id: "12-mois", label: "12 mois", words: "around 12 months old", stands: false },
      { id: "18-mois", label: "18 mois", words: "around 18 months old", stands: true },
      { id: "24-mois", label: "24 mois", words: "around 2 years old", stands: true },
    ],
    defaultAge: "18-mois",
    person: (age, look) => `a ${look.people} baby, ${age}, ${look.skin} and ${look.hair.bebe}`,
    pose: "Standing on their own, feet slightly apart, arms relaxed, genuinely smiling at the camera with a natural open baby smile — happy, unposed, candid.",
    seatedPose:
      "Sitting on the floor the way a baby sits, legs loosely in front, steady and upright, looking at the camera with a natural open baby smile — happy, unposed, candid.",
    closePose:
      "Sitting on the floor the way a baby sits, legs folded loosely in front, looking up at the camera and laughing openly — a real unposed baby smile.",
  },
  fille: {
    label: "Fille 2-16 ans",
    ages: CHILD_AGES,
    defaultAge: "10-ans",
    person: (age, look) => `a ${look.people} girl, ${age}, ${look.skin} and ${look.hair.fille}`,
    pose: "Standing relaxed facing the camera, weight on one leg, arms loose, calm natural expression with a faint easy smile. Age-appropriate and unforced — a child standing naturally, not posing like an adult model.",
    seatedPose: "",
    closePose:
      "Head slightly turned, chin level, calm natural expression looking just past the camera.",
  },
  garcon: {
    label: "Garçon 2-16 ans",
    ages: CHILD_AGES,
    defaultAge: "10-ans",
    person: (age, look) => `a ${look.people} boy, ${age}, ${look.skin} and ${look.hair.garcon}`,
    pose: "Standing relaxed facing the camera, weight on one leg, hands loose or one in pocket, calm natural expression looking slightly off-camera. Age-appropriate and unforced.",
    seatedPose: "",
    closePose:
      "Head slightly turned, chin level, calm natural expression looking just past the camera.",
  },
} satisfies Record<string, SubjectSpec>;

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
  /** Identifiant d'âge (« 6-ans ») ; absent ou inconnu : l'âge par défaut. */
  age?: string;
  /** Identifiant d'origine (« metis ») ; absent ou inconnu : `DEFAULT_LOOK`. */
  look?: string;
  garment: PhotoGarment;
  /** Vide pour un article sans marque : la phrase s'écrit alors sans elle. */
  brand: string;
  productName: string;
};

/**
 * « Lanvin baskets curb » ou simplement « baskets curb ». Sans nom — la
 * photo peut être générée avant que la fiche soit remplie —, le mot générique
 * suffit : c'est l'image de référence qui dit à l'IA de quoi il s'agit.
 */
function subjectOf(brand: string, productName: string, generic = "item"): string {
  const name = productName.trim().toLowerCase() || generic;
  return brand ? `${brand} ${name}` : name;
}

/** Le mannequin à l'âge et à l'origine choisis, et la pose qu'il peut tenir. */
function modelOf(subject: PhotoSubject, ageId: string | undefined, lookId: string | undefined) {
  const spec: SubjectSpec = PHOTO_SUBJECTS[subject];
  const age =
    spec.ages.find((entry) => entry.id === ageId) ??
    spec.ages.find((entry) => entry.id === spec.defaultAge) ??
    spec.ages[0];
  const look =
    MODEL_LOOKS.find((entry) => entry.id === lookId) ??
    MODEL_LOOKS.find((entry) => entry.id === DEFAULT_LOOK) ??
    MODEL_LOOKS[0];
  return {
    person: spec.person(age.words, look),
    stands: age.stands,
    pose: age.stands ? spec.pose : spec.seatedPose,
    closePose: spec.closePose,
  };
}

/** Plan complet : la vue révélée au survol d'une carte produit. */
export function buildFullShotPrompt({
  subject,
  age,
  look,
  garment,
  brand,
  productName,
}: PromptInput): string {
  const s = modelOf(subject, age, look);
  const g = PHOTO_GARMENTS[garment];

  return [
    `Full-body editorial fashion photograph of ${s.person}, wearing the ${subjectOf(brand, productName)} from the reference image — reproduce the garment exactly: same colour, fabric and proportions, including ${g.detail}. Styled ${g.styling}.`,
    s.pose,
    DECOR,
    `${STYLE} Vertical framing, full body in frame with headroom and space at the bottom for caption text. --ar 2:3`,
  ].join("\n\n");
}

/** Gros plan : la vue affichée au repos. */
export function buildCloseShotPrompt({
  subject,
  age,
  look,
  garment,
  brand,
  productName,
}: PromptInput): string {
  const s = modelOf(subject, age, look);
  const g = PHOTO_GARMENTS[garment];

  // Les chaussures se photographient sans modèle : le cadrage rapproché est un
  // packshot, pas un portrait.
  const framing =
    garment === "chaussures"
      ? `Close-up product photograph of the ${subjectOf(brand, productName)} from the reference image — ${g.closeFraming}. Reproduce the pair exactly: ${g.detail}. Nothing else in shot — no box, no props, no hands.`
      : `Close-up editorial fashion photograph of the same ${s.person}, wearing the ${subjectOf(brand, productName)} from the reference image — ${g.closeFraming}. Reproduce the garment exactly, including ${g.detail}.`;

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
 * Porté de trois-quarts, en mouvement : le deuxième angle porté de la série
 * de quatre. Le vêtement est vu de côté, jamais de dos — l'IA n'a que la face
 * sur la photo de référence, et un dos inventé serait un mensonge sur l'article.
 */
export function buildThreeQuarterShotPrompt({
  subject,
  age,
  look,
  garment,
  brand,
  productName,
}: PromptInput): string {
  const s = modelOf(subject, age, look);
  const g = PHOTO_GARMENTS[garment];

  // Un bébé qui ne marche pas encore ne passe pas devant l'objectif : il est
  // assis, tourné de trois-quarts.
  const angle = s.stands
    ? "body turned three-quarters to the side, caught walking slowly past the camera, head turned back towards the lens"
    : "sitting on the floor, body turned three-quarters to the side, reaching out with one hand, head turned towards the lens";
  const movement = s.stands
    ? "Natural relaxed movement, one foot lifted mid-step, arms swinging loosely, a faint easy smile. Age-appropriate and unforced. The front and side of the garment stay visible; never show the back."
    : "Natural, curious, unposed — a real baby moment. The front and side of the garment stay visible; never show the back.";

  return [
    `Full-body editorial fashion photograph of the same ${s.person}, wearing the ${subjectOf(brand, productName)} from the reference image, ${angle} — reproduce the garment exactly: same colour, fabric and proportions, including ${g.detail}. Styled ${g.styling}.`,
    movement,
    DECOR,
    `${STYLE} Vertical framing, full body in frame with headroom. --ar 2:3`,
  ].join("\n\n");
}

/**
 * Détail en très gros plan, sans modèle : la matière et la signature de la
 * marque, ce qu'une cliente regarderait de près en boutique.
 */
export function buildDetailShotPrompt({
  garment,
  brand,
  productName,
}: Pick<PromptInput, "garment" | "brand" | "productName">): string {
  const g = PHOTO_GARMENTS[garment];

  return [
    `Macro detail photograph of the ${subjectOf(brand, productName)} from the reference image — a tight crop on its most distinctive detail: ${g.detail}. Reproduce it exactly: true colour, fabric texture, stitching, and any logo at its exact typography.`,
    "The detail fills the frame, sharp where it matters, softly falling out of focus at the edges. No model, no hands, no props.",
    DECOR,
    `${STYLE} Vertical framing. --ar 2:3`,
  ].join("\n\n");
}

/**
 * Prises de vue. Chacune a son prompt, parce que chacune demande autre
 * chose : un packshot doit être net d'un bout à l'autre et centré, une photo
 * portée doit tenir un modèle et une pose crédibles.
 */
export type GenerationMode =
  | "chaussures"
  | "vetement"
  | "accessoire"
  | "outlet"
  | "porte"
  | "porte-trois-quarts"
  | "gros-plan"
  | "detail"
  | "invisible"
  | "cintre"
  | "plie"
  | "scene"
  | "recolor";

/** Libellé de chaque prise de vue, y compris celles réservées à la série. */
export const SHOT_LABELS: Record<GenerationMode, string> = {
  chaussures: "Chaussures",
  vetement: "Vêtement",
  accessoire: "Accessoire",
  outlet: "Outlet",
  porte: "Porté de face",
  "porte-trois-quarts": "Porté de trois-quarts",
  "gros-plan": "Gros plan porté",
  detail: "Détail",
  invisible: "Mannequin invisible",
  cintre: "Sur cintre",
  plie: "Plié à plat",
  scene: "Posé dans le studio",
  recolor: "Autre couleur",
};

/** La photo « produit seul » qui convient au type d'article. */
export function aloneShot(garment: PhotoGarment): GenerationMode {
  return garment === "chaussures" ? "chaussures" : garment === "accessoire" ? "accessoire" : "vetement";
}

/** Packshot d'une paire de chaussures : pas de modèle, netteté totale. */
export function buildShoePackshotPrompt({
  brand,
  productName,
}: Pick<PromptInput, "brand" | "productName">): string {
  return [
    `E-commerce product photograph of a pair of ${subjectOf(brand, productName, "shoes")} from the reference image, both shoes shown together in three-quarter front view, angled slightly to the right, one set a little forward and the other just behind and overlapping it, both standing level — reproduce the shoes exactly: materials, panels, laces, perforations, midsole, heel tab, stitching and every logo at its exact size and position.`,
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

/*
 * Mises en scène sans mannequin. Pas de personne dans le cadre, mais le même
 * studio ou le même fond que les packshots : la grille reste une seule séance.
 */

/** Mannequin invisible : la forme portée, sans personne dedans. */
export function buildGhostMannequinPrompt({
  garment,
  brand,
  productName,
}: Pick<PromptInput, "garment" | "brand" | "productName">): string {
  const g = PHOTO_GARMENTS[garment];
  return [
    `Ghost mannequin e-commerce photograph of the ${subjectOf(brand, productName)} from the reference image — the garment shown front-on with the natural three-dimensional shape of being worn, but with no person, no mannequin and no hanger visible: hollow neckline and sleeves showing the inside of the garment. Reproduce it exactly, including ${g.detail}.`,
    "Plain very pale grey seamless background, no texture, no visible floor line. Even soft studio daylight, flat and shadowless. Shot on 85mm, everything in sharp focus, true-to-life colours and visible fabric texture.",
    `${STYLE} Centred, generous even margin around the garment. --ar 2:3`,
  ].join("\n\n");
}

/** Sur cintre, contre le mur du studio. */
export function buildHangerPrompt({
  garment,
  brand,
  productName,
}: Pick<PromptInput, "garment" | "brand" | "productName">): string {
  const g = PHOTO_GARMENTS[garment];
  return [
    `Editorial still-life photograph of the ${subjectOf(brand, productName)} from the reference image, hanging on a plain light wooden hanger against the wall, front facing the camera, falling naturally — reproduce it exactly, including ${g.detail}. No person, no hands, nothing else in frame.`,
    DECOR,
    `${STYLE} Vertical framing, the garment centred with space above the hanger. --ar 2:3`,
  ].join("\n\n");
}

/** Plié à plat, vu du dessus. */
export function buildFoldedPrompt({
  garment,
  brand,
  productName,
}: Pick<PromptInput, "garment" | "brand" | "productName">): string {
  const g = PHOTO_GARMENTS[garment];
  return [
    `Editorial still-life photograph of the ${subjectOf(brand, productName)} from the reference image, neatly folded and laid on the floor, shot straight from above, the front and any logo clearly visible on top — reproduce it exactly, including ${g.detail}. No person, no hands, no props.`,
    DECOR,
    `${STYLE} Vertical framing, the folded piece centred with a generous margin. --ar 2:3`,
  ].join("\n\n");
}

/** Posé dans le studio : l'article seul, au sol, dans le décor du site. */
export function buildStudioScenePrompt({
  garment,
  brand,
  productName,
}: Pick<PromptInput, "garment" | "brand" | "productName">): string {
  const g = PHOTO_GARMENTS[garment];
  return [
    `Editorial still-life photograph of the ${subjectOf(brand, productName, garment === "chaussures" ? "shoes" : "item")} from the reference image, placed naturally on the floor against the wall, seen at a three-quarter angle slightly from above — reproduce it exactly, including ${g.detail}. No person, no hands, nothing else in frame.`,
    DECOR,
    `${STYLE} Vertical framing, the item in the lower half of the frame with the wall rising behind it. --ar 2:3`,
  ].join("\n\n");
}

/**
 * Même photo, autre couleur : l'image de référence est reprise telle quelle,
 * seule la couleur de l'article change. C'est ce qui permet de décliner une
 * série déjà faite dans chaque couleur de la fiche sans refaire les poses.
 *
 * Le logo garde ses couleurs : une marque ne change pas de teinte avec la
 * pièce, et un logo recoloré serait un faux.
 */
export function buildRecolorPrompt({
  brand,
  productName,
  colorName,
  hex,
}: Pick<PromptInput, "brand" | "productName"> & { colorName: string; hex: string }): string {
  const item = subjectOf(brand, productName, "featured item");
  return [
    `Edit the reference photograph. Change only the colour of the ${item}: make it ${colorName} (${hex}), with a natural, realistic dye that follows the fabric's texture, folds and light.`,
    "Keep everything else exactly as it is: the same framing and crop, the same pose, model, face, hair and expression, the same background, lighting and shadows, every other piece of clothing, and the same garment shape, fabric texture, stitching, seams, zips, buttons, hardware and proportions.",
    "Logos, labels and brand patches keep their original colours, size and position. Do not add, remove or move anything. The result must read as the same photograph of the same item in another colourway.",
  ].join("\n\n");
}
