import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentPageForm } from "@/components/admin/content-page-form";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_GROUPS } from "@/lib/content-pages";
import { getContentPage, listContentPages } from "@/lib/queries/content";

type PageProps = { params: Promise<{ slug: string[] }> };

/**
 * Le segment est attrape-tout parce que les chemins ont deux profondeurs :
 * « contact » d'un côté, « legal/cgv » de l'autre. Deux routes distinctes
 * auraient dupliqué ce formulaire pour une raison purement technique.
 */
export async function generateStaticParams() {
  return (await listContentPages()).map((page) => ({
    slug: page.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getContentPage((await params).slug.join("/"));
  return { title: `${page.title} | Admin Droopy's` };
}

export default async function AdminContentPage({ params }: PageProps) {
  await requireAdmin();

  // `getContentPage` rend une 404 si le chemin n'existe pas : la page ne le
  // refait pas à sa façon.
  const page = await getContentPage((await params).slug.join("/"));

  return (
    <div className="admin-page">
      <Link href="/admin/pages" className="admin-back">
        ← Toutes les pages
      </Link>
      <AdminPageHeader
        title={page.title}
        lead={`${CONTENT_GROUPS[page.group].label} · /${page.slug}`}
      />
      <ContentPageForm page={page} />
    </div>
  );
}
