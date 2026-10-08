import { AIDE_PAGES } from "@/lib/content/aide";
import { A_PROPOS_PAGES } from "@/lib/content/a-propos";
import { SERVICES_PAGES } from "@/lib/content/services";
import { LEGAL_PAGES } from "@/lib/content/legal";
import type { ContentGroup, ContentPage } from "@/types/content-page";

/**
 * Registre des pages de contenu.
 *
 * C'est l'unique source : le pied de page y puise ses colonnes, les routes y
 * puisent leur contenu, et l'admin y puisera sa liste. Une page qui n'est pas
 * ici n'existe nulle part — ce qui évite le cas classique du lien de pied de
 * page qui pointe vers une route supprimée.
 */
export const CONTENT_GROUPS: Record<
  ContentGroup,
  { label: string; order: number }
> = {
  aide: { label: "Besoin d'aide ?", order: 1 },
  "a-propos": { label: "À propos", order: 2 },
  services: { label: "Nos services", order: 3 },
  legal: { label: "Informations légales", order: 4 },
};

export const CONTENT_PAGES: ContentPage[] = [
  ...AIDE_PAGES,
  ...A_PROPOS_PAGES,
  ...SERVICES_PAGES,
  ...LEGAL_PAGES,
];

/**
 * Récupère une page par son chemin.
 *
 * Le retour n'est pas optionnel : chaque route connaît son propre chemin, et
 * une faute de frappe doit s'arrêter au build plutôt que de produire une page
 * vide en production.
 */
export function contentPage(slug: string): ContentPage {
  const page = CONTENT_PAGES.find((candidate) => candidate.slug === slug);
  if (!page) throw new Error(`Page de contenu introuvable : ${slug}`);
  return page;
}

/** Métadonnées Next dérivées d'une page — titre et description en un appel. */
export function contentMetadata(slug: string) {
  const page = contentPage(slug);
  return { title: `${page.title} | Droopy's`, description: page.lead };
}

/** Pages d'un groupe, dans l'ordre de déclaration. Vue complète : c'est celle
    de l'admin, qui doit voir aussi les pages retirées du pied de page. */
export function pagesOfGroup(group: ContentGroup): ContentPage[] {
  return CONTENT_PAGES.filter((page) => page.group === group);
}

/** Pages d'un groupe affichées dans le pied de page. */
export function footerPagesOfGroup(group: ContentGroup): ContentPage[] {
  return pagesOfGroup(group).filter((page) => page.footer !== false);
}
