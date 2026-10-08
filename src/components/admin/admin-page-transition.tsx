"use client";

import { usePathname } from "next/navigation";

/**
 * Fondu d'entrée à chaque changement de page de l'admin.
 *
 * Clé sur le chemin et non `template.tsx` : un template ne se remonte que si
 * son propre segment change, donc /admin/rayons → /admin/rayons/fille
 * n'aurait rien animé. Les paramètres de recherche (filtres des listes)
 * n'entrent pas dans la clé : filtrer n'est pas changer de page, et un
 * fondu à chaque case cochée fatiguerait vite.
 *
 * L'animation (`admin-page-enter`, dans `admin.css`) garde le repli
 * `prefers-reduced-motion` de `motion.css`.
 */
export function AdminPageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="admin-page-enter">
      {children}
    </div>
  );
}
