"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBolt,
  IconBox,
  IconDashboard,
  IconHelp,
  IconOrders,
  IconPages,
  IconSettings,
  IconStorefront,
  IconTag,
  IconUsers,
} from "@/components/admin/admin-icons";

/**
 * Barre latérale de l'admin.
 *
 * L'état actif se déduit du chemin courant plutôt que d'une prop : une page
 * qui doit se déclarer active à sa barre de navigation finit toujours par
 * oublier de le faire.
 */
const SECTIONS = [
  {
    label: "Boutique",
    links: [
      { href: "/admin", label: "Tableau de bord", Icon: IconDashboard },
      { href: "/admin/marques", label: "Marques", Icon: IconTag },
      { href: "/admin/produits", label: "Produits", Icon: IconBox },
    ],
  },
  {
    label: "Ventes",
    links: [
      { href: "/admin/commandes", label: "Commandes", Icon: IconOrders },
      { href: "/admin/clients", label: "Clients", Icon: IconUsers },
    ],
  },
  {
    label: "Boutique en ligne",
    links: [
      { href: "/admin/pages", label: "Pages", Icon: IconPages },
      { href: "/admin/reglages", label: "Réglages", Icon: IconSettings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Link href="/admin" className="admin-sidebar__logo">
          Droopys
        </Link>
      </div>

      <div className="admin-sidebar__body">
        {SECTIONS.map((section) => (
          <nav
            key={section.label}
            className="admin-nav"
            aria-label={section.label}
          >
            <span className="admin-nav__label">{section.label}</span>
            <ul className="admin-nav__list">
              {section.links.map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="admin-nav__link"
                    // Comparaison stricte pour l'accueil, préfixe pour le
                    // reste : sinon /admin resterait actif sur toutes les pages.
                    aria-current={
                      (
                        href === "/admin"
                          ? pathname === href
                          : pathname.startsWith(href)
                      )
                        ? "page"
                        : undefined
                    }
                  >
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__links">
          <Link href="/admin/produits/nouveau" className="admin-cta">
            <IconBolt />
            Ajouter un produit
          </Link>

          <Link href="/" className="admin-sidebar__link">
            <IconStorefront />
            <span>Voir la boutique</span>
          </Link>
          <Link href="/admin/aide" className="admin-sidebar__link">
            <IconHelp />
            <span>Aide</span>
          </Link>
        </div>

        <button
          type="button"
          className="admin-user"
          aria-label="Ouvrir le menu du compte"
        >
          <span className="admin-user__avatar" aria-hidden>
            D
          </span>
          <span>
            <span className="admin-user__name">Droopys</span>
            <span className="admin-user__mail">admin@droopys.fr</span>
          </span>
        </button>
      </div>
    </aside>
  );
}
