import Image from "next/image";

/**
 * Cadre d'image du site : rapport fixe, fond gris.
 * Avec `hoverSrc`, une seconde vue se fond par-dessus au survol de la carte.
 *
 * Avec `src`, la photo remplit le cadre (`object-cover`) et est servie par
 * `next/image` — donc redimensionnée, différée et en AVIF/WebP selon le
 * navigateur. Sans `src`, le cadre gris tient la place : même hauteur, donc
 * aucun saut de mise en page quand la photo arrive.
 */
export function FrameImage({
  src,
  hoverSrc,
  alt,
  ratio = "2 / 3",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className = "",
  imageClassName = "",
}: {
  src?: string;
  /** Seconde vue, révélée au survol du parent portant la classe `group`. */
  hoverSrc?: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Recadrage propre à une photo : zoom, décalage, point d'ancrage. */
  imageClassName?: string;
}) {
  return (
    <div
      role={src ? undefined : "img"}
      aria-label={src ? undefined : alt}
      style={{ aspectRatio: ratio }}
      className={`box-image-frame w-full ${className}`}
    >
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imageClassName}`}
        />
      )}

      {/* Seconde vue en fondu par-dessus la première. Elle est décorative —
          la première porte déjà la description — d'où l'`alt` vide. */}
      {hoverSrc && (
        <Image
          src={hoverSrc}
          alt=""
          fill
          sizes={sizes}
          className="instance-image-fade object-cover opacity-0 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
