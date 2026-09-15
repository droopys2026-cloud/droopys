import Image from "next/image";
import Link from "next/link";
import { BRANDS, logoBox } from "@/lib/brands";

/**
 * Rayon des marques : un mur de logotypes sur fond noir.
 *
 * Les maisons dont le logotype officiel existe en vectoriel libre s'affichent
 * en logo ; les trois autres (Paul & Shark, Gertrude, Karl Lagerfeld) gardent
 * leur nom composé, ce qui vaut mieux qu'un logo approximatif à côté des vrais.
 *
 * Les SVG sont servis tels quels (`unoptimized`) : l'optimiseur d'images de
 * Next refuse le SVG sans `dangerouslyAllowSVG`, et un vectoriel de 3 ko n'a
 * de toute façon rien à y gagner. Ils sont noirs à la source et repassés en
 * blanc par `.brand-wall-logo` (voir sections.css).
 */
export function BrandsStrip() {
  return (
    /* Pas de titre visible : le mur se suffit. L'`aria-label` donne quand même
       son nom à la section pour la navigation par repères. */
    <section className="brand-wall" aria-label="Nos marques">
      <div className="container-page">
        <ul className="brand-wall-grid">
          {BRANDS.map((brand) => (
            <li key={brand.slug} className="brand-wall-cell">
              <Link href={`/marques/${brand.slug}`} className="brand-wall-link">
                {brand.logo && brand.logoRatio ? (
                  /* Dimensions calculées à surface constante : c'est ce qui
                     fait que tous les logotypes pèsent pareil à l'œil malgré
                     des rapports allant de 1,6 (C.P. Company) à 10 (Givenchy).
                     Voir `logoBox` dans @/lib/brands. */
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    {...logoBox(brand.logoRatio, LOGO_AREA)}
                    unoptimized
                    className="brand-wall-logo"
                  />
                ) : (
                  <span className="brand-wall-name text-brand-label">
                    {brand.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Surface commune à tous les logotypes, en pixels carrés. Réglée à l'œil : le
    seul curseur à toucher pour les grossir ou les réduire tous ensemble. */
const LOGO_AREA = 5700;
