import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { HERO_TILES } from "@/lib/placeholder-data";

/**
 * Trio d'images d'ouverture : trois colonnes égales sur grand écran,
 * empilées sous 768 px. Chaque tuile est un unique lien, légende comprise,
 * pour n'offrir qu'une seule cible au clavier comme au lecteur d'écran.
 */
export function Hero() {
  return (
    <section
      aria-label="Sélections mises en avant"
      className="flex flex-col md:flex-row"
    >
      {HERO_TILES.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="group relative block flex-1"
        >
          <FrameImage
            src={tile.image}
            hoverSrc={tile.hoverImage}
            alt={tile.title}
            ratio="2 / 3"
            imageClassName={tile.imageClassName}
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
