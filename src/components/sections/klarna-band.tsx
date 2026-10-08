import Image from "next/image";
import Link from "next/link";

/**
 * Bande de réassurance paiement, posée juste après la newsletter.
 *
 * La photo occupe tout le côté gauche, bord à bord : elle n'est pas dans la
 * gouttière du site, contrairement au texte. Même hauteur que la newsletter,
 * pour que les deux bandes se lisent comme un seul bloc en bas de page.
 */
export function KlarnaBand() {
  return (
    <section className="bg-surface">
      <div className="flex flex-col md:h-[271px] md:flex-row">
        <div className="relative aspect-[16/9] w-full md:aspect-auto md:h-full md:w-1/2">
          <Image
            src="/imgdress/imagedemodaleklarana.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[50%_25%]"
          />

          {/* Le nom de la marque au centre de la photo. Le voile sombre n'est
              pas décoratif : l'image est claire, le blanc y disparaîtrait. */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-9">
            <span className="text-center text-[clamp(26px,3vw,44px)] leading-none font-bold tracking-[2px] text-white uppercase">
              Droopy&apos;s
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start justify-center gap-4 px-9 py-11 md:w-1/2 md:px-13 md:py-0">
          <Image
            src="/imgdress/klarna.png"
            alt="Klarna"
            width={400}
            height={200}
            /* Le fichier de la marque entoure la pastille d'une large marge
               transparente : on agrandit le cadre et on rattrape la marge. */
            className="-mt-5 -mb-5 -ml-7 h-24 w-auto"
          />

          <h2 className="m-0 text-left text-[clamp(18px,1.8vw,26px)] leading-tight font-semibold">
            Payez en 3 fois sans frais avec Klarna
          </h2>

          <p className="text-paragraph m-0 max-w-md text-[13px] leading-snug">
            Réglez votre commande en trois mensualités égales, sans frais et
            sans intérêts. Décision immédiate au moment du paiement, dès 35 €
            d&apos;achat et sans carte de crédit.
          </p>

          <Link
            href="/services/paiement"
            className="button--cta-dark px-7 py-3"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  );
}
