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
        className="flex snap-x snap-mandatory gap-11 overflow-x-auto scroll-smooth pb-9 [scrollbar-width:none]"
      >
        {rail.products.map((product) => (
          <li key={product.id} className="w-1/2 shrink-0 snap-start md:w-1/4">
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
