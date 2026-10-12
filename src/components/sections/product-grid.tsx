import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

/**
 * Grille de produits d'une page de rayon.
 * Quatre colonnes sur grand écran, deux sur téléphone — une carte produit
 * reste lisible à moitié de largeur, elle n'a pas besoin de s'étirer.
 */
export function ProductGrid({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  return (
    <section className="container-page py-14">
      <h2 className="heading-h2 pt-0">{title}</h2>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-9 md:gap-x-7 md:gap-y-11 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
