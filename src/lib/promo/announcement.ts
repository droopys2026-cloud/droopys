/**
 * Message de la bande noire pour un code « tout le site ».
 *
 * Le message saisi à l'admin l'emporte ; vide, il est composé à partir du
 * code, qui y figure toujours — une annonce sans le code ne sert à rien.
 */
export function promoAnnouncement(promo: {
  code: string;
  kind: "percent" | "amount";
  value: number;
  announcement: string | null;
}): string {
  const custom = promo.announcement?.trim();
  if (custom) return custom;
  // Espace insécable avant « % » et « € » : le signe ne doit pas partir seul
  // à la ligne dans une bande étroite. Pas de « ,00 » sur un montant rond.
  const amount =
    promo.kind === "percent"
      ? `−${promo.value}\u00a0%`
      : `−${(promo.value / 100).toFixed(promo.value % 100 === 0 ? 0 : 2).replace(".", ",")}\u00a0€`;
  return `${amount} sur tout le site avec le code ${promo.code}`;
}
