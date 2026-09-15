"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

/**
 * Fenêtre d'accueil : le paiement en trois fois avec Klarna.
 *
 * Elle s'ouvre après un court délai — surgir pendant que la page se peint
 * donne l'impression d'une publicité, et le visiteur ferme avant d'avoir lu.
 * Elle réapparaît à chaque chargement de page : rien n'est mémorisé.
 */
export function KlarnaModal() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // L'admin n'est pas la boutique : aucune offre commerciale n'y a sa place.
  const inStorefront = !pathname.startsWith("/admin");

  useEffect(() => {
    if (!inStorefront) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, [inStorefront]);

  useEffect(() => {
    if (!open) return;

    // Le fond ne doit pas défiler derrière la fenêtre, et Échap la ferme :
    // c'est la sortie que tout le monde essaie en premier.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="klarna-modal-titre"
        className="modal-panel bg-surface relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-y-auto shadow-2xl md:max-h-[86vh] md:min-h-[520px] md:flex-row md:overflow-hidden"
        // Le clic à l'intérieur ne doit pas remonter jusqu'au fond, qui ferme.
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full md:aspect-auto md:w-[55%]">
          <Image
            src="/imgdress/imagedemodaleklarana.webp"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[50%_25%]"
            priority
          />

          {/* Le nom de la marque au centre de la photo. Le voile sombre n'est
              pas décoratif : l'image est claire, le blanc y disparaîtrait. */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-11">
            <span className="text-center text-[clamp(32px,4.5vw,64px)] leading-none font-bold tracking-[2px] text-white uppercase">
              Droopys
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-7 p-11 md:w-[45%] md:justify-center md:overflow-y-auto md:p-14">
          <Image
            src="/imgdress/klarna.png"
            alt="Klarna"
            width={400}
            height={200}
            className="-mt-6 -mb-6 -ml-9 h-36 w-auto"
          />

          <h2
            id="klarna-modal-titre"
            className="m-0 text-left text-[clamp(22px,2.4vw,34px)] leading-tight font-semibold"
          >
            Payez en 3 fois sans frais avec Klarna
          </h2>

          <p className="text-paragraph m-0 text-[15px] leading-relaxed">
            Réglez votre commande en trois mensualités égales, sans frais et
            sans intérêts. Le premier tiers est prélevé à la commande, les deux
            autres à un mois d&apos;intervalle.
          </p>

          <ul className="text-caption-muted flex list-none flex-col gap-2 normal-case">
            <li>Décision immédiate au moment du paiement</li>
            <li>Disponible dès 35 € et jusqu&apos;à 1 500 € d&apos;achat</li>
            <li>Aucune carte de crédit nécessaire</li>
          </ul>

          <div className="flex flex-wrap items-center gap-7">
            <button type="button" onClick={close} className="link-cta-block">
              J&apos;en profite
            </button>
            <Link
              href="/services/paiement"
              onClick={close}
              className="link-underline-sm"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fermer"
          className="bg-surface absolute top-6 right-6 flex size-11 items-center justify-center rounded-full text-3xl leading-none shadow-md transition-opacity hover:opacity-80"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
