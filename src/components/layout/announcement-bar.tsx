/**
 * Bande d'annonce noire, en tête de page, pleine largeur.
 * Elle se referme côté client ; l'état n'est pas persisté pour l'instant.
 */
"use client";

import { useState } from "react";

export function AnnouncementBar({
  children,
  logo,
}: {
  children: React.ReactNode;
  /** Logo posé avant le message (le badge Klarna, par exemple). */
  logo?: React.ReactNode;
}) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="section-announcement box-announcement-wrapper announcement-bar gap-x-4 gap-y-1 px-9">
      {logo}
      <p className="text-paragraph m-0">{children}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Fermer l'annonce"
        className="absolute right-9 text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
}
