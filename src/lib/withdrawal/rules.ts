import { inlineVariantLabel } from "@/lib/products/variants";

/**
 * Règles de la rétractation, sans base ni réseau.
 *
 * Le délai légal est de 14 jours à compter de la réception (art. L221-18 du
 * code de la consommation) ; la boutique en accorde 30. On ne connaît pas la
 * date de réception : la demande n'est donc jamais refusée sur le délai, elle
 * est seulement signalée « tardive » à la boutique, qui juge le cas.
 */
export const WITHDRAWAL_DAYS = 30;

export function isLate(placedAt: Date, now: Date, days = WITHDRAWAL_DAYS): boolean {
  const limit = placedAt.getTime() + days * 24 * 60 * 60 * 1000;
  return now.getTime() > limit;
}

export function lineLabel(line: {
  brand: string | null;
  productName: string;
  color?: string | null;
  size: string;
  quantity: number;
}): string {
  return `${line.brand ? `${line.brand} — ` : ""}${line.productName}, ${inlineVariantLabel(line)}, ×${line.quantity}`;
}

/** « DR-2026-0001 », quelle que soit la casse ou les espaces saisis. */
export function normalizeReference(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
