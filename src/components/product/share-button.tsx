"use client";

import { useState } from "react";

/**
 * Partage de la fiche.
 *
 * Le partage natif du système est tenté d'abord — c'est lui qui donne accès
 * aux messageries de l'appareil — et la copie du lien sert de repli sur les
 * navigateurs de bureau, qui ne l'implémentent pas. Un refus de l'utilisateur
 * dans le panneau natif n'est pas une erreur : on ne montre rien.
 */
export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers refusé (contexte non sécurisé, permission) : il n'y a
      // rien à proposer de plus, et une alerte serait pire que le silence.
    }
  }

  return (
    <button type="button" className="product-textlink" onClick={share}>
      {copied ? "Lien copié" : "Partager"}
    </button>
  );
}
