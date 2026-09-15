/** Formatage monétaire : les prix circulent en centimes, jamais en euros. */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/**
 * Date longue en français : « 15 septembre 2026 ».
 *
 * `timeZone: "UTC"` n'est pas un détail : une date écrite « 2026-01-01 » est
 * interprétée à minuit UTC, et un serveur réglé à l'ouest la rendrait
 * « 31 décembre ». Sur une CGV, la date de mise à jour doit être la même
 * pour tout le monde.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
