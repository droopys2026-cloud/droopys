/**
 * Bande d'annonce noire, en tête de page, pleine largeur.
 * Elle se referme côté client ; l'état n'est pas persisté pour l'instant.
 */
"use client";

import { useState } from "react";

export function AnnouncementBar({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="section-announcement box-announcement-wrapper gap-y-1 px-9 py-2">
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
