import Image from "next/image";
import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { HeaderActions } from "@/components/layout/header-actions";
import { StickyHeader } from "@/components/layout/sticky-header";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { SearchDrawer } from "@/components/layout/search-drawer";
import { SearchDrawerProvider } from "@/components/layout/search-drawer-context";
import { IconStore } from "@/components/ui/icons";
import { cartItemCount } from "@/lib/cart/totals";
import { getCart } from "@/lib/queries/cart";
import { getMainNav } from "@/lib/queries/navigation";

/**
 * En-tête du site. Il enveloppe ses deux barres (complète et collante) dans les
 * fournisseurs des tiroirs : les deux portent une icône de recherche et une de
 * panier, et les deux doivent piloter les mêmes panneaux — rendus ici une
 * seule fois chacun.
 *
 * Le panier est lu ici, pas passé en prop : l'en-tête est sur toutes les
 * pages, et faire descendre le panier depuis chacune d'elles reviendrait à le
 * réclamer vingt fois pour la même chose. La pastille se déduit des lignes —
 * un compte et une liste qui se contredisent est le genre de bug qu'on ne
 * voit qu'en production.
 */
export async function SiteHeader({
  backdrop,
  title,
  // Un cadre d'en-tête est large et bas : centré, il tombe sur les jambes du
  // sujet. On accroche l'image près du haut, où sont les visages.
  backdropClassName = "object-[50%_12%]",
}: {
  /** Photo posée en fond de l'en-tête : encre blanche, hauteur inchangée. */
  backdrop?: string;
  /** Point d'ancrage de cette photo dans le cadre large de l'en-tête. */
  backdropClassName?: string;
  /** Titre de page posé en grand au bas de l'en-tête (sur photo seulement). */
  title?: string;
}) {
  const [cartLines, nav] = await Promise.all([getCart(), getMainNav()]);
  const cartCount = cartItemCount(cartLines);

  return (
    <SearchDrawerProvider>
        <header
          className={`section-header ${backdrop ? "section-header--overlay" : ""}`}
        >
          {backdrop && (
            // Cadre propre à la photo : c'est lui qui la rogne, pas l'en-tête.
            // Un `overflow: hidden` sur l'en-tête coupait aussi le menu
            // déroulant, qui doit pouvoir descendre sous la bande.
            <div aria-hidden className="header-backdrop">
              <Image
                src={backdrop}
                alt=""
                fill
                sizes="100vw"
                priority
                className={`object-cover ${backdropClassName}`}
              />
              {/* Sans ce voile, l'encre blanche disparaît sur les zones claires
                de la photo — et toutes les photos du site sont claires. */}
              <div className="pointer-events-none absolute inset-0 bg-black/40" />
            </div>
          )}
          <div className="container-page flex items-center justify-between gap-4 py-5 md:gap-9 md:py-7">
            <div className="flex items-center gap-6">
              <MobileNav items={nav} />
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
              Droopy&apos;s
            </Link>

            <HeaderActions cartCount={cartCount} />
          </div>

          <MainNav items={nav} />

          {/* Titre de la page, dans l'en-tête même : c'est le H1 du document,
            il n'a pas à être répété plus bas. */}
          {title && <h1 className="header-title">{title}</h1>}

          <StickyHeader nav={nav} cartCount={cartCount} />
        </header>

        <CartDrawer lines={cartLines} />
        <SearchDrawer />
    </SearchDrawerProvider>
  );
}
