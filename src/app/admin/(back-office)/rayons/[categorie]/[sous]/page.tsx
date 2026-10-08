import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PlacementPicker } from "@/components/admin/placement-picker";
import { SubcategoryForm } from "@/components/admin/subcategory-form";
import { db } from "@/db";
import { categories, subcategories } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  listPlacementCandidates,
  listPlacements,
} from "@/lib/queries/admin-catalog";

type PageProps = { params: Promise<{ categorie: string; sous: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sous } = await params;
  return { title: `Sous-rayon ${sous} | Admin Droopy's` };
}

export default async function AdminSousRayonPage({ params }: PageProps) {
  await requireAdmin();

  const { categorie, sous } = await params;
  const [row] = await db
    .select({
      id: subcategories.id,
      slug: subcategories.slug,
      title: subcategories.title,
      intro: subcategories.intro,
      imageUrl: subcategories.imageUrl,
      categoryTitle: categories.title,
    })
    .from(subcategories)
    .innerJoin(categories, eq(subcategories.categoryId, categories.id))
    .where(and(eq(categories.slug, categorie), eq(subcategories.slug, sous)))
    .limit(1);

  if (!row) notFound();

  const [candidates, placed] = await Promise.all([
    listPlacementCandidates(),
    listPlacements(row.id),
  ]);

  return (
    <div className="admin-page">
      <Link href={`/admin/rayons/${categorie}`} className="admin-back">
        <span aria-hidden>←</span> Retour au rayon {row.categoryTitle}
      </Link>

      <AdminPageHeader
        title={row.title}
        lead={`/${categorie}/${row.slug}`}
      />

      <SubcategoryForm
        categorySlug={categorie}
        subcategory={{
          id: row.id,
          title: row.title,
          intro: row.intro,
          imageUrl: row.imageUrl,
        }}
      />

      <section className="admin-section">
        <h2 className="admin-section__title">Sélection d&apos;articles</h2>
        <p className="admin-section__lead">
          Les pièces classées dans ce sous-rayon y figurent déjà. Cochez ici
          celles d&apos;un autre rayon qu&apos;on veut aussi y voir — une
          doudoune garçon sous /manteaux/doudounes, par exemple.
        </p>

        <PlacementPicker
          subcategoryId={row.id}
          candidates={candidates}
          selected={placed.map((entry) => entry.productId)}
        />
      </section>
    </div>
  );
}
