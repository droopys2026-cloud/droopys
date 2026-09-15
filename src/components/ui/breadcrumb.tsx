import Link from "next/link";

export type Crumb = { label: string; href?: string };

/**
 * Fil d'Ariane. Le dernier élément n'est jamais un lien : il désigne la page
 * où l'on se trouve déjà, et porte `aria-current` pour le dire aux lecteurs
 * d'écran.
 */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="content-breadcrumb" aria-label="Fil d'Ariane">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="contents">
            {item.href && !last ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current={last ? "page" : undefined}>{item.label}</span>
            )}
            {!last && (
              <span className="content-breadcrumb__sep" aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
