import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContentPageForm } from "@/components/admin/content-page-form";
import { CONTENT_GROUPS, CONTENT_PAGES } from "@/lib/content-pages";

type PageProps = { params: Promise<{ slug: string[] }> };

/**
 * Le segment est attrape-tout parce que les chemins ont deux profondeurs :
 * « contact » d'un côté, « legal/cgv » de l'autre. Deux routes distinctes
 * auraient dupliqué ce formulaire pour une raison purement technique.
 */
export function generateStaticParams() {
  return CONTENT_PAGES.map((page) => ({ slug: page.slug.split("/") }));
}

function find(slug: string[]) {
  return CONTENT_PAGES.find((page) => page.slug === slug.join("/"));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = find((await params).slug);
  return { title: `${page?.title ?? "Page"} | Admin Droopys` };
}

export default async function AdminContentPage({ params }: PageProps) {
  const page = find((await params).slug);
  if (!page) notFound();

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
