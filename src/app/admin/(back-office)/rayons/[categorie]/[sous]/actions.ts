"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidateTaxonomy } from "@/app/admin/(back-office)/rayons/revalidate";
import { db } from "@/db";
import {
  categories,
  productPlacements,
  products,
  subcategories,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ImageUploadError, deleteImages, uploadImages } from "@/lib/images/upload";
import { TAXONOMY_BUCKET } from "@/lib/supabase/admin";
import type { SubcategoryFormState } from "@/app/admin/(back-office)/rayons/actions";

/**
 * Ce qui se règle sur la fiche d'un sous-rayon : son contenu éditorial et la
 * sélection d'articles qu'on y met en avant.
 */

const titleField = z
  .string()
  .trim()
  .min(1, "Le nom du sous-rayon est obligatoire.")
  .max(80);

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value));

/**
 * Met à jour un sous-rayon : titre, chapô, photo.
 *
 * L'ancienne photo n'est effacée qu'après l'enregistrement de la nouvelle. Si
 * l'envoi échoue, le sous-rayon garde celle qu'il avait plutôt que de se
 * retrouver sans image.
 */
export async function updateSubcategory(
  _state: SubcategoryFormState,
  formData: FormData,
): Promise<SubcategoryFormState> {
  await requireAdmin();

  const parsed = z
    .object({
      subcategoryId: z.string().uuid(),
      title: titleField,
      intro: optionalText,
      removeImage: z.boolean(),
    })
    .safeParse({
      subcategoryId: formData.get("subcategoryId") ?? "",
      title: formData.get("title") ?? "",
      intro: formData.get("intro") ?? "",
      removeImage: formData.get("removeImage") === "on",
    });
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const row = await db
    .select({
      id: subcategories.id,
      slug: subcategories.slug,
      imageUrl: subcategories.imageUrl,
      categorySlug: categories.slug,
    })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id))
    .where(eq(subcategories.id, parsed.data.subcategoryId))
    .limit(1);

  const current = row[0];
  if (!current) return { errors: ["Sous-rayon inconnu."] };

  const file = formData.get("photo");
  const hasFile = file instanceof File && file.size > 0;

  let imageUrl = current.imageUrl;
  if (hasFile) {
    try {
      const [uploaded] = await uploadImages(
        TAXONOMY_BUCKET,
        `${current.categorySlug}/${current.slug}`,
        [file],
      );
      imageUrl = uploaded;
    } catch (error) {
      if (error instanceof ImageUploadError) return { errors: [error.message] };
      throw error;
    }
  } else if (parsed.data.removeImage) {
    imageUrl = null;
  }

  await db
    .update(subcategories)
    .set({
      title: parsed.data.title,
      intro: parsed.data.intro ?? null,
      imageUrl,
    })
    .where(eq(subcategories.id, current.id));

  if (current.imageUrl && current.imageUrl !== imageUrl) {
    await deleteImages(TAXONOMY_BUCKET, [current.imageUrl]);
  }

  revalidateTaxonomy(current.categorySlug);
  revalidatePath(`/${current.categorySlug}/${current.slug}`);
  redirect(`/admin/rayons/${current.categorySlug}`);
}

/**
 * Fixe la sélection d'un sous-rayon : les articles qu'on y met en avant.
 *
 * La table est réécrite en entier plutôt que rapprochée ligne à ligne. Une
 * sélection n'a d'autre identité que son contenu et son ordre ; rapprocher
 * coûterait plus cher à lire qu'à exécuter, pour le même résultat.
 */
export async function setPlacements(
  _state: SubcategoryFormState,
  formData: FormData,
): Promise<SubcategoryFormState> {
  await requireAdmin();

  const parsed = z
    .object({
      subcategoryId: z.string().uuid(),
      productIds: z.array(z.string().uuid()),
    })
    .safeParse({
      subcategoryId: formData.get("subcategoryId") ?? "",
      productIds: formData.getAll("productIds"),
    });
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const row = await db
    .select({
      id: subcategories.id,
      slug: subcategories.slug,
      categorySlug: categories.slug,
    })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id))
    .where(eq(subcategories.id, parsed.data.subcategoryId))
    .limit(1);

  const current = row[0];
  if (!current) return { errors: ["Sous-rayon inconnu."] };

  // Les identifiants viennent du formulaire : on ne fait confiance qu'à ceux
  // qui désignent un article existant.
  const known =
    parsed.data.productIds.length > 0
      ? await db
          .select({ id: products.id })
          .from(products)
          .where(inArray(products.id, parsed.data.productIds))
      : [];

  await db
    .delete(productPlacements)
    .where(eq(productPlacements.subcategoryId, current.id));

  if (known.length > 0) {
    await db.insert(productPlacements).values(
      // L'ordre de la sélection est celui du formulaire, pas celui de la base.
      parsed.data.productIds
        .filter((id) => known.some((row) => row.id === id))
        .map((productId, index) => ({
          productId,
          subcategoryId: current.id,
          position: index,
        })),
    );
  }

  revalidateTaxonomy(current.categorySlug);
  revalidatePath(`/${current.categorySlug}/${current.slug}`);
  return {};
}
