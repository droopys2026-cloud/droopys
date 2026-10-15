"use client";

import { ProductGallery } from "@/components/product/product-gallery";
import { useProductVariant } from "@/components/product/product-variant-context";

/**
 * Galerie de la couleur choisie. Sans couleur, la galerie de la fiche.
 *
 * La `key` remet la vue courante à la première photo à chaque changement de
 * couleur : rester sur « vue 4 » d'une couleur qui n'en a que deux montrerait
 * un cadre vide.
 */
export function ProductVariantGallery({
  images,
  alt,
}: {
  /** Galerie de la fiche, pour une pièce sans couleur. */
  images: string[];
  alt: string;
}) {
  const { color } = useProductVariant();
  const shown = color && color.images.length > 0 ? color.images : images;

  return (
    <ProductGallery
      key={color?.id ?? "fiche"}
      images={shown}
      alt={color ? `${alt}, ${color.name}` : alt}
    />
  );
}
