"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { NavItem } from "@/types/navigation";

/**
 * Menu des petits écrans : un tiroir plein écran, chaque rubrique s'ouvrant
 * en accordéon. Une seule rubrique ouverte à la fois, sinon la liste devient
 * plus longue que l'écran et on perd le fil.
 */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Tant que le tiroir est ouvert, la page derrière ne doit pas défiler :
  // sans cela, un geste sur le tiroir emporte le contenu au lieu du menu.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="icon-button-muted-border"
        aria-expanded={drawerOpen}
        aria-controls="menu-mobile"
        onClick={() => setDrawerOpen((previous) => !previous)}
      >
        <span className="sr-only">Menu</span>
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          aria-hidden
        >
          {drawerOpen ? (
            <>
              <path d="m5 5 14 14" />
              <path d="m19 5-14 14" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {/* Rendu à la racine du document, hors de l'en-tête : dans Safari, un
          tiroir en position fixe placé sous le bloc de fondu des pages
          s'affichait vide sur iPhone. Le portail le met à l'abri de tout
          effet porté par ses parents. */}
      {drawerOpen &&
        createPortal(
        <div
          id="menu-mobile"
          className="bg-surface fixed inset-x-0 top-0 bottom-0 z-50 overflow-y-auto"
        >
          <div className="container-page flex items-center justify-between py-7">
            <span className="text-brand-label">Menu</span>
            <button
              type="button"
              className="icon-button-muted-border"
              onClick={() => setDrawerOpen(false)}
            >
              <span className="sr-only">Fermer le menu</span>
              <span aria-hidden>&times;</span>
            </button>
          </div>

          <ul className="container-page flex flex-col">
            {items.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <li
                  key={item.href}
                  className="border-b border-[var(--color-border-muted)] py-6"
                >
                  {item.columns ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        className="text-brand-label flex w-full items-center justify-between"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        {item.label}
                        <span aria-hidden>{isOpen ? "−" : "+"}</span>
                      </button>

                      {isOpen && (
                        // Deux colonnes côte à côte, comme le panneau du
                        // grand écran : empilées, les groupes de trois liens
                        // ne formaient qu'une longue liste.
                        <div className="grid grid-cols-2 gap-x-6 gap-y-7 pt-7">
                          {item.columns.map((column, columnIndex) => (
                            <div key={`${item.href}-${columnIndex}`}>
                              {column.title && <h3 className="heading-h4">{column.title}</h3>}
                              <ul className="flex flex-col gap-2">
                                {column.links.map((link) => (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      className="link--nav"
                                      onClick={() => setDrawerOpen(false)}
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-brand-label"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>,
          document.body,
        )}
    </div>
  );
}
