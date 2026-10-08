import Image from "next/image";
import Link from "next/link";
import { logoBox } from "@/lib/brands";
import { listBrands } from "@/lib/queries/catalog";

type Brand = Awaited<ReturnType<typeof listBrands>>[number];

/**
 * Rayon des marques : deux bandeaux de logotypes qui défilent en sens
 * contraire, sur fond blanc.
 *
 * Les maisons dont le logotype officiel existe en vectoriel libre s'affichent
 * en logo ; les autres gardent leur nom composé, ce qui vaut mieux qu'un logo
 * approximatif à côté des vrais. Une marque ajoutée depuis l'admin apparaît
 * ici sans toucher au code.
 *
 * Les SVG sont servis tels quels (`unoptimized`) : l'optimiseur d'images de
 * Next refuse le SVG sans `dangerouslyAllowSVG`, et un vectoriel de 3 ko n'a
 * de toute façon rien à y gagner. Ils sont noirs à la source, ce qui convient
 * au fond blanc.
 */
export async function BrandsStrip() {
  const brands = await listBrands();
  if (brands.length === 0) return null;

  // Une marque sur deux par ligne : les deux bandeaux se partagent la liste
  // sans qu'aucune maison n'y figure deux fois.
  const rows = [
    brands.filter((_, index) => index % 2 === 0),
    brands.filter((_, index) => index % 2 === 1),
  ].filter((row) => row.length > 0);

  return (
    /* Pas de titre visible : le mur se suffit. L'`aria-label` donne quand même
       son nom à la section pour la navigation par repères. */
    <section className="brand-wall" aria-label="Nos marques">
      {rows.map((row, index) => (
        <MarqueeRow key={index} brands={row} reverse={index === 1} />
      ))}
    </section>
  );
}

/**
 * Une ligne du bandeau.
 *
 * Le défilement est une translation de −50 % en boucle : la piste porte donc
 * la série **deux fois**, et la seconde moitié prend exactement la place de
 * la première au moment où l'animation repart. Une série trop courte
 * laisserait un trou sur les grands écrans : elle est répétée jusqu'à
 * remplir largement la largeur. Seule la première série est lue par les
 * lecteurs d'écran et atteinte au clavier ; les copies sont décoratives.
 */
function MarqueeRow({ brands, reverse }: { brands: Brand[]; reverse: boolean }) {
  const series: Brand[] = [];
  while (series.length < MIN_CELLS_PER_SERIES) series.push(...brands);

  return (
    <div className="brand-marquee">
      <ul className={`brand-marquee-track${reverse ? " brand-marquee-track--reverse" : ""}`}>
        {[...series, ...series].map((brand, index) => {
          const copy = index >= brands.length;
          return (
            <li key={index} className="brand-marquee-cell" aria-hidden={copy || undefined}>
              <Link
                href={`/marques/${brand.slug}`}
                className="brand-wall-link"
                tabIndex={copy ? -1 : undefined}
              >
                {brand.logoUrl && brand.logoRatio ? (
                  /* Dimensions calculées à surface constante : c'est ce qui
                     fait que tous les logotypes pèsent pareil à l'œil malgré
                     des rapports allant de 1,6 (C.P. Company) à 10 (Givenchy).
                     Voir `logoBox` dans @/lib/brands. */
                  <Image
                    src={brand.logoUrl}
                    alt={copy ? "" : brand.name}
                    {...logoBox(brand.logoRatio, LOGO_AREA)}
                    unoptimized
                    className="brand-wall-logo"
                  />
                ) : (
                  <span className="brand-wall-name text-brand-label">{brand.name}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Surface commune à tous les logotypes, en pixels carrés. Réglée à l'œil : le
    seul curseur à toucher pour les grossir ou les réduire tous ensemble. */
const LOGO_AREA = 8000;

/** Cases par série : à 240 px la case, 10 couvrent un écran de 2 400 px. */
const MIN_CELLS_PER_SERIES = 10;
