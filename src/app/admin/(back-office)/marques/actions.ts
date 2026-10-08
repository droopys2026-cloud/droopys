"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { brands, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import { slugify, uniqueSlug } from "@/lib/slug";

/** Création et suppression des marques. */

export type BrandFormState = { errors?: string[] };

const brandSchema = z.object({
  name: z.string().trim().min(1, "Le nom de la marque est obligatoire.").max(80),
  logoUrl: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  logoRatio: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : Number(value)))
    .refine((value) => value === undefined || (Number.isFinite(value) && value > 0), {
      message: "Le rapport du logo doit être un nombre positif.",
    })
    .optional(),
});

export async function createBrand(
  _state: BrandFormState,
  formData: FormData,
): Promise<BrandFormState> {
  await requireAdmin();

  const parsed = brandSchema.safeParse({
    name: formData.get("name") ?? "",
    logoUrl: formData.get("logoUrl") ?? "",
    logoRatio: formData.get("logoRatio") ?? "",
  });
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const taken = new Set(
    (await db.query.brands.findMany({ columns: { slug: true } })).map(
      (row) => row.slug,
    ),
  );
  const slug = uniqueSlug(slugify(parsed.data.name), taken);

  const [last] = await db
    .select({ total: count() })
    .from(brands);

  await db.insert(brands).values({
    slug,
    name: parsed.data.name,
    logoUrl: parsed.data.logoUrl ?? null,
    logoRatio: parsed.data.logoRatio ?? null,
    position: last.total,
  });

  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/marques");
  revalidatePath("/marques");
  redirect("/admin/marques");
}

/**
 * Supprime une marque, sauf si elle porte encore des produits.
 *
 * La clé étrangère est en `restrict` : la base refuserait de toute façon. On
 * le dit ici en français plutôt que de laisser remonter une erreur Postgres —
 * et surtout, on ne propose pas une suppression en cascade qui emporterait le
 * catalogue d'une maison entière sur un clic.
 */
export async function deleteBrand(formData: FormData) {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("brandId"));
  if (!id.success) return;

  const [used] = await db
    .select({ total: count() })
    .from(products)
    .where(eq(products.brandId, id.data));

  if (used.total > 0) return;

  await db.delete(brands).where(eq(brands.id, id.data));
  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/marques");
  revalidatePath("/marques");
}
