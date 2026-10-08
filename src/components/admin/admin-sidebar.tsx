"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/admin/connexion/actions";
import {
  IconBolt,
  IconBox,
  IconDashboard,
  IconHelp,
  IconMenu,
  IconMail,
  IconOrders,
  IconPages,
  IconSettings,
  IconStorefront,
  IconTag,
  IconUsers,
  IconWallet,
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
      { href: "/admin/menu", label: "Menu", Icon: IconMenu },
      { href: "/admin/produits", label: "Produits", Icon: IconBox },
    ],
  },
  {
    label: "Ventes",
    links: [
      { href: "/admin/commandes", label: "Commandes", Icon: IconOrders },
      { href: "/admin/paiements", label: "Paiements", Icon: IconWallet },
      { href: "/admin/clients", label: "Clients", Icon: IconUsers },
      { href: "/admin/newsletter", label: "Newsletter", Icon: IconMail },
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

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Link href="/admin" className="admin-sidebar__logo">
          Droopy&apos;s
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
                    aria-current={isActive(href, pathname) ? "page" : undefined}
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

        {/* Le bouton est un vrai envoi de formulaire et non un lien : une
            déconnexion modifie l'état du serveur, elle ne se déclenche pas
            sur un GET qu'un préchargeur pourrait appeler tout seul. */}
        <form action={signOut}>
          <button type="submit" className="admin-user" title="Se déconnecter">
            <span className="admin-user__avatar" aria-hidden>
              {(email[0] ?? "D").toUpperCase()}
            </span>
            <span>
              <span className="admin-user__name">Se déconnecter</span>
              <span className="admin-user__mail">{email}</span>
            </span>
          </button>
        </form>
      </div>
    </aside>
  );
}

/**
 * Comparaison stricte pour l'accueil, préfixe pour le reste : sinon /admin
 * resterait actif sur toutes les pages. Les fiches d'onglet vivent encore
 * sous /admin/rayons/… (leurs adresses n'ont pas bougé) mais s'ouvrent depuis
 * Menu : c'est lui qui reste allumé.
 */
function isActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === href;
  if (href === "/admin/menu" && pathname.startsWith("/admin/rayons")) return true;
  return pathname.startsWith(href);
}
