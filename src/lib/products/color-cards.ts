import type { Product } from "@/types/product";

/**
 * Une carte par couleur dans les listes (accueil, rayons, marques,
 * recherche) : une doudoune en noir et en kaki y apparaît deux fois, chaque
 * carte avec les photos et le stock de sa couleur, et mène à la fiche ouverte
 * sur elle. La fiche reste unique — on y change de couleur.
 *
 * Un article sans couleur, ou d'une seule, garde sa carte telle quelle.
 */
export function colorCards(products: Product[]): Product[] {
  return products.flatMap((product) => {
    if (!product.colors || product.colors.length < 2) return [product];
    return product.colors.map((color) => ({
      ...product,
      cardColor: { id: color.id, slug: color.slug, name: color.name },
      imageUrl: color.images[0] ?? product.imageUrl,
      hoverImageUrl: color.images[1],
      images: color.images,
      sizes: product.sizes?.filter((size) => size.colorId === color.id),
    }));
  });
}

/** Clé de liste d'une carte : l'article seul ne suffit plus à la distinguer. */
export function cardKey(product: Product): string {
  return product.cardColor ? `${product.id}-${product.cardColor.id}` : product.id;
}

/** Adresse de la fiche, ouverte sur la couleur de la carte s'il y en a une. */
export function cardHref(product: Product): string {
  return product.cardColor
    ? `/produits/${product.slug}?couleur=${product.cardColor.slug}`
    : `/produits/${product.slug}`;
}
