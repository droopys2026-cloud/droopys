import Image from "next/image";
import Link from "next/link";
import { logoBox } from "@/lib/brands";

export type BrandIndexEntry = {
  slug: string;
  name: string;
  logoUrl: string | null;
  logoRatio: number | null;
  productCount: number;
};

/**
 * Toutes les marques dans un seul cadre, immobile : une case par maison,
 * logotype et nombre d'articles. Un clic ouvre la page de la marque, qui
 * liste toutes ses références.
 *
 * Mêmes règles d'affichage que le bandeau de l'accueil : logo vectoriel
 * quand il existe, nom composé sinon, et des logotypes calculés à surface
 * constante pour qu'ils pèsent pareil à l'œil.
 */
export function BrandIndex({ brands }: { brands: BrandIndexEntry[] }) {
  return (
    <section className="container-page brand-index" aria-label="Toutes nos marques">
      <ul className="brand-index-grid">
        {brands.map((brand) => (
          <li key={brand.slug} className="brand-index-cell">
            <Link href={`/marques/${brand.slug}`} className="brand-index-link">
              <span className="brand-index-mark">
                {brand.logoUrl && brand.logoRatio ? (
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    {...logoBox(brand.logoRatio, LOGO_AREA)}
                    unoptimized
                    className="brand-wall-logo"
                  />
                ) : (
                  <span className="brand-wall-name text-brand-label">{brand.name}</span>
                )}
              </span>
              <span className="brand-index-count">
                {brand.productCount === 0
                  ? "Bientôt disponible"
                  : brand.productCount === 1
                    ? "1 article"
                    : `${brand.productCount} articles`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Même surface que le bandeau de l'accueil : un logo y a la même taille. */
const LOGO_AREA = 8000;
