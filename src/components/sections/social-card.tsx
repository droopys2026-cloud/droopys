"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IconFacebook, IconInstagram, IconTiktok } from "@/components/ui/icons";
import type { SocialLink, SocialNetwork } from "@/lib/social";

const ICONS: Record<SocialNetwork, typeof IconInstagram> = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  tiktok: IconTiktok,
};

/** Fermée une fois, la carte ne revient plus pour cette visiteuse. */
const STORAGE_KEY = "droopys_carte_reseaux_fermee";

/**
 * Carte « Suivez-nous », fixée en bas à droite de l'accueil.
 *
 * Elle n'apparaît qu'après lecture du stockage local — sinon une visiteuse
 * qui l'a fermée la verrait clignoter à chaque visite. Pas d'animation
 * d'entrée : le site n'a rien qui bouge tout seul.
 */
export function SocialCard({ links, image }: { links: SocialLink[]; image: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Stockage indisponible : on montre la carte, elle se refermera.
    }
    // Synchronisation avec le stockage du navigateur, impossible au rendu
    // sans faire diverger serveur et client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!dismissed) setVisible(true);
  }, []);

  if (!visible || links.length === 0) return null;

  function close() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sans stockage, elle reviendra à la prochaine visite : sans gravité.
    }
  }

  return (
    <aside className="social-card" aria-labelledby="carte-reseaux-titre">
      <button type="button" className="social-card__close" onClick={close} aria-label="Fermer">
        <span aria-hidden>×</span>
      </button>
      <div className="social-card__image">
        <Image src={image} alt="" fill sizes="280px" className="object-cover object-[55%_30%]" />
      </div>
      <div className="social-card__body">
        <p id="carte-reseaux-titre" className="social-card__title">
          Suivez-nous
        </p>
        <p className="social-card__text">
          Nouveautés, coulisses de la boutique et sélections : retrouvez
          Droopy&apos;s sur les réseaux.
        </p>
        <ul className="social-card__links">
          {links.map(({ network, label, href }) => {
            const Icon = ICONS[network];
            return (
              <li key={network}>
                <a href={href} target="_blank" rel="noreferrer noopener" className="social-card__link">
                  <Icon />
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
