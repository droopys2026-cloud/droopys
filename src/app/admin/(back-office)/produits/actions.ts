"use server";

import { and, eq, inArray, max } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import {
  brands,
  categories,
  productColors,
  productImages,
  productPlacements,
  products,
  productVariants,
  subcategories,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { CACHE_TAGS } from "@/lib/cache";
import {
  createProductPhotoUploads,
  deleteProductImages,
  isProductPhotoUrl,
  type PhotoUpload,
} from "@/lib/products/images";
import {
  colorInputSchema,
  colorPhotoIssues,
  productInputSchema,
  productIssues,
  stockInputSchema,
} from "@/lib/products/schema";
import { slugify, uniqueSlug } from "@/lib/slug";

/**
 * Écriture du catalogue.
 *
 * Chaque action commence par `requireAdmin()` : une Server Action est une
 * route publique, son identifiant suffit à l'appeler. La vérification de la
 * mise en page ne la protège pas.
 */

export type ProductFormState = { errors?: string[] };

/** Les listes JSON viennent du formulaire : elles sont relues, pas crues. */
const colorsField = z.array(colorInputSchema.extend({ name: z.string(), hex: z.string() }));
const sizesField = z.array(z.string());
const stockField = z.array(
  stockInputSchema.extend({ size: z.string(), price: z.string() }),
);
/** Couleur de chaque photo, dans l'ordre de la galerie ; `null` = commune. */
const imageColorsField = z.array(z.string().nullable());
const measurementsField = z.array(
  z.object({ label: z.string().trim().min(1), value: z.string().trim().min(1) }),
);
/**
 * Photos gardées : une URL du stockage, ou un chemin du site (`/imgdress/…`)
 * pour les photos livrées avec le code. N'accepter que les URL complètes
 * faisait échouer toute la liste en silence, et l'enregistrement effaçait
 * alors toutes les photos de la fiche.
 */
const keptImagesField = z.array(
  z.string().refine((value) => value.startsWith("/") || URL.canParse(value), "Photo invalide."),
);

const uploadedImagesField = z.array(
  z.string().refine(isProductPhotoUrl, "Photo envoyée invalide."),
);

/**
 * Étape 1 de l'enregistrement : des adresses de dépôt pour les nouvelles
 * photos. Le navigateur y envoie les fichiers lui-même, puis enregistre la
 * fiche avec leurs seules adresses (voir `createProductPhotoUploads`).
 */
export async function prepareProductPhotoUploads(
  files: { type: string; size: number }[],
): Promise<{ status: "ok"; uploads: PhotoUpload[] } | { status: "error"; message: string }> {
  await requireAdmin();
  const parsed = z
    .array(z.object({ type: z.string(), size: z.number().int().nonnegative() }))
    .safeParse(files);
  if (!parsed.success) return { status: "error", message: "Photos invalides." };
  try {
    return { status: "ok", uploads: await createProductPhotoUploads(parsed.data) };
  } catch (error) {
    console.error("Dépôt de photos non préparé :", error);
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Envoi des photos impossible.",
    };
  }
}

function readJson<T>(formData: FormData, key: string, schema: z.ZodType<T>, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || raw === "") return fallback;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    // JSON illisible : on retombe sur le défaut, la validation métier dira
    // ensuite ce qui manque. Une exception ici ne dirait rien d'utile au vendeur.
    return fallback;
  }
}

/**
 * Crée ou met à jour une fiche.
 *
 * `productId` absent : création. Présent : mise à jour — le slug ne change
 * alors plus, même si le nom change. Une adresse publique qui bouge casse les
 * liens partagés et les résultats de recherche ; renommer un produit ne doit
 * pas coûter ça.
 */
export async function saveProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const parsed = productInputSchema.safeParse({
    brandSlug: formData.get("brandSlug") ?? "",
    name: formData.get("name") ?? "",
    priceCents: formData.get("priceCents") ?? "",
    compareAtPriceCents: formData.get("compareAtPriceCents") ?? "",
    reference: formData.get("reference") ?? "",
    categorySlug: formData.get("categorySlug") ?? "",
    subcategoryId: formData.get("subcategoryId") ?? "",
    description: formData.get("description") ?? "",
    madeIn: formData.get("madeIn") ?? "",
    composition: formData.get("composition") ?? "",
    care: formData.get("care") ?? "",
    modelNote: formData.get("modelNote") ?? "",
    sizeAdvice: formData.get("sizeAdvice") ?? "",
    badge: formData.get("badge") ?? "",
    // Lus en JSON brut, puis validés par `productInputSchema` : un nom de
    // couleur vide doit produire son message, pas faire tomber la liste.
    colors: readJson(formData, "colors", colorsField, []),
    sizes: readJson(formData, "sizes", sizesField, []),
    stock: readJson(formData, "stock", stockField, []),
    measurements: readJson(formData, "measurements", measurementsField, []),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { errors: parsed.error.issues.map((issue) => issue.message) };
  }

  const input = parsed.data;
  const issues = productIssues(input);
  if (issues.length > 0) return { errors: issues };

  const brand = await db.query.brands.findFirst({
    where: eq(brands.slug, input.brandSlug),
    columns: { id: true },
  });
  if (!brand) return { errors: ["Marque inconnue."] };

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, input.categorySlug),
    columns: { id: true },
  });
  if (!category) return { errors: ["Rayon inconnu."] };

  // Un sous-rayon d'un autre rayon rendrait la fiche introuvable à son adresse
  // /rayon/sous-rayon : le couple est donc vérifié, pas seulement l'existence.
  if (input.subcategoryId) {
    const subcategory = await db.query.subcategories.findFirst({
      where: and(
        eq(subcategories.id, input.subcategoryId),
        eq(subcategories.categoryId, category.id),
      ),
      columns: { id: true },
    });
    if (!subcategory) {
      return { errors: ["Ce sous-rayon n'appartient pas au rayon choisi."] };
    }
  }

  const productId = formData.get("productId");
  const isUpdate = typeof productId === "string" && productId !== "";

  const kept = readJson(formData, "keptImages", keptImagesField, []);
  // Déjà déposées par le navigateur (`prepareProductPhotoUploads`) : on ne
  // reçoit que leurs adresses, et seulement celles de notre bucket.
  // Pas de repli silencieux ici, contrairement à `readJson` : une liste
  // refusée ferait disparaître sans bruit des photos déjà déposées.
  const uploadedRaw = formData.get("uploadedImages");
  const uploadedParsed = uploadedImagesField.safeParse(
    typeof uploadedRaw === "string" && uploadedRaw !== "" ? JSON.parse(uploadedRaw) : [],
  );
  if (!uploadedParsed.success) return { errors: ["Les photos envoyées n'ont pas été reconnues. Réessayez."] };
  const uploaded = uploadedParsed.data;

  if (!isUpdate && kept.length === 0 && uploaded.length === 0) {
    return { errors: ["Ajoutez au moins une photo : une fiche sans visuel ne se vend pas."] };
  }

  const gallery = [...kept, ...uploaded];
  const imageColors = readJson(formData, "imageColors", imageColorsField, []);
  // Une liste qui ne colle pas à la galerie rattacherait les photos aux
  // mauvaises couleurs : on refuse plutôt que de deviner.
  if (imageColors.length !== gallery.length) {
    return { errors: ["Les couleurs des photos n'ont pas été reconnues. Rechargez la page et recommencez."] };
  }
  const colorKeys = new Set(input.colors.map((color) => color.key));
  if (imageColors.some((key) => key !== null && !colorKeys.has(key))) {
    return { errors: ["Une photo est rattachée à une couleur qui n'existe plus."] };
  }
  const photoIssues = colorPhotoIssues(input.colors, imageColors);
  if (photoIssues.length > 0) return { errors: photoIssues };

  const values = {
    brandId: brand.id,
    name: input.name,
    priceCents: input.priceCents,
    compareAtPriceCents: input.compareAtPriceCents ?? null,
    reference: input.reference ?? null,
    categoryId: category.id,
    subcategoryId: input.subcategoryId ?? null,
    description: input.description,
    composition: input.composition ?? null,
    care: input.care ?? null,
    madeIn: input.madeIn ?? null,
    modelNote: input.modelNote ?? null,
    measurements: input.measurements,
    sizeAdvice: input.sizeAdvice ?? null,
    badge: input.badge ?? null,
    published: input.published,
    updatedAt: new Date(),
  };

  let id: string;
  let slug: string;

  if (isUpdate) {
    const existing = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { id: true, slug: true },
    });
    if (!existing) return { errors: ["Ce produit n'existe plus."] };

    await db.update(products).set(values).where(eq(products.id, existing.id));
    id = existing.id;
    slug = existing.slug;
  } else {
    const taken = new Set(
      (await db.query.products.findMany({ columns: { slug: true } })).map(
        (row) => row.slug,
      ),
    );
    slug = uniqueSlug(slugify(`${input.brandSlug} ${input.name}`), taken);

    const [row] = await db
      .insert(products)
      .values({ ...values, slug })
      .returning({ id: products.id });
    id = row.id;
  }

  // Couleurs, images et déclinaisons sont réécrites en entier : leur seule
  // identité est leur rang, un rapprochement ligne à ligne coûterait plus à
  // lire qu'à exécuter. En une transaction : une erreur à mi-chemin laisserait
  // sinon une fiche sans tailles, donc invendable.
  await db.transaction(async (tx) => {
    // Les couleurs partent en cascade avec leurs photos et leurs déclinaisons ;
    // les autres sont effacées explicitement.
    await tx.delete(productImages).where(eq(productImages.productId, id));
    await tx.delete(productVariants).where(eq(productVariants.productId, id));
    await tx.delete(productColors).where(eq(productColors.productId, id));

    // Clé du formulaire → identifiant réel, pour rattacher photos et stock.
    const colorIds = new Map<string, string>();
    if (input.colors.length > 0) {
      const inserted = await tx
        .insert(productColors)
        .values(
          input.colors.map((color, index) => ({
            productId: id,
            name: color.name,
            slug: slugify(color.name),
            hex: color.hex,
            position: index,
          })),
        )
        .returning({ id: productColors.id });
      input.colors.forEach((color, index) => colorIds.set(color.key, inserted[index].id));
    }
    const colorIdOf = (key: string | null) => (key === null ? null : (colorIds.get(key) ?? null));

    if (gallery.length > 0) {
      await tx.insert(productImages).values(
        gallery.map((url, index) => ({
          productId: id,
          colorId: colorIdOf(imageColors[index]),
          url,
          alt: `${input.name}`,
          position: index,
        })),
      );
    }

    // Rangées couleur par couleur, puis dans l'ordre des tailles : c'est
    // l'ordre que la fiche affiche.
    const stockByCell = new Map(
      input.stock.map((entry) => [`${entry.colorKey ?? ""}|${entry.size}`, entry]),
    );
    const colorOrder: (string | null)[] =
      input.colors.length > 0 ? input.colors.map((color) => color.key) : [null];
    const rows = colorOrder.flatMap((colorKey) =>
      input.sizes.map((size) => {
        const entry = stockByCell.get(`${colorKey ?? ""}|${size}`);
        return {
          productId: id,
          colorId: colorIdOf(colorKey),
          size,
          quantity: entry?.quantity ?? 0,
          priceCents: entry?.price ?? null,
        };
      }),
    );
    await tx
      .insert(productVariants)
      .values(rows.map((row, index) => ({ ...row, position: index })));
  });

  await savePlacements(id, input.subcategoryId ?? null, formData.getAll("placements"));

  revalidateCatalog(slug);
  redirect("/admin/produits");
}

/**
 * « Aussi visible dans » : rapproche les placements de l'article de ceux
 * cochés. Contrairement à la sélection d'un sous-rayon, on ne réécrit pas
 * tout : un placement gardé conserve son rang dans son sous-rayon, et un
 * nouveau se range en dernier, sans bousculer l'ordre choisi ailleurs.
 */
async function savePlacements(
  productId: string,
  mainSubcategoryId: string | null,
  raw: FormDataEntryValue[],
) {
  const parsed = z.array(z.string().uuid()).safeParse(raw);
  // Des cases mal formées ne viennent pas de ce formulaire : on n'y touche pas.
  if (!parsed.success) return;

  const wanted = new Set(parsed.data.filter((id) => id !== mainSubcategoryId));
  const known =
    wanted.size > 0
      ? new Set(
          (
            await db
              .select({ id: subcategories.id })
              .from(subcategories)
              .where(inArray(subcategories.id, [...wanted]))
          ).map((row) => row.id),
        )
      : new Set<string>();

  const current = await db
    .select({ subcategoryId: productPlacements.subcategoryId })
    .from(productPlacements)
    .where(eq(productPlacements.productId, productId));
  const had = new Set(current.map((row) => row.subcategoryId));

  const removed = [...had].filter((id) => !known.has(id));
  if (removed.length > 0) {
    await db
      .delete(productPlacements)
      .where(
        and(
          eq(productPlacements.productId, productId),
          inArray(productPlacements.subcategoryId, removed),
        ),
      );
  }

  for (const subcategoryId of known) {
    if (had.has(subcategoryId)) continue;
    const [last] = await db
      .select({ position: max(productPlacements.position) })
      .from(productPlacements)
      .where(eq(productPlacements.subcategoryId, subcategoryId));
    await db.insert(productPlacements).values({
      productId,
      subcategoryId,
      position: (last?.position ?? -1) + 1,
    });
  }
}

/** Publie ou dépublie sans passer par le formulaire complet. */
export async function togglePublished(formData: FormData) {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("productId"));
  if (!id.success) return;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id.data),
    columns: { published: true, slug: true },
  });
  if (!product) return;

  await db
    .update(products)
    .set({ published: !product.published, updatedAt: new Date() })
    .where(eq(products.id, id.data));

  revalidateCatalog(product.slug);
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("productId"));
  if (!id.success) return;

  const images = await db.query.productImages.findMany({
    where: eq(productImages.productId, id.data),
    columns: { url: true },
  });
  const product = await db.query.products.findFirst({
    where: eq(products.id, id.data),
    columns: { slug: true },
  });

  // La fiche part d'abord : images et tailles suivent par `on delete cascade`,
  // et les lignes de commande gardent leur trace grâce à `on delete set null`.
  await db.delete(products).where(eq(products.id, id.data));
  await deleteProductImages(images.map((image) => image.url));

  if (product) revalidateCatalog(product.slug);
}

/**
 * Rafraîchit tout ce qui est construit à partir du catalogue.
 *
 * L'étiquette vide le cache de données — sans elle, les lectures mémorisées
 * continueraient de rendre l'ancien catalogue. Les `revalidatePath` vident
 * ensuite le HTML pré-rendu : les deux caches sont distincts, invalider l'un
 * ne suffit pas.
 */
function revalidateCatalog(slug: string) {
  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/produits");
  revalidatePath("/");
  revalidatePath(`/produits/${slug}`);
  revalidatePath("/produits/[slug]", "page");
  revalidatePath("/(rayons)/[categorie]", "page");
  revalidatePath("/marques/[slug]", "page");
}

/** Supprime plusieurs fiches d'un coup depuis la liste. */
export async function deleteProducts(ids: string[]) {
  await requireAdmin();

  const parsed = z.array(z.string().uuid()).safeParse(ids);
  if (!parsed.success || parsed.data.length === 0) return;

  const images = await db.query.productImages.findMany({
    where: inArray(productImages.productId, parsed.data),
    columns: { url: true },
  });

  await db.delete(products).where(inArray(products.id, parsed.data));
  await deleteProductImages(images.map((image) => image.url));

  revalidateTag(CACHE_TAGS.catalog, "max");
  revalidatePath("/admin/produits");
  revalidatePath("/");
}
