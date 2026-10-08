"use server";

import { asc, count, eq, max } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { revalidateTaxonomy } from "@/app/admin/(back-office)/rayons/revalidate";
import { db } from "@/db";
import { categories, products, subcategories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteImages } from "@/lib/images/upload";
import { swapTargets } from "@/lib/navigation/ordering";
import { slugify, uniqueSlug } from "@/lib/slug";
import { TAXONOMY_BUCKET } from "@/lib/supabase/admin";

/**
 * Sous-rayons : création, suppression, ordre. La fiche d'un sous-rayon a ses
 * propres actions, dans `[categorie]/[sous]/actions`.
 *
 * Le slug est dérivé du titre à la création puis **figé** : c'est le deuxième
 * segment d'une adresse publique, et un lien de menu qui pointe vers lui. Le
 * renommer casserait les deux d'un coup.
 */

export type SubcategoryFormState = { errors?: string[] };

const titleField = z
  .string()
  .trim()
  .min(1, "Le nom du sous-rayon est obligatoire.")
  .max(80);



export async function createSubcategory(
  _state: SubcategoryFormState,
  formData: FormData,
): Promise<SubcategoryFormState> {
  await requireAdmin();

  const parsed = z
    .object({ categorySlug: z.string().trim().min(1), title: titleField })
    .safeParse({
      categorySlug: formData.get("categorySlug") ?? "",
      title: formData.get("title") ?? "",
    });
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, parsed.data.categorySlug),
    columns: { id: true },
  });
  if (!category) return { errors: ["Rayon inconnu."] };

  const taken = new Set(
    (
      await db
        .select({ slug: subcategories.slug })
        .from(subcategories)
        .where(eq(subcategories.categoryId, category.id))
    ).map((row) => row.slug),
  );

  const [last] = await db
    .select({ total: count() })
    .from(subcategories)
    .where(eq(subcategories.categoryId, category.id));

  await db.insert(subcategories).values({
    categoryId: category.id,
    slug: uniqueSlug(slugify(parsed.data.title), taken),
    title: parsed.data.title,
    position: last.total,
  });

  revalidateTaxonomy(parsed.data.categorySlug);
  return {};
}

/**
 * Supprime un sous-rayon, sauf s'il porte encore des produits.
 *
 * La clé étrangère est en `set null` : la base accepterait et les fiches se
 * retrouveraient sans classement, sans que personne ne l'ait demandé. On
 * refuse ici, en français, et on laisse ranger les pièces d'abord.
 */
export async function deleteSubcategory(formData: FormData) {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("subcategoryId"));
  if (!id.success) return;

  const row = await db
    .select({
      id: subcategories.id,
      imageUrl: subcategories.imageUrl,
      categorySlug: categories.slug,
    })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id))
    .where(eq(subcategories.id, id.data))
    .limit(1);

  const current = row[0];
  if (!current) return;

  const [used] = await db
    .select({ total: count() })
    .from(products)
    .where(eq(products.subcategoryId, current.id));
  if (used.total > 0) return;

  await db.delete(subcategories).where(eq(subcategories.id, current.id));
  if (current.imageUrl) await deleteImages(TAXONOMY_BUCKET, [current.imageUrl]);

  revalidateTaxonomy(current.categorySlug);
}

/**
 * Déplace un sous-rayon d'un cran dans l'ordre d'affichage.
 *
 * L'échange porte sur les deux positions et non sur une renumérotation
 * complète : deux lignes touchées, donc deux écritures, quel que soit le
 * nombre de sous-rayons du rayon.
 */
export async function moveSubcategory(formData: FormData) {
  await requireAdmin();

  const parsed = z
    .object({
      subcategoryId: z.string().uuid(),
      direction: z.enum(["haut", "bas"]),
    })
    .safeParse({
      subcategoryId: formData.get("subcategoryId") ?? "",
      direction: formData.get("direction") ?? "",
    });
  if (!parsed.success) return;

  const current = await db.query.subcategories.findFirst({
    where: eq(subcategories.id, parsed.data.subcategoryId),
    columns: { id: true, categoryId: true, position: true },
  });
  if (!current) return;

  const siblings = await db
    .select({ id: subcategories.id, position: subcategories.position })
    .from(subcategories)
    .where(eq(subcategories.categoryId, current.categoryId))
    .orderBy(asc(subcategories.position));

  const swap = swapTargets(siblings, current.id, parsed.data.direction);
  if (!swap) return;

  await db
    .update(subcategories)
    .set({ position: swap.other.position })
    .where(eq(subcategories.id, swap.current.id));
  await db
    .update(subcategories)
    .set({ position: swap.current.position })
    .where(eq(subcategories.id, swap.other.id));

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, current.categoryId),
    columns: { slug: true },
  });
  if (category) revalidateTaxonomy(category.slug);
}

/* ---- rayons ------------------------------------------------------------- */

export type CategoryFormState = { errors?: string[] };

/**
 * Premiers segments d'URL déjà pris par une page du site. Un rayon est servi
 * à la racine (/fille) : un rayon « Marques » ou « Panier » serait masqué par
 * la page du même nom, et l'admin croirait l'avoir créé pour rien.
 *
 * À tenir à jour avec les dossiers de `src/app` — liste écrite à la main, car
 * le système de fichiers n'est pas lisible depuis une fonction déployée.
 */
const RESERVED_SLUGS = new Set([
  "a-propos",
  "actions",
  "admin",
  "aide",
  "api",
  "boutiques",
  "carte-cadeau",
  "commande",
  "compte",
  "contact",
  "engagements",
  "favoris",
  "fidelite",
  "journal",
  "legal",
  "marques",
  "panier",
  "parrainage",
  "produits",
  "recherche",
  "recrutement",
  "services",
]);

/**
 * Crée un rayon, placé en dernier.
 *
 * Il naît sans photo : la page publique se monte alors avec l'en-tête simple,
 * et le hero de l'accueil, qui ne retient que les rayons photographiés, ne
 * bouge pas. Pour qu'il apparaisse au menu, il faut encore l'y ajouter.
 */
export async function createCategory(
  _state: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  const parsed = z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Le nom du rayon est obligatoire.")
        .max(80),
    })
    .safeParse({ title: formData.get("title") ?? "" });
  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const base = slugify(parsed.data.title);
  if (!base) {
    return { errors: ["Le nom doit contenir au moins une lettre ou un chiffre."] };
  }

  // Les adresses réservées comptent comme prises : « Marques » devient
  // /marques-2 plutôt qu'une page jamais atteinte.
  const taken = new Set([
    ...RESERVED_SLUGS,
    ...(await db.select({ slug: categories.slug }).from(categories)).map(
      (row) => row.slug,
    ),
  ]);

  // `max` et non `count` : après une suppression, compter redonnerait une
  // position déjà occupée par le dernier rayon.
  const [last] = await db
    .select({ position: max(categories.position) })
    .from(categories);

  const slug = uniqueSlug(base, taken);
  await db.insert(categories).values({
    slug,
    title: parsed.data.title,
    position: (last.position ?? -1) + 1,
  });

  revalidateTaxonomy(slug);
  return {};
}

/**
 * Supprime un rayon vide.
 *
 * Refusé tant qu'il porte des sous-rayons ou des produits : la base
 * supprimerait les sous-rayons en cascade, avec les liens de menu qui y
 * pointent, et laisserait les fiches sans rayon. Mieux vaut vider d'abord,
 * en sachant ce qu'on déplace.
 */
export async function deleteCategory(formData: FormData) {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("categoryId"));
  if (!id.success) return;

  const current = await db.query.categories.findFirst({
    where: eq(categories.id, id.data),
    columns: { id: true, slug: true },
  });
  if (!current) return;

  const [[owned], [used]] = await Promise.all([
    db
      .select({ total: count() })
      .from(subcategories)
      .where(eq(subcategories.categoryId, current.id)),
    db
      .select({ total: count() })
      .from(products)
      .where(eq(products.categoryId, current.id)),
  ]);
  if (owned.total > 0 || used.total > 0) return;

  await db.delete(categories).where(eq(categories.id, current.id));

  revalidateTaxonomy(current.slug);
  // Le hero et les carrousels de l'accueil se construisent sur les rayons.
  revalidatePath("/");
}
