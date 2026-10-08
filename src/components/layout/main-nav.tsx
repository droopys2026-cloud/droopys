"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { formatPrice } from "@/lib/format";
import type { NavItem } from "@/types/navigation";

/**
 * Menu principal avec panneau déroulant (écrans larges).
 *
 * Ouverture au survol ET au clavier : le libellé est un vrai bouton, donc
 * accessible à la tabulation, avec `aria-expanded` qui dit son état. La
 * fermeture est retardée de 120 ms pour laisser traverser l'espace entre le
 * libellé et son panneau sans que celui-ci se referme sous le curseur.
 *
 * Le panneau se lit en deux temps : colonnes de liens à gauche, visuels mis
 * en avant à droite.
 *
 * Le menu descend en props depuis l'en-tête, qui le lit en base : ce
 * composant a un état d'ouverture, il ne doit pas en plus aller chercher ses
 * données.
 */
export function MainNav({ items }: { items: NavItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function open(index: number) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenIndex(index);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 120);
  }

  function close() {
    setOpenIndex(null);
  }

  return (
    <nav
      aria-label="Catégories"
      className="relative hidden lg:block [.sticky-header_&]:static"
      onMouseLeave={scheduleClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <ul className="container-page flex flex-wrap items-center justify-center gap-x-9 [.sticky-header_&]:flex-nowrap [.sticky-header_&]:justify-start [.sticky-header_&]:gap-x-6">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <li
              key={item.href}
              className="nav-list-item"
              onMouseEnter={() => open(index)}
            >
              <Link
                href={item.href}
                className="link-underline-sm"
                aria-haspopup={item.columns ? "true" : undefined}
                aria-expanded={item.columns ? isOpen : undefined}
                onFocus={() => (item.columns ? open(index) : close())}
                onClick={close}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {items.map((item, index) =>
        item.columns ? (
          <div
            key={item.href}
            hidden={openIndex !== index}
            className="nav-panel"
            onMouseEnter={() => open(index)}
          >
            <div className="container-page mx-auto flex max-w-[1120px] items-start justify-center gap-17 py-9">
              {/* Colonnes de liens, puis le raccourci vers la page du rayon.
                  Un lien discret plutôt que le nom du rayon en très grand au
                  bas du panneau : il doublait la hauteur pour redire
                  l'onglet qu'on vient de survoler. */}
              <div className="flex flex-col gap-7">
                <div className="flex gap-13">
                  {item.columns.map((column, columnIndex) => (
                    <div
                      key={`${item.href}-${columnIndex}`}
                      className="min-w-36"
                    >
                      {column.title && (
                        <h3 className="nav-column-title">{column.title}</h3>
                      )}
                      <ul className="flex flex-col gap-4">
                        {column.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className="nav-column-link"
                              onClick={close}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                        {column.allLink && (
                          <li>
                            <Link
                              href={column.allLink.href}
                              className="nav-column-link font-semibold"
                              onClick={close}
                            >
                              {column.allLink.label}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link
                  href={item.href}
                  className="nav-column-link font-semibold"
                  onClick={close}
                >
                  Tout voir
                </Link>
              </div>

              {/* Articles mis en avant : les derniers arrivés du rayon,
                  choisis automatiquement (voir `queries/navigation`). */}
              {item.features && (
                <div className="flex shrink-0 gap-11">
                  {item.features.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="group flex w-36 flex-col xl:w-40"
                      onClick={close}
                    >
                      <FrameImage
                        src={feature.imageUrl}
                        alt={`${feature.brand} — ${feature.title}`}
                        ratio="4 / 5"
                        sizes="(min-width: 1280px) 160px, 144px"
                        className="instance-style-image-zoom"
                      />
                      <span className="text-caption-muted mt-5">
                        {feature.brand}
                      </span>
                      <span className="text-brand-label mt-1">
                        {feature.title}
                      </span>
                      <span className="text-strong mt-1">
                        {formatPrice(feature.priceCents)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null,
      )}
    </nav>
  );
}
