import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  ContentBlockView,
  headingId,
} from "@/components/sections/content-blocks";
import { CONTENT_GROUPS } from "@/lib/content-pages";
import { formatDate } from "@/lib/format";
import { DEMO_CART_LINES } from "@/lib/placeholder-data";
import type { ContentPage } from "@/types/content-page";

/**
 * Gabarit unique de toutes les pages de contenu.
 *
 * Les vingt routes concernées ne contiennent donc rien d'autre que le choix
 * d'une page et, pour quelques-unes, un formulaire passé en `children`. Une
 * correction de mise en page se fait ici, une fois, et non vingt fois.
 */
export function ContentPageView({
  page,
  children,
  wide = false,
}: {
  page: ContentPage;
  /** Contenu propre à une page : formulaire de contact, liste de boutiques… */
  children?: React.ReactNode;
  /** Colonne élargie pour les pages qui portent une grille. */
  wide?: boolean;
}) {
  const group = CONTENT_GROUPS[page.group];
  const headings = page.blocks.filter((block) => block.kind === "titre");
  const showToc = page.toc && headings.length > 2;

  return (
    <>
      <AnnouncementBar>
        Livraison offerte dès 150 € d&apos;achat · Retours sous 30 jours
      </AnnouncementBar>
      {/* Avec une photo, l'en-tête porte lui-même le titre en blanc ; sans
          photo, le titre vit dans la bande grise juste en dessous. */}
      <SiteHeader
        cartLines={DEMO_CART_LINES}
        backdrop={page.image}
        backdropClassName={page.imageClassName}
        title={page.image ? page.title : undefined}
      />

      <main className="section-main">
        {!page.image && (
          <div className="content-header">
            <div className="content-header__inner">
              <Breadcrumb
                items={[
                  { label: "Accueil", href: "/" },
                  { label: group.label },
                  { label: page.title },
                ]}
              />
              <p className="content-header__eyebrow">{group.label}</p>
              <h1 className="content-header__title">{page.title}</h1>
              <p className="content-header__lead">{page.lead}</p>
              {page.updatedAt && (
                <p className="content-header__date">
                  Dernière mise à jour : {formatDate(page.updatedAt)}
                </p>
              )}
            </div>
          </div>
        )}

        <div className={`content-page ${wide ? "content-page--wide" : ""}`}>
          {/* Avec une photo, le titre est dans l'en-tête mais le chapô n'a
              nulle part où aller : il ouvre le corps de page. */}
          {page.image && (
            <div className="content-body mb-13">
              <Breadcrumb
                items={[
                  { label: "Accueil", href: "/" },
                  { label: group.label },
                  { label: page.title },
                ]}
              />
              <p className="content-header__lead mt-0">{page.lead}</p>
            </div>
          )}

          {showToc && (
            <nav className="content-toc" aria-label="Sommaire">
              <span className="content-toc__label">Sur cette page</span>
              <ul className="content-toc__list">
                {headings.map((heading) => (
                  <li key={heading.text}>
                    <a
                      href={`#${headingId(heading.text)}`}
                      className="content-toc__link"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="content-body">
            {page.blocks.map((block, index) => (
              // Deux blocs peuvent porter le même texte (deux paragraphes
              // identiques dans deux sections) : la position est la seule clé
              // stable, et l'ordre d'un contenu figé ne bouge pas au rendu.
              <ContentBlockView key={index} block={block} />
            ))}
            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
