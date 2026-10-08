import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { CONTENT_GROUPS } from "@/lib/content-pages";
import { formatDate } from "@/lib/format";
import { listContentPages } from "@/lib/queries/content";
import type { ContentGroup } from "@/types/content-page";

export const metadata: Metadata = { title: "Pages | Admin Droopy's" };

/**
 * Liste des pages de contenu, groupée comme le pied de page.
 *
 * Les deux vues lisent la même table : ce que l'admin affiche ici est
 * exactement ce que le visiteur trouve en bas du site, sans divergence
 * possible.
 */
export default async function AdminPagesPage() {
  await requireAdmin();

  const pages = await listContentPages();
  const groups = (
    Object.entries(CONTENT_GROUPS) as [
      ContentGroup,
      { label: string; order: number },
    ][]
  ).sort(([, a], [, b]) => a.order - b.order);

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Pages"
        lead="Aide, à propos, services et informations légales — les pages liées depuis le pied de page."
      />

      <div className="admin-columns">
        {groups.map(([group, { label }]) => (
          <section key={group} className="admin-column">
            <h2 className="admin-card__title">{label}</h2>
            <ul className="admin-sidebar__links">
              {pages
                .filter((page) => page.group === group)
                .map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="admin-nav__link"
                    >
                      <span>{page.title}</span>
                      {page.updatedAt && (
                        <span className="admin-field__hint">
                          {formatDate(page.updatedAt)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
