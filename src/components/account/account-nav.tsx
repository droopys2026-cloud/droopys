"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutCustomer } from "@/app/compte/actions";

const LINKS = [
  { href: "/compte", label: "Tableau de bord" },
  { href: "/compte/commandes", label: "Mes commandes" },
  { href: "/favoris", label: "Mes favoris" },
  { href: "/compte/adresses", label: "Mes adresses" },
  { href: "/compte/profil", label: "Mon profil" },
];

/**
 * Menu de l'espace client. Composant client pour le seul `aria-current` :
 * la mise en page ne connaît pas la page qu'elle entoure.
 */
export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Espace client">
      <ul className="account-nav">
        {LINKS.map((link) => {
          // Le tableau de bord n'est « courant » que sur lui-même ; les autres
          // le restent sur leurs sous-pages (le détail d'une commande).
          const current =
            link.href === "/compte"
              ? pathname === "/compte"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className="account-nav__link"
                aria-current={current ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
        <li>
          <form action={signOutCustomer}>
            <button type="submit" className="account-nav__link account-nav__button">
              Me déconnecter
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
