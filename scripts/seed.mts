import { config } from "dotenv";
config({ path: ".env.local" });

import { eq, sql as raw } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as catalogTables from "../src/db/schema/catalog";
import * as contentTables from "../src/db/schema/content";
import * as navigationTables from "../src/db/schema/navigation";
import * as orderTables from "../src/db/schema/orders";
import * as shopTables from "../src/db/schema/shop";
import { BRANDS } from "../src/lib/brands";
import { CATEGORIES } from "../src/lib/categories";

import {
  DEMO_PRODUCT,
  HOME_RAILS,
  type DemoProduct,
} from "./demo-catalogue";
import { MAIN_NAV } from "./demo-navigation";
import { CONTENT_PAGES } from "../src/lib/content-pages";
import { DEFAULT_SETTINGS } from "../src/lib/settings";

/**
 * Verse le catalogue de démonstration dans la base.
 *
 * Le script est **rejouable** : chaque insertion se résout en mise à jour sur
 * conflit de slug. On doit pouvoir le relancer après une migration sans se
 * demander s'il va dupliquer le catalogue.
 *
 * Il tourne par la connexion directe, pas par le pooler : c'est un travail
 * d'administration lancé depuis un poste, pas une requête de page.
 */
/**
 * Le catalogue de démonstration : la fiche complète, plus les articles des
 * rails d'accueil. La déduplication se fait sur le slug, qui est aussi
 * l'adresse — deux produits au même slug, c'est une page qui en cache une autre.
 */
const DEMO_PRODUCTS: DemoProduct[] = [
  DEMO_PRODUCT,
  ...HOME_RAILS.flatMap((rail) => rail.products),
].filter(
  (product, index, list) =>
    list.findIndex((other) => other.slug === product.slug) === index,
);

const url = process.env.DIRECT_URL;
if (!url) throw new Error("DIRECT_URL manquante — voir .env.example.");

const client = postgres(url, { max: 1 });
/**
 * Les modules du schéma sont importés un par un plutôt que par le barillet
 * `@/db/schema` : hors de Next, `export *` traverse une conversion CommonJS
 * qui perd les exports nommés. Le `default` ajouté par cette conversion est
 * écarté, sinon Drizzle le prendrait pour une table.
 */
const schema = Object.fromEntries(
  Object.entries({
    ...catalogTables,
    ...contentTables,
    ...navigationTables,
    ...orderTables,
    ...shopTables,
  }).filter(([key]) => key !== "default"),
);

const db = drizzle({ client, schema });

/**
 * Valeur refusée par le conflit, à reprendre dans le `do update`.
 * Postgres l'expose sous la pseudo-table `excluded` ; Drizzle n'a pas
 * d'équivalent typé, d'où ce fragment SQL. Les noms viennent du schéma, pas
 * d'une saisie : aucune interpolation externe n'entre ici.
 */
const excluded = (column: string) => raw.raw(`excluded."${column}"`);

const { brands, categories, subcategories, products, productImages, productVariants } =
  catalogTables;
const { contentPages } = contentTables;
const { navSections, navColumns, navLinks } = navigationTables;
const { settings } = shopTables;

// ── Marques ───────────────────────────────────────────────────────────────
const brandRows = await db
  .insert(brands)
  .values(
    BRANDS.map((brand, index) => ({
      slug: brand.slug,
      name: brand.name,
      logoUrl: brand.logo ?? null,
      logoRatio: brand.logoRatio ?? null,
      position: index,
    })),
  )
  .onConflictDoUpdate({
    target: brands.slug,
    set: {
      name: excluded("name"),
      logoUrl: excluded("logo_url"),
      logoRatio: excluded("logo_ratio"),
      position: excluded("position"),
    },
  })
  .returning({ id: brands.id, name: brands.name });

const brandIdByName = new Map(brandRows.map((row) => [row.name, row.id]));
console.log(`${brandRows.length} marques`);

// ── Rayons ────────────────────────────────────────────────────────────────
const categoryRows = await db
  .insert(categories)
  .values(
    CATEGORIES.map((category, index) => ({
      slug: category.slug,
      title: category.title,
      headline: category.headline ?? null,
      eyebrow: category.eyebrow ?? null,
      intro: category.intro ?? null,
      imageUrl: category.image ?? null,
      hoverImageUrl: category.hoverImage ?? null,
      imageClassName: category.imageClassName ?? null,
      backdropClassName: category.backdropClassName ?? null,
      position: index,
    })),
  )
  .onConflictDoUpdate({
    target: categories.slug,
    set: {
      title: excluded("title"),
      headline: excluded("headline"),
      eyebrow: excluded("eyebrow"),
      intro: excluded("intro"),
      imageUrl: excluded("image_url"),
      hoverImageUrl: excluded("hover_image_url"),
      imageClassName: excluded("image_class_name"),
      backdropClassName: excluded("backdrop_class_name"),
      position: excluded("position"),
    },
  })
  .returning({ id: categories.id, slug: categories.slug });

const categoryIdBySlug = new Map(categoryRows.map((row) => [row.slug, row.id]));
console.log(`${categoryRows.length} rayons`);

// ── Sous-rayons ───────────────────────────────────────────────────────────
/**
 * Déduits du menu : tout lien en `/rayon/sous-rayon` dont le premier segment
 * est un rayon connu décrit un sous-rayon. Le menu était déjà la seule
 * description de ce deuxième niveau ; on la verse en base au lieu de la
 * ressaisir, et les deux ne peuvent donc pas diverger au départ.
 */
const draftedSubcategories = new Map<
  string,
  { categorySlug: string; slug: string; title: string }
>();

for (const section of MAIN_NAV) {
  for (const column of section.columns ?? []) {
    for (const link of [...column.links, ...(column.allLink ? [column.allLink] : [])]) {
      const [, categorySlug, slug, ...rest] = link.href.split("/");
      if (rest.length > 0 || !slug) continue;
      if (!categoryIdBySlug.has(categorySlug)) continue;

      const key = `${categorySlug}/${slug}`;
      // Le premier libellé rencontré gagne : « Voir tout le rayon fille »
      // décrit la page du rayon, pas celle du sous-rayon.
      if (!draftedSubcategories.has(key)) {
        draftedSubcategories.set(key, { categorySlug, slug, title: link.label });
      }
    }
  }
}

const subcategoryDrafts = [...draftedSubcategories.values()].flatMap(
  (entry, index) => {
    const categoryId = categoryIdBySlug.get(entry.categorySlug);
    return categoryId
      ? [{ categoryId, slug: entry.slug, title: entry.title, position: index }]
      : [];
  },
);

if (subcategoryDrafts.length > 0) {
  await db
    .insert(subcategories)
    .values(subcategoryDrafts)
    .onConflictDoUpdate({
      target: [subcategories.categoryId, subcategories.slug],
      set: { title: excluded("title") },
    });
}
console.log(`${subcategoryDrafts.length} sous-rayons`);

const subcategoryRows = await db
  .select({
    id: subcategories.id,
    slug: subcategories.slug,
    categoryId: subcategories.categoryId,
  })
  .from(subcategories);

const categorySlugById = new Map(
  [...categoryIdBySlug].map(([slug, id]) => [id, slug]),
);

const subcategoryIdByPath = new Map(
  subcategoryRows.map((row) => [
    `${categorySlugById.get(row.categoryId)}/${row.slug}`,
    row.id,
  ]),
);

// ── Produits ──────────────────────────────────────────────────────────────
for (const product of DEMO_PRODUCTS) {
  const brandId = brandIdByName.get(product.brand);
  if (!brandId) throw new Error(`Marque inconnue : ${product.brand}`);

  const [row] = await db
    .insert(products)
    .values({
      slug: product.slug,
      brandId,
      name: product.name,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents ?? null,
      reference: product.reference ?? null,
      categoryId: product.categorySlug
        ? (categoryIdBySlug.get(product.categorySlug) ?? null)
        : null,
      subcategoryId: product.subcategorySlug
        ? (subcategoryIdByPath.get(
            `${product.categorySlug}/${product.subcategorySlug}`,
          ) ?? null)
        : null,
      description: product.description ?? [],
      composition: product.composition ?? null,
      care: product.care ?? null,
      madeIn: product.madeIn ?? null,
      modelNote: product.modelNote ?? null,
      measurements: product.measurements ?? [],
      sizeAdvice: product.sizeAdvice ?? null,
      badge: product.badge ?? null,
      published: true,
    })
    .onConflictDoUpdate({
      target: products.slug,
      set: {
        brandId: excluded("brand_id"),
        name: excluded("name"),
        priceCents: excluded("price_cents"),
        compareAtPriceCents: excluded("compare_at_price_cents"),
        reference: excluded("reference"),
        categoryId: excluded("category_id"),
        subcategoryId: excluded("subcategory_id"),
        description: excluded("description"),
        composition: excluded("composition"),
        care: excluded("care"),
        madeIn: excluded("made_in"),
        modelNote: excluded("model_note"),
        measurements: excluded("measurements"),
        sizeAdvice: excluded("size_advice"),
        badge: excluded("badge"),
        published: excluded("published"),
        updatedAt: new Date(),
      },
    })
    .returning({ id: products.id });

  // Images et tailles sont réécrites en entier plutôt que rapprochées ligne à
  // ligne : leur seule identité est leur rang, un rapprochement coûterait plus
  // cher à lire qu'à exécuter.
  const gallery =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl, product.hoverImageUrl].filter(
          (value): value is string => Boolean(value),
        );

  await db.delete(productImages).where(eq(productImages.productId, row.id));
  if (gallery.length > 0) {
    await db.insert(productImages).values(
      gallery.map((url: string, index: number) => ({
        productId: row.id,
        url,
        alt: `${product.brand} — ${product.name}`,
        position: index,
      })),
    );
  }

  await db.delete(productVariants).where(eq(productVariants.productId, row.id));
  if (product.sizes && product.sizes.length > 0) {
    await db.insert(productVariants).values(
      product.sizes.map((entry: { size: string; quantity: number }, index: number) => ({
        productId: row.id,
        size: entry.size,
        quantity: entry.quantity,
        position: index,
      })),
    );
  }
}
console.log(`${DEMO_PRODUCTS.length} produits`);

// ── Menu principal ────────────────────────────────────────────────────────
/**
 * Le menu de démonstration descend en base.
 *
 * Il est **réécrit en entier** à chaque passage, et non rapproché ligne à
 * ligne : un menu n'a d'identité que sa forme, et la cascade des clés
 * étrangères emporte colonnes, liens et visuels avec leurs rubriques. C'est
 * la seule table que le script remet à zéro — d'où cet avertissement, pour
 * qui relancerait le peuplement après avoir composé son menu dans l'admin.
 */
await db.delete(navSections);


for (const [sectionIndex, section] of MAIN_NAV.entries()) {
  const [createdSection] = await db
    .insert(navSections)
    .values({
      label: section.label,
      href: section.href,
      position: sectionIndex,
    })
    .returning({ id: navSections.id });

  for (const [columnIndex, column] of (section.columns ?? []).entries()) {
    const [createdColumn] = await db
      .insert(navColumns)
      .values({
        sectionId: createdSection.id,
        title: column.title,
        allLabel: column.allLink?.label ?? null,
        allHref: column.allLink?.href ?? null,
        position: columnIndex,
      })
      .returning({ id: navColumns.id });

    if (column.links.length > 0) {
      await db.insert(navLinks).values(
        column.links.map((link, index) => ({
          columnId: createdColumn.id,
          label: link.label,
          href: link.href,
          position: index,
        })),
      );
    }
  }

  // Les articles mis en avant dans les panneaux ne se versent pas : ils
  // sont choisis automatiquement à la lecture du menu.
}
console.log(`${MAIN_NAV.length} rubriques de menu`);

// ── Pages de contenu ──────────────────────────────────────────────────────
await db
  .insert(contentPages)
  .values(
    CONTENT_PAGES.map((page) => ({
      slug: page.slug,
      group: page.group,
      title: page.title,
      lead: page.lead,
      imageUrl: page.image ?? null,
      imageClassName: page.imageClassName ?? null,
      toc: page.toc ?? false,
      footer: page.footer ?? true,
      blocks: page.blocks,
      updatedAt: page.updatedAt ? new Date(page.updatedAt) : new Date(),
    })),
  )
  .onConflictDoUpdate({
    target: contentPages.slug,
    set: {
      group: excluded("group"),
      title: excluded("title"),
      lead: excluded("lead"),
      imageUrl: excluded("image_url"),
      imageClassName: excluded("image_class_name"),
      toc: excluded("toc"),
      footer: excluded("footer"),
      blocks: excluded("blocks"),
      updatedAt: excluded("updated_at"),
    },
  });
console.log(`${CONTENT_PAGES.length} pages de contenu`);

// ── Réglages ──────────────────────────────────────────────────────────────
// `doNothing` et non `doUpdate` : une valeur déjà réglée dans l'admin ne doit
// pas être ramenée à sa valeur d'usine par une simple relance du script.
await db
  .insert(settings)
  .values(
    Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),
  )
  .onConflictDoNothing();
console.log(`${Object.keys(DEFAULT_SETTINGS).length} réglages`);

await client.end();
console.log("\nCatalogue versé.");
