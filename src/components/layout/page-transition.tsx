"use client";

import { usePathname } from "next/navigation";

/**
 * Fondu à chaque changement de page.
 *
 * La clé sur le chemin est ce qui fait rejouer l'animation : sans elle, React
 * réutiliserait le même nœud et le navigateur ne verrait aucune entrée à
 * animer. Le prix à payer est le remontage de l'arbre à chaque navigation —
 * acceptable ici, puisque l'état vit dans l'en-tête, hors de ce conteneur.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
}
