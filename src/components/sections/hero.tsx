import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { listCategories } from "@/lib/queries/catalog";

/**
 * Trio d'images d'ouverture : trois colonnes égales sur grand écran,
 * empilées sous 768 px. Chaque tuile est un unique lien, légende comprise,
 * pour n'offrir qu'une seule cible au clavier comme au lecteur d'écran.
 *
 * Les tuiles sont les premiers rayons qui ont une photo — celle du rayon,
 * pas une image posée à part : deux visuels pour une même entrée du catalogue
 * finissent toujours par se contredire.
 */
const TILE_COUNT = 3;

export async function Hero() {
  const categories = await listCategories();
  const tiles = categories
    .filter((category) => category.imageUrl)
    .slice(0, TILE_COUNT);

  if (tiles.length === 0) return null;

  return (
    <section
      aria-label="Sélections mises en avant"
      className="flex flex-col md:flex-row"
    >
      {tiles.map((tile) => (
        <Link
          key={tile.slug}
          href={`/${tile.slug}`}
          className="group relative block flex-1"
        >
          <FrameImage
            src={tile.imageUrl ?? undefined}
            hoverSrc={tile.hoverImageUrl ?? undefined}
            alt={tile.title}
            ratio="2 / 3"
            imageClassName={tile.imageClassName ?? undefined}
            priority
          />
          <div className="hero-caption">
            <span className="hero-caption__eyebrow">{tile.eyebrow}</span>
            <span className="hero-caption__title">{tile.title}</span>
            <span className="link-underline-md">Je découvre</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
