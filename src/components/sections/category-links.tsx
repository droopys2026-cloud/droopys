import Link from "next/link";
import type { NavColumn } from "@/lib/navigation";

/**
 * Sous-rayons d'une page de rayon, repris tels quels du menu principal :
 * une colonne par groupe, dans le même ordre. Pas de seconde source à tenir
 * à jour — ajouter une rubrique au menu la fait apparaître ici.
 */
export function CategoryLinks({ columns }: { columns: NavColumn[] }) {
  if (columns.length === 0) return null;

  return (
    <section className="subsection-decouvrez">
      <div className="container-page grid grid-cols-1 gap-x-13 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, index) => (
          <nav key={`${column.title}-${index}`} aria-label={column.title}>
            <h2 className="nav-column-title">{column.title}</h2>
            <ul className="flex flex-col gap-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="nav-column-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </section>
  );
}
