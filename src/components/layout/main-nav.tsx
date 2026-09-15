"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { MAIN_NAV } from "@/lib/navigation";

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
 */
export function MainNav() {
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
        {MAIN_NAV.map((item, index) => {
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

      {MAIN_NAV.map((item, index) =>
        item.columns ? (
          <div
            key={item.href}
            hidden={openIndex !== index}
            className="nav-panel"
            onMouseEnter={() => open(index)}
          >
            <div className="container-page mx-auto flex max-w-[1120px] items-start justify-center gap-17 py-13">
              {/* Colonnes de liens */}
              <div className="flex gap-13">
                {item.columns.map((column, columnIndex) => (
                  <div key={`${item.href}-${columnIndex}`} className="min-w-36">
                    <h3 className="nav-column-title">{column.title}</h3>
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

              {/* Visuels mis en avant */}
              {item.features && (
                <div className="flex shrink-0 gap-11">
                  {item.features.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      className="flex w-64 flex-col items-center xl:w-80"
                      onClick={close}
                    >
                      <ImagePlaceholder ratio="3 / 2" label={feature.title} />
                      <span className="text-brand-label mt-7 text-center">
                        {feature.title}
                      </span>
                      <span className="link-underline-md mt-2">Découvrir</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nom du rayon en grand, au bas du panneau : il rappelle où l'on
                est et sert de raccourci vers la page du rayon. */}
            <Link href={item.href} className="nav-panel__title" onClick={close}>
              {item.label}
            </Link>
          </div>
        ) : null,
      )}
    </nav>
  );
}
