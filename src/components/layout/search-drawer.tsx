"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { useSearchDrawer } from "@/components/layout/search-drawer-context";
import { formatPrice } from "@/lib/format";
import { searchProducts } from "@/lib/search";

/** Entrées proposées tant que rien n'est saisi. */
const SUGGESTIONS = ["Doudoune", "Manteau", "Pull", "Baskets", "Bonnet"];

/** Au-delà, le tiroir devient une page de résultats : c'est le rôle de /recherche. */
const MAX_RESULTS = 6;

/**
 * Tiroir de recherche : même panneau que celui du panier, sorti du même bord,
 * ouvert par l'icône voisine. Chercher est un geste qu'on fait depuis
 * n'importe où — il ne doit pas coûter un changement de page.
 *
 * Les résultats se mettent à jour à la frappe, sur le catalogue déjà chargé.
 * Valider mène à `/recherche?q=…` : les résultats complets ont besoin d'une
 * adresse partageable, et le formulaire y va en `GET`, sans routeur.
 *
 * Comme le tiroir du panier, le panneau est toujours monté (transition
 * d'entrée) et mis hors circuit par `inert` quand il est replié.
 */
export function SearchDrawer() {
  const { isOpen, close } = useSearchDrawer();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const trimmed = query.trim();
  const results = searchProducts(trimmed).slice(0, MAX_RESULTS);

  // Échap ferme le tiroir, où que soit le focus.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // La page derrière ne défile pas tant que le tiroir est ouvert.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Le focus va au champ à l'ouverture — un tiroir de recherche qui oblige à
  // un second clic pour taper a manqué son seul but — et revient à l'icône à
  // la fermeture.
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus();
      return;
    }
    openerRef.current?.focus();
    openerRef.current = null;
  }, [isOpen]);

  return (
    <>
      <div
        aria-hidden
        className={`drawer-scrim ${isOpen ? "is-open" : ""}`}
        onClick={close}
      />

      <aside
        id="tiroir-recherche"
        aria-label="Recherche"
        inert={!isOpen}
        className={`drawer ${isOpen ? "is-open" : ""}`}
      >
        <div className="drawer__head">
          <h2 className="text-brand-label m-0">Rechercher</h2>
          <button
            type="button"
            className="icon-button-muted-border"
            onClick={close}
          >
            <span className="sr-only">Fermer la recherche</span>
            <span aria-hidden>&times;</span>
          </button>
        </div>

        <div className="drawer__body">
          <form action="/recherche" method="get" role="search">
            <label className="sr-only" htmlFor="tiroir-recherche-champ">
              Rechercher un article
            </label>
            <input
              ref={inputRef}
              id="tiroir-recherche-champ"
              name="q"
              type="search"
              autoComplete="off"
              placeholder="Doudoune, manteau, C.P. Company…"
              className="content-field__input w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>

          {trimmed === "" ? (
            <>
              <p className="text-caption-muted mt-9 mb-2">
                Recherches fréquentes
              </p>
              <ul className="flex flex-wrap gap-4">
                {SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      type="button"
                      className="link-underline-sm"
                      onClick={() => setQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : results.length === 0 ? (
            <p className="text-paragraph mt-9">
              Aucun article ne correspond à cette recherche.
            </p>
          ) : (
            <ul className="mt-9 flex flex-col gap-9">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/produits/${product.slug}`}
                    className="flex items-start gap-7"
                    onClick={close}
                  >
                    <span className="w-16 shrink-0">
                      <FrameImage
                        src={product.imageUrl}
                        alt={`${product.brand} — ${product.name}`}
                        sizes="71px"
                      />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-caption-muted">
                        {product.brand}
                      </span>
                      <span className="text-brand-label">{product.name}</span>
                      <span className="text-strong">
                        {formatPrice(product.priceCents)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer__foot">
          {/* Le nombre affiché est plafonné : le lien dit où trouver le reste.
              Il n'apparaît que s'il y a une requête à transmettre. */}
          <Link
            href={`/recherche${trimmed ? `?q=${encodeURIComponent(trimmed)}` : ""}`}
            className="link-cta-block"
            onClick={close}
          >
            Voir tous les résultats
          </Link>
        </div>
      </aside>
    </>
  );
}
