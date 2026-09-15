import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";

/**
 * Bloc éditorial : une image et un pavé de texte côte à côte, sur le fond
 * gris clair du design. L'ordre visuel s'inverse via `reverse` sans toucher
 * à l'ordre du DOM, qui reste celui de la lecture.
 */
export function Editorial({
  eyebrow,
  title,
  titleAccent,
  body,
  ctaLabel,
  ctaHref,
  image,
  imageClassName,
  reverse = false,
}: {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  /** Photo du bloc. Sans elle, le cadre gris tient la place. */
  image?: string;
  /** Recadrage propre à cette photo (zoom, point d'ancrage). */
  imageClassName?: string;
  reverse?: boolean;
}) {
  return (
    <section className="subsection-decouvrez">
      <div
        className={`container-page flex flex-col items-center gap-13 py-17 md:gap-17 md:flex-row ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="flex-1">
          {/* `object-cover` : la photo remplit le cadre au format 3/2 quel que
              soit son propre rapport, sans déformation ni bande vide. */}
          <FrameImage
            src={image}
            alt={title}
            ratio="4 / 3"
            imageClassName={imageClassName}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-1 flex-col items-start gap-7">
          {eyebrow && <span className="text-caption-muted">{eyebrow}</span>}
          <h2 className="heading-h2--left m-0 py-0 pl-0">
            {title}
            {titleAccent && (
              <span className="text-heading-emphasis">{titleAccent}</span>
            )}
          </h2>
          <p className="text-paragraph m-0 max-w-lg text-[17px] leading-[1.75]">
            {body}
          </p>
          <Link href={ctaHref} className="link-cta-block mt-2">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
