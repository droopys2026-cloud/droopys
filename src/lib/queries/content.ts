import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { CACHE_TAGS } from "@/lib/cache";
import { contentPages } from "@/db/schema";
import type { ContentGroup, ContentPage } from "@/types/content-page";

/**
 * Lecture des pages de contenu.
 *
 * Le pari de `@/types/content-page` se tient : la page est décrite en blocs,
 * donc modifiable par un formulaire. `@/lib/content-pages` ne garde plus que
 * les libellés de groupes — le texte, lui, vit en base et se modifie sans
 * déploiement.
 */
function toContentPage(row: typeof contentPages.$inferSelect): ContentPage {
  return {
    slug: row.slug,
    group: row.group,
    title: row.title,
    lead: row.lead,
    image: row.imageUrl ?? undefined,
    imageClassName: row.imageClassName ?? undefined,
    updatedAt: row.updatedAt.toISOString(),
    toc: row.toc,
    footer: row.footer,
    blocks: row.blocks,
  };
}

/**
 * Récupère une page par son chemin, ou rend une 404.
 *
 * Le retour n'est pas optionnel : chaque route connaît son propre chemin, et
 * une page supprimée de l'admin doit donner une 404 franche plutôt qu'un
 * gabarit vide qu'on prendrait pour une panne.
 */
export const getContentPage = cache(async (slug: string): Promise<ContentPage> => {
  const row = await db.query.contentPages.findFirst({
    where: eq(contentPages.slug, slug),
  });
  if (!row) notFound();
  return toContentPage(row);
});

/** Métadonnées Next dérivées d'une page — titre et description en un appel. */
export async function contentMetadata(slug: string) {
  const page = await getContentPage(slug);
  return { title: `${page.title} | Droopy's`, description: page.lead };
}

/** Toutes les pages, dans l'ordre des groupes puis des titres. */
export const listContentPages = cache(
  unstable_cache(
    async (): Promise<ContentPage[]> => {
      const rows = await db.query.contentPages.findMany({
        orderBy: [asc(contentPages.group), asc(contentPages.title)],
      });
      return rows.map(toContentPage);
    },
    ["pages-de-contenu"],
    { tags: [CACHE_TAGS.content] },
  ),
);

/**
 * Pages d'un groupe affichées dans le pied de page.
 *
 * Une page retirée du pied de page reste publiée et atteignable : c'est un
 * choix d'affichage, pas une dépublication.
 */
export const footerPagesOfGroup = cache(
  async (group: ContentGroup): Promise<ContentPage[]> => {
    const pages = await listContentPages();
    return pages.filter((page) => page.group === group && page.footer !== false);
  },
);
