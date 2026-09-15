"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderActions } from "@/components/layout/header-actions";

/**
 * Barre collante qui prend le relais de l'en-tête au défilement.
 *
 * Elle apparaît dès que la sentinelle — un point de repère invisible placé
 * en bas de l'en-tête complet — sort du champ. Un IntersectionObserver plutôt
 * qu'un écouteur `scroll` : le navigateur fait le calcul hors du fil principal
 * et la barre ne clignote pas pendant un défilement rapide.
 *
 * La barre est toujours dans le DOM ; seule sa position change. Un montage
 * conditionnel empêcherait toute transition d'entrée.
 */
export function StickyHeader({ cartCount = 0 }: { cartCount?: number }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      // Marge haute négative : la barre ne se déclenche qu'une fois la
      // sentinelle franchement passée, pas au moindre pixel de défilement.
      { rootMargin: "-8px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      <div
        className={`sticky-header ${stuck ? "is-stuck" : ""}`}
        // Hors écran, la barre ne doit être atteignable ni au clavier ni au
        // lecteur d'écran : les liens de l'en-tête complet font déjà le travail.
        inert={!stuck}
      >
        <div className="container-page flex items-center justify-between gap-4 md:gap-9">
          <div className="flex items-center gap-6">
            <MobileNav />
            <Link
              href="/"
              className="text-[clamp(18px,5vw,22px)] leading-none font-black tracking-[1px] uppercase"
            >
              Droopys
            </Link>
          </div>

          <MainNav />

          <HeaderActions cartCount={cartCount} />
        </div>
      </div>
    </>
  );
}
