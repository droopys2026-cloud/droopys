import Link from "next/link";
import { CartButton } from "@/components/layout/cart-button";
import { SearchButton } from "@/components/layout/search-button";
import { WishlistLink } from "@/components/layout/wishlist-link";
import { IconAccount } from "@/components/ui/icons";

/**
 * Rangée d'icônes utilisateur : recherche, compte, favoris, panier.
 * Partagée par l'en-tête complet et par la barre collante — une seule
 * définition, donc aucun risque que les deux divergent.
 *
 * Ni la recherche ni le panier ne sont des liens : chacune ouvre son tiroir,
 * sorti du bord droit. Toutes deux restent des composants clients isolés
 * (`SearchButton`, `CartButton`) pour que cette rangée, elle, continue d'être
 * rendue sur le serveur.
 */
export function HeaderActions({
  cartCount = 0,
  compact = false,
}: {
  cartCount?: number;
  /**
   * Sous 360 px de large, l'icône des favoris s'efface : logo, menu et quatre
   * icônes ne tenaient pas sur un petit iPhone, et toute la page débordait à
   * droite. Les favoris restent accessibles depuis l'espace client.
   */
  compact?: boolean;
}) {
  return (
    <nav aria-label="Navigation utilisateur">
      <ul className="flex items-center justify-end gap-2 sm:gap-4">
        <li>
          <SearchButton />
        </li>
        <li>
          <Link
            href="/compte"
            className="icon-link-nav"
            aria-label="Mon compte"
          >
            <IconAccount />
          </Link>
        </li>
        {/* `relative` : la pastille du nombre se pose sur l'icône, comme
            celle du panier. */}
        <li className={compact ? "relative max-[359px]:hidden" : "relative"}>
          <WishlistLink />
        </li>
        <li className="relative">
          <CartButton count={cartCount} />
        </li>
      </ul>
    </nav>
  );
}
