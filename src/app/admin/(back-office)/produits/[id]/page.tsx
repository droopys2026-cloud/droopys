import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import {
  getAdminProduct,
  listBrandOptions,
  listCategoryOptions,
  listProductPlacementIds,
  listSubcategoryOptions,
} from "@/lib/queries/admin-catalog";

export const metadata: Metadata = { title: "Modifier un produit | Admin Droopy's" };

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminProduitPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const [product, brands, categories, subcategories, placementIds] = await Promise.all([
    getAdminProduct(id),
    listBrandOptions(),
    listCategoryOptions(),
    listSubcategoryOptions(),
    listProductPlacementIds(id),
  ]);

  // Un identifiant inconnu est une 404, pas un formulaire vide : ouvrir une
  // fiche neuve à la place de celle qu'on cherchait est le meilleur moyen de
  // créer un doublon sans s'en apercevoir.
  if (!product) notFound();

  return (
    <div className="admin-page">
      <Link href="/admin/produits" className="admin-back">
        <span aria-hidden>←</span> Retour aux produits
      </Link>

      <AdminPageHeader
        title={product.name}
        lead={`${product.brand.name} · ${product.published ? "publié" : "brouillon"}`}
      />

      <ProductForm
        photoGeneration={Boolean(serverEnv.GEMINI_API_KEY)}
        brands={brands}
        categories={categories}
        subcategories={subcategories}
        product={{
          id: product.id,
          brandSlug: product.brand.slug,
          name: product.name,
          priceCents: product.priceCents,
          compareAtPriceCents: product.compareAtPriceCents,
          reference: product.reference,
          categorySlug: product.category?.slug ?? null,
          subcategoryId: product.subcategoryId,
          placementIds,
          description: product.description,
          madeIn: product.madeIn,
          composition: product.composition,
          care: product.care,
          modelNote: product.modelNote,
          sizeAdvice: product.sizeAdvice,
          badge: product.badge,
          published: product.published,
          colors: product.colors.map((color) => ({
            key: color.id,
            name: color.name,
            hex: color.hex,
          })),
          // Les tailles sont communes à toutes les couleurs : on les relit
          // une fois chacune, dans l'ordre enregistré.
          sizes: [...new Set(product.variants.map((variant) => variant.size))],
          stock: product.variants.map((variant) => ({
            colorKey: variant.colorId,
            size: variant.size,
            quantity: variant.quantity,
            price: euros(variant.priceCents),
          })),
          measurements: product.measurements,
          images: product.images.map((image) => image.url),
          imageColors: Object.fromEntries(
            product.images.flatMap((image) =>
              image.colorId ? [[image.url, image.colorId]] : [],
            ),
          ),
        }}
      />
    </div>
  );
}

/** Centimes → « 52,00 », la forme que le champ attend ; vide sans prix propre. */
function euros(cents: number | null): string {
  return cents === null ? "" : (cents / 100).toFixed(2).replace(".", ",");
}
