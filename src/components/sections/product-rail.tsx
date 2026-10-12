"use client";

import { useRef } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { IconArrowLeft, IconArrowRight } from "@/components/ui/icons";
import type { ProductRail as Rail } from "@/types/product";

/**
 * Carrousel horizontal de produits.
 * Le défilement repose sur `scroll-snap` natif plutôt que sur une
 * bibliothèque : la molette, le tactile et le clavier fonctionnent sans
 * code, les flèches ne font que déplacer le conteneur d'une vignette.
 */
export function ProductRail({ rail }: { rail: Rail }) {
  const trackRef = useRef<HTMLUListElement>(null);

  function scrollBy(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    // Une « page » = la largeur visible moins un aperçu de la carte suivante.
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  return (
    <section className="container-page relative">
      <div className="flex items-baseline justify-between">
        <h2 className="heading-h2">
          {rail.title}
          {rail.titleAccent && (
            <span className="text-heading-emphasis">{rail.titleAccent}</span>
          )}
        </h2>
        <Link href={rail.href} className="link-underline-sm">
          Tout voir
        </Link>
      </div>

      <ul
        ref={trackRef}
        // Écart resserré à la demande de la boutique (32 px avant), et largeur
        // des cartes calculée pour que 2 (téléphone) ou 4 (ordinateur) tiennent
        // pile : à un quart de la largeur plus l'écart, la 4e était coupée.
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-9 [scrollbar-width:none] md:gap-7"
      >
        {rail.products.map((product) => (
          <li
            key={product.id}
            className="w-[calc((100%-var(--spacing-5))/2)] shrink-0 snap-start md:w-[calc((100%-3*var(--spacing-7))/4)]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Produits précédents"
        className="button-arrow-round top-1/2 left-0 hidden size-11 md:flex"
      >
        <IconArrowLeft />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Produits suivants"
        className="button-arrow-round top-1/2 right-0 hidden size-11 md:flex"
      >
        <IconArrowRight />
      </button>
    </section>
  );
}
