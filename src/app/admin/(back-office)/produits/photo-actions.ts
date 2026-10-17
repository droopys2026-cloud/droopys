"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  MODEL_LOOKS,
  PHOTO_GARMENTS,
  PHOTO_SUBJECTS,
  SHOT_LABELS,
  buildAccessoryPackshotPrompt,
  buildCloseShotPrompt,
  buildDetailShotPrompt,
  buildFoldedPrompt,
  buildGarmentPackshotPrompt,
  buildGhostMannequinPrompt,
  buildHangerPrompt,
  buildOnModelPrompt,
  buildRecolorPrompt,
  buildStudioScenePrompt,
  buildThreeQuarterShotPrompt,
  buildOutletPackshotPrompt,
  buildShoePackshotPrompt,
  type PhotoGarment,
  type PhotoSubject,
} from "@/lib/photo-prompts";
import { generatePhoto, type GenerationResult } from "@/lib/photos/gemini";
import { keepGeneratedPhoto } from "@/lib/photos/library";

/**
 * « Générer une photo » de la fiche produit.
 *
 * La photo réelle de l'article part avec la demande : c'est elle que l'IA
 * doit reproduire. Le résultat revient en base64 et rejoint, côté
 * navigateur, les photos en attente — rien n'est stocké tant que la fiche
 * n'est pas enregistrée, comme pour une photo déposée à la main.
 */

/** Une photo de 2000 px en WebP pèse bien moins ; au-delà, ce n'en est pas une. */
const MAX_REFERENCE_BYTES = 1_800_000;
const MAX_REFERENCES = 2;

const garmentField = z.custom<PhotoGarment>(
  (value) => typeof value === "string" && Object.hasOwn(PHOTO_GARMENTS, value),
);

const inputSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.enum(["chaussures", "vetement", "accessoire", "outlet"]),
  }),
  // Le détail n'a pas de mannequin : seul le type d'article compte.
  // Sans mannequin : seul le type d'article compte.
  z.object({
    mode: z.enum(["detail", "invisible", "cintre", "plie", "scene"]),
    garment: garmentField,
  }),
  z.object({
    mode: z.enum(["porte", "porte-trois-quarts", "gros-plan"]),
    subject: z.custom<PhotoSubject>(
      (value) =>
        typeof value === "string" && Object.hasOwn(PHOTO_SUBJECTS, value),
    ),
    // Vérifié contre la liste du mannequin dans `@/lib/photo-prompts` : un âge
    // inconnu y retombe sur l'âge par défaut.
    age: z.string().max(20).optional(),
    // Même règle : une origine inconnue retombe sur l'origine par défaut.
    look: z.string().max(20).optional(),
    garment: garmentField,
  }),
  // Même photo, autre couleur : la couleur visée suffit.
  z.object({
    mode: z.literal("recolor"),
    colorName: z.string().trim().min(1).max(60),
    hex: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),
]);

const productSchema = z.object({
  brand: z.string().trim().max(80),
  // Facultatif : sans nom, le prompt parle de « l'article » et l'IA se
  // repère sur la photo de référence.
  productName: z.string().trim().max(120),
});

export async function generateProductPhoto(
  formData: FormData,
): Promise<GenerationResult> {
  await requireAdmin();

  // Une ou deux photos de l'article — face et dos, typiquement.
  const references = formData
    .getAll("reference")
    .filter(
      (entry): entry is File =>
        entry instanceof File && entry.type.startsWith("image/"),
    );
  if (references.length === 0 || references.length > MAX_REFERENCES) {
    return {
      status: "error",
      message: "Déposez une ou deux photos de l'article.",
    };
  }
  if (references.some((file) => file.size > MAX_REFERENCE_BYTES)) {
    return {
      status: "error",
      message: "Une photo de référence est trop lourde.",
    };
  }

  const product = productSchema.safeParse({
    brand: formData.get("brand") ?? "",
    productName: formData.get("productName") ?? "",
  });
  if (!product.success) {
    return {
      status: "error",
      message: product.error.issues[0]?.message ?? "Fiche incomplète.",
    };
  }

  const input = inputSchema.safeParse({
    mode: formData.get("mode"),
    subject: formData.get("subject") ?? undefined,
    garment: formData.get("garment") ?? undefined,
    age: formData.get("age") ?? undefined,
    look: formData.get("look") ?? undefined,
    colorName: formData.get("colorName") ?? undefined,
    hex: formData.get("hex") ?? undefined,
  });
  if (!input.success)
    return { status: "error", message: "Mode de génération inconnu." };

  const { brand, productName } = product.data;
  const mode = input.data;
  const shot = promptFor(mode, brand, productName);

  // Deux photos : l'IA doit comprendre qu'il s'agit du même article vu de
  // deux côtés, pas de deux articles à combiner.
  const prompt =
    references.length > 1
      ? `${shot}\n\nBoth reference photographs show the same item from different sides — use them together to reproduce it faithfully, and never combine it with anything else.`
      : shot;

  const images = await Promise.all(
    references.map(async (file) => ({
      mimeType: file.type,
      base64: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })),
  );
  const result = await generatePhoto(images, prompt);

  // Archivée dans Admin → Photos IA avant même l'enregistrement de la fiche.
  // Un archivage raté ne prive pas la boutique de sa photo : il est signalé
  // dans les journaux, et la photo reste utilisable dans la fiche.
  if (result.status === "ok") {
    try {
      await keepGeneratedPhoto(result.photo, {
        shot: shotDescription(mode),
        brand,
        productName,
      });
      revalidatePath("/admin/photos-ia");
    } catch (failure) {
      console.error("Photos IA :", failure);
    }
  }
  return result;
}

/** « Porté de face — Fille, 10 ans » : ce que la bibliothèque affiche. */
function shotDescription(mode: z.infer<typeof inputSchema>): string {
  if (mode.mode === "recolor") return `${SHOT_LABELS.recolor} — ${mode.colorName}`;
  if (
    mode.mode !== "porte" &&
    mode.mode !== "porte-trois-quarts" &&
    mode.mode !== "gros-plan"
  ) {
    return SHOT_LABELS[mode.mode];
  }
  const subject = PHOTO_SUBJECTS[mode.subject];
  const age = subject.ages.find((entry) => entry.id === mode.age)?.label;
  const look = MODEL_LOOKS.find((entry) => entry.id === mode.look)?.label.toLowerCase();
  return `${SHOT_LABELS[mode.mode]} — ${subject.label.split(" ")[0]}${age ? `, ${age}` : ""}${look ? `, ${look}` : ""}`;
}

/** Le prompt de chaque prise de vue — voir `@/lib/photo-prompts`. */
function promptFor(
  mode: z.infer<typeof inputSchema>,
  brand: string,
  productName: string,
): string {
  const product = { brand, productName };
  switch (mode.mode) {
    case "porte":
      return buildOnModelPrompt({
        ...product,
        subject: mode.subject,
        age: mode.age,
        look: mode.look,
        garment: mode.garment,
      });
    case "porte-trois-quarts":
      return buildThreeQuarterShotPrompt({
        ...product,
        subject: mode.subject,
        age: mode.age,
        look: mode.look,
        garment: mode.garment,
      });
    case "gros-plan":
      return buildCloseShotPrompt({
        ...product,
        subject: mode.subject,
        age: mode.age,
        look: mode.look,
        garment: mode.garment,
      });
    case "detail":
      return buildDetailShotPrompt({ ...product, garment: mode.garment });
    case "invisible":
      return buildGhostMannequinPrompt({ ...product, garment: mode.garment });
    case "cintre":
      return buildHangerPrompt({ ...product, garment: mode.garment });
    case "plie":
      return buildFoldedPrompt({ ...product, garment: mode.garment });
    case "scene":
      return buildStudioScenePrompt({ ...product, garment: mode.garment });
    case "chaussures":
      return buildShoePackshotPrompt(product);
    case "vetement":
      return buildGarmentPackshotPrompt(product);
    case "accessoire":
      return buildAccessoryPackshotPrompt(product);
    case "outlet":
      return buildOutletPackshotPrompt(product);
    case "recolor":
      return buildRecolorPrompt({ ...product, colorName: mode.colorName, hex: mode.hex });
  }
}
