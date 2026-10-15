import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FrameImage } from "@/components/ui/frame-image";
import { WishlistButton } from "@/components/product/wishlist-button";
import { formatPrice } from "@/lib/format";
import { displayPrice } from "@/lib/products/variants";
import type { Product } from "@/types/product";

/**
 * Carte produit : visuel, marque, intitulé, prix.
 * Le bouton favori est superposé au visuel et se trouve HORS du lien
 * principal — deux zones cliquables imbriquées seraient invalides en HTML
 * et impossibles à atteindre au clavier.
 */
/** Au-delà, « +n » : une rangée de pastilles qui passe à la ligne casse la grille. */
const MAX_SWATCHES = 5;

export function ProductCard({ product }: { product: Product }) {
  const price = displayPrice(product, product.sizes ?? []);
  const colors = product.colors ?? [];

  // Le stock se dit sur la carte, pas seulement sur la fiche : découvrir
  // qu'un article est épuisé après avoir cliqué est la petite déception qui
  // fait quitter une grille. Une pièce sans tailles saisies n'est pas
  // « épuisée » — elle n'est pas renseignée, on ne lui met donc pas d'étiquette.
  const tracked = product.sizes && product.sizes.length > 0;
  const inStock = product.sizes?.reduce((total, entry) => total + entry.quantity, 0) ?? 0;
  const soldOut = Boolean(tracked) && inStock === 0;
  const scarce = inStock > 0 && inStock <= 3;

  return (
    <article className="group relative">
      <div className="relative overflow-hidden">
        <Link href={`/produits/${product.slug}`} className="block">
          <FrameImage
            src={product.imageUrl}
            hoverSrc={product.hoverImageUrl}
            alt={`${product.brand} — ${product.name}`}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="instance-style-image-zoom"
          />
        </Link>

        {/* Une seule étiquette en haut à gauche : « épuisé » l'emporte sur
            une promotion, puisqu'il n'y a plus rien à acheter. */}
        {(soldOut || product.badge) && (
          <div className="absolute top-2 left-2">
            <Badge>{soldOut ? "Épuisé" : product.badge}</Badge>
          </div>
        )}

        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="icon-button-default product-card__wishlist absolute top-4 right-4"
        />
      </div>

      <div className="flex flex-col items-center gap-1 pt-7 text-center">
        <span className="text-caption-muted">{product.brand}</span>
        <Link href={`/produits/${product.slug}`} className="link-underline-sm">
          <span className="text-brand-label">{product.name}</span>
        </Link>
        <p className="text-strong m-0">
          {price.from && "dès "}
          {formatPrice(price.cents)}
          {price.compareAtCents !== undefined && (
            <span className="text-caption-muted ml-2 inline line-through">
              {formatPrice(price.compareAtCents)}
            </span>
          )}
        </p>

        {/* Pastilles décoratives : la carte mène à la fiche, où l'on choisit.
            Leur nom reste dit aux lecteurs d'écran, en une phrase. */}
        {colors.length > 1 && (
          <p className="product-card__swatches m-0">
            <span className="sr-only">
              {`${colors.length} couleurs : ${colors.map((color) => color.name).join(", ")}`}
            </span>
            {colors.slice(0, MAX_SWATCHES).map((color) => (
              <span
                key={color.id}
                aria-hidden
                className="product-card__swatch"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {colors.length > MAX_SWATCHES && (
              <span aria-hidden className="text-caption-muted">
                +{colors.length - MAX_SWATCHES}
              </span>
            )}
          </p>
        )}

        {/* Dit seulement quand il y a urgence ou impossibilité : afficher
            « 42 en stock » sur chaque carte n'aide personne à choisir. */}
        {soldOut ? (
          <span className="text-caption-muted">Épuisé</span>
        ) : scarce ? (
          <span className="product-card__scarce">
            {inStock === 1 ? "Dernière pièce" : `Plus que ${inStock} pièces`}
          </span>
        ) : null}
      </div>
    </article>
  );
}
