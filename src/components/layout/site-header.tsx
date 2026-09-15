import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderActions } from "@/components/layout/header-actions";
import { StickyHeader } from "@/components/layout/sticky-header";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchDrawer } from "@/components/layout/search-drawer";
import { CartDrawerProvider } from "@/components/layout/cart-drawer-context";
import { SearchDrawerProvider } from "@/components/layout/search-drawer-context";
import { IconStore } from "@/components/ui/icons";
import { cartItemCount } from "@/lib/cart";
import type { CartLine } from "@/types/cart";

/**
 * En-tête du site. Il enveloppe ses deux barres (complète et collante) dans les
 * fournisseurs des tiroirs : les deux portent une icône de recherche et une de
 * panier, et les deux doivent piloter les mêmes panneaux — rendus ici une
 * seule fois chacun.
 *
 * La pastille se déduit des lignes, elle ne se passe pas à part : un compte et
 * une liste qui se contredisent est le genre de bug qu'on ne voit qu'en prod.
 */
export function SiteHeader({
  cartLines = [],
  backdrop,
  title,
  // Un cadre d'en-tête est large et bas : centré, il tombe sur les jambes du
  // sujet. On accroche l'image près du haut, où sont les visages.
  backdropClassName = "object-[50%_12%]",
}: {
  cartLines?: CartLine[];
  /** Photo posée en fond de l'en-tête : encre blanche, hauteur inchangée. */
  backdrop?: string;
  /** Point d'ancrage de cette photo dans le cadre large de l'en-tête. */
  backdropClassName?: string;
  /** Titre de page posé en grand au bas de l'en-tête (sur photo seulement). */
  title?: string;
}) {
  const cartCount = cartItemCount(cartLines);

  return (
    <SearchDrawerProvider>
      <CartDrawerProvider>
        <header
          className={`section-header ${backdrop ? "section-header--overlay" : ""}`}
        >
          {backdrop && (
            <>
              <Image
                src={backdrop}
                alt=""
                fill
                sizes="100vw"
                priority
                className={`-z-10 object-cover ${backdropClassName}`}
              />
              {/* Sans ce voile, l'encre blanche disparaît sur les zones claires
                de la photo — et toutes les photos du site sont claires. */}
              <div className="pointer-events-none absolute inset-0 -z-10 bg-black/40" />
            </>
          )}
          <div className="container-page flex items-center justify-between gap-4 py-5 md:gap-9 md:py-7">
            <div className="flex items-center gap-6">
              <MobileNav />
              <Link
                href="/boutiques"
                className="icon-button-default hidden items-center gap-2 lg:flex"
              >
                <IconStore />
                <span className="text-base">Boutiques</span>
              </Link>
            </div>

            <Link
              href="/"
              className="text-[clamp(20px,6vw,36px)] leading-none font-bold tracking-[1px] uppercase [.section-header--overlay_&]:text-[clamp(26px,7vw,52px)]"
            >
              Droopys
            </Link>

            <HeaderActions cartCount={cartCount} />
          </div>

          <MainNav />

          {/* Titre de la page, dans l'en-tête même : c'est le H1 du document,
            il n'a pas à être répété plus bas. */}
          {title && <h1 className="header-title">{title}</h1>}

          <StickyHeader cartCount={cartCount} />
        </header>

        <CartDrawer lines={cartLines} />
        <SearchDrawer />
      </CartDrawerProvider>
    </SearchDrawerProvider>
  );
}
