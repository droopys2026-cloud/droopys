/** État d'un code tel que la liste de l'admin l'affiche, à l'heure donnée. */
export type PromoStatus = "actif" | "desactive" | "expire" | "epuise";

export function promoStatus(
  promo: { active: boolean; endsAt: Date | null; maxUses: number | null; uses: number },
  now: Date,
): PromoStatus {
  // Désactivé passe avant le reste : c'est le seul état que l'admin a choisi.
  if (!promo.active) return "desactive";
  if (promo.endsAt !== null && now.getTime() > promo.endsAt.getTime()) return "expire";
  if (promo.maxUses !== null && promo.uses >= promo.maxUses) return "epuise";
  return "actif";
}

export const PROMO_STATUS_LABELS: Record<PromoStatus, string> = {
  actif: "Actif",
  desactive: "Désactivé",
  expire: "Expiré",
  epuise: "Épuisé",
};
