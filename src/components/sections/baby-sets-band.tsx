import Image from "next/image";
import Link from "next/link";

/**
 * Encadré « ensembles bébé », posé sous les nouveautés de l'accueil.
 *
 * Un encadré dans la gouttière du site, et non une bande bord à bord comme
 * `KlarnaBand` : il pousse vers un rayon, il ne ferme pas la page. Le fond gris
 * est celui des sous-surfaces (`--color-surface-alt`), la photo carrée telle
 * qu'elle a été cadrée — un ensemble posé à plat se lit en entier.
 */
export function BabySetsBand() {
  return (
    <section className="container-page mb-17">
      <div className="bg-surface-alt mx-auto flex max-w-7xl flex-col md:flex-row md:items-center">
        {/* Photo carrée sur la moitié de l'encadré : à pleine largeur
            (1280 px), elle redonne la hauteur de la première version, que la
            boutique voulait garder en resserrant seulement la largeur. */}
        <div className="relative aspect-square w-full md:w-1/2 md:shrink-0">
          <Image
            src="/imgdress/ensemble-bebe.webp"
            alt="Ensemble bébé Burberry à carreaux, chemise et jupe, posé à plat avec des chaussons en laine"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-4 px-9 py-11 md:px-14">
          <span className="text-caption-muted uppercase">Bébé 0-24 mois</span>

          {/* Graisse par le jeton, et non `font-semibold` : dans ce projet ce
              nom désigne la famille (`--font-semibold`), pas la graisse. */}
          <h2 className="m-0 text-left text-[clamp(22px,2.4vw,34px)] leading-tight [font-weight:var(--font-weight-semibold)]">
            Découvrez nos ensembles pour bébé
          </h2>

          <p className="text-paragraph m-0 max-w-md">
            Chemises, jupes, bodies et chaussons signés des grandes maisons :
            des tenues complètes, prêtes à offrir, de la naissance à 24 mois.
          </p>

          <Link href="/bebe" className="button--cta-dark px-7 py-3">
            Voir le rayon bébé
          </Link>
        </div>
      </div>
    </section>
  );
}
