import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FrameImage } from "@/components/ui/frame-image";
import { IconWishlist } from "@/components/ui/icons";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

/**
 * Carte produit : visuel, marque, intitulé, prix.
 * Le bouton favori est superposé au visuel et se trouve HORS du lien
 * principal — deux zones cliquables imbriquées seraient invalides en HTML
 * et impossibles à atteindre au clavier.
 */
export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPriceCents !== undefined;

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

        {product.badge && (
          <div className="absolute top-2 left-2">
            <Badge>{product.badge}</Badge>
          </div>
        )}

        <button
          type="button"
          aria-label={`Ajouter ${product.name} aux favoris`}
          className="icon-button-default absolute top-4 right-4"
        >
          <IconWishlist />
        </button>
      </div>

      <div className="flex flex-col items-center gap-1 pt-7 text-center">
        <span className="text-caption-muted">{product.brand}</span>
        <Link href={`/produits/${product.slug}`} className="link-underline-sm">
          <span className="text-brand-label">{product.name}</span>
        </Link>
        <p className="text-strong m-0">
          {formatPrice(product.priceCents)}
          {onSale && (
            <span className="text-caption-muted ml-2 inline line-through">
              {formatPrice(product.compareAtPriceCents!)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
