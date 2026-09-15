import { ScrollTextMarquee } from "@/components/ui/scroll-text-marquee";

/**
 * Bande de titre placée sous le hero.
 *
 * Le texte défile en boucle, donc il est répété quatre fois à l'écran : on le
 * masque aux lecteurs d'écran et on garde à côté un H1 réel, invisible mais
 * lu — un titre entendu quatre fois de suite n'a aucun sens, et la page a
 * besoin d'un H1 unique.
 */
export function BrandStatement({
  text,
  secondLine,
}: {
  text: string;
  /** Texte de la seconde bande, si elle doit dire autre chose. */
  secondLine?: string;
}) {
  return (
    <div className="container-page py-14">
      <h1 className="sr-only">{text}</h1>
      {/* Deux bandes qui se croisent : la première part vers la gauche, la
          seconde vers la droite. C'est le croisement qui fait l'effet — une
          seule ligne passerait pour un simple texte qui glisse. */}
      {/* La bande est coupée par ce cadre et non par la fenêtre : le texte
          entre et sort dans la colonne du site, sans toucher les bords. */}
      <div aria-hidden className="flex flex-col gap-2 overflow-hidden">
        <div className="marquee-fade mx-auto w-full max-w-5xl overflow-hidden">
          <ScrollTextMarquee
            baseVelocity={-1}
            delay={400}
            scrollDependent
            sizeClassName="text-[10vw] sm:text-[6.5vw]"
            className="font-semibold tracking-[-0.03em]"
          >
            {text}
          </ScrollTextMarquee>
        </div>

        {/* Seconde bande : plus petite et dans une colonne plus étroite, pour
            que la première garde le premier rôle. */}
        <div className="marquee-fade mx-auto w-full max-w-3xl overflow-hidden">
          <ScrollTextMarquee
            baseVelocity={1}
            delay={400}
            scrollDependent
            sizeClassName="text-[7vw] sm:text-[4vw]"
            className="font-light tracking-[-0.03em]"
          >
            {secondLine ?? text}
          </ScrollTextMarquee>
        </div>
      </div>
    </div>
  );
}
