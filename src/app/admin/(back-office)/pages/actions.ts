"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { contentPages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import type { ContentBlock } from "@/types/content-page";

/**
 * Enregistrement d'une page de contenu.
 *
 * Les blocs arrivent en JSON : c'est une union discriminée que Postgres ne
 * saurait pas contraindre, donc c'est Zod qui la tient, ici, à la frontière.
 * Un bloc d'un `kind` inconnu ferait planter le rendu du site — il est
 * refusé avant d'entrer en base, pas découvert à l'affichage.
 */
const item = z.object({ title: z.string(), text: z.string() });

const blockSchema: z.ZodType<ContentBlock> = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("titre"), text: z.string() }),
  z.object({ kind: z.literal("paragraphe"), text: z.string() }),
  z.object({ kind: z.literal("liste"), items: z.array(z.string()) }),
  z.object({
    kind: z.literal("tableau"),
    caption: z.string().optional(),
    head: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({
    kind: z.literal("faq"),
    items: z.array(z.object({ question: z.string(), answer: z.string() })),
  }),
  z.object({ kind: z.literal("cartes"), items: z.array(item) }),
  z.object({ kind: z.literal("etapes"), items: z.array(item) }),
  z.object({ kind: z.literal("note"), text: z.string() }),
  z.object({
    kind: z.literal("appel"),
    label: z.string(),
    href: z.string(),
  }),
]);

const pageSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1, "Le titre est obligatoire."),
  lead: z.string().trim().min(1, "Le chapô est obligatoire."),
  imageUrl: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value)),
  toc: z.boolean(),
  footer: z.boolean(),
  blocks: z.array(blockSchema),
});

export type ContentPageState = { errors?: string[]; saved?: boolean };

export async function saveContentPage(
  _state: ContentPageState,
  formData: FormData,
): Promise<ContentPageState> {
  await requireAdmin();

  let blocks: unknown = [];
  try {
    blocks = JSON.parse(String(formData.get("blocks") ?? "[]"));
  } catch {
    return { errors: ["Contenu illisible : la page n'a pas été enregistrée."] };
  }

  const parsed = pageSchema.safeParse({
    slug: formData.get("slug") ?? "",
    title: formData.get("title") ?? "",
    lead: formData.get("lead") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    toc: formData.get("toc") === "on",
    footer: formData.get("footer") === "on",
    blocks,
  });

  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const { slug, ...values } = parsed.data;

  const updated = await db
    .update(contentPages)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(contentPages.slug, slug))
    .returning({ slug: contentPages.slug });

  if (updated.length === 0) return { errors: ["Cette page n'existe plus."] };

  revalidateTag(CACHE_TAGS.content, "max");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  // Le pied de page reprend les titres : il est présent sur tout le site.
  revalidatePath("/", "layout");
  return { saved: true };
}
