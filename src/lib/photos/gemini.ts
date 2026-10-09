import "server-only";

import { z } from "zod";
import { serverEnv } from "@/lib/env";

/**
 * Génération d'une photo produit par Gemini, à partir de la photo réelle de
 * l'article (l'« image de référence ») et d'un prompt de `@/lib/photo-prompts`.
 *
 * Le meilleur modèle d'image disponible sur la clé : la fidélité au vêtement
 * — couleur, matière, logo à sa place — prime sur la vitesse et le coût.
 */
const MODEL = "gemini-3-pro-image";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/** Une image prend 20 à 60 s ; au-delà de deux minutes, c'est une panne. */
const TIMEOUT_MS = 120_000;

export type GeneratedPhoto = { mimeType: string; base64: string };

export type GenerationResult =
  | { status: "ok"; photo: GeneratedPhoto }
  | { status: "error"; message: string };

const responseSchema = z.object({
  candidates: z
    .array(
      z.object({
        finishReason: z.string().optional(),
        content: z
          .object({
            parts: z.array(
              z.object({
                text: z.string().optional(),
                inlineData: z.object({ mimeType: z.string(), data: z.string() }).optional(),
              }),
            ),
          })
          .optional(),
      }),
    )
    .optional(),
  promptFeedback: z.object({ blockReason: z.string().optional() }).optional(),
});

const errorSchema = z.object({
  error: z.object({ code: z.number(), status: z.string(), message: z.string() }),
});

export async function generatePhoto(
  references: { mimeType: string; base64: string }[],
  prompt: string,
): Promise<GenerationResult> {
  const key = serverEnv.GEMINI_API_KEY;
  if (!key) return { status: "error", message: "La clé Gemini n'est pas configurée." };

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            ...references.map((reference) => ({
              inline_data: { mime_type: reference.mimeType, data: reference.base64 },
            })),
            { text: prompt },
          ],
        },
      ],
      // Vertical 2:3 : le seul format que les cartes et la fiche produit
      // attendent (voir docs/prompts-photo.md).
      generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "2:3" } },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const body: unknown = await response.json();

  if (!response.ok) {
    const parsed = errorSchema.safeParse(body);
    const detail = parsed.success ? parsed.data.error : null;
    console.error(`Gemini ${response.status} :`, detail?.message ?? body);
    // Le cas le plus probable : un projet Google sans facturation, dont le
    // quota gratuit des modèles d'image est à zéro.
    if (detail?.status === "RESOURCE_EXHAUSTED") {
      return {
        status: "error",
        message:
          "Quota Google atteint. Si c'est la première génération, la facturation n'est pas activée sur le projet Google (Google AI Studio → Set up billing).",
      };
    }
    return { status: "error", message: "Google n'a pas pu générer la photo. Réessayez dans un instant." };
  }

  const parsed = responseSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Gemini : réponse inattendue", parsed.error.issues);
    return { status: "error", message: "Réponse inattendue de Google." };
  }

  const image = parsed.data.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => part.inlineData)?.inlineData;

  if (!image) {
    const reason =
      parsed.data.promptFeedback?.blockReason ?? parsed.data.candidates?.[0]?.finishReason ?? "inconnue";
    console.error(`Gemini : aucune image rendue (raison : ${reason})`);
    return {
      status: "error",
      message:
        "Google n'a pas rendu d'image pour cette photo. Essayez une photo plus nette de l'article, ou un autre mode.",
    };
  }

  return { status: "ok", photo: { mimeType: image.mimeType, base64: image.data } };
}
