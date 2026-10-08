import "server-only";

import { listShippingMethods, SendcloudUnavailable } from "@/lib/shipping/sendcloud";
import { quoteServices, type ShippingOption } from "@/lib/shipping/services";
import { parcelWeightGrams, type ParcelWeights } from "@/lib/shipping/weight";

/** Poids estimé du colis en kilos, d'après la nature des pièces (Réglages). */
export function parcelWeightKg(
  lines: { categorySlug: string | null; subcategorySlug: string | null; quantity: number }[],
  weights: ParcelWeights,
): number {
  return parcelWeightGrams(lines, weights) / 1000;
}

/**
 * Options de livraison Sendcloud pour un colis, ou `null` si Sendcloud est
 * injoignable ou non configuré. `null` et non une liste vide : « aucun service
 * pour ce poids » et « tarifs indisponibles » ne se disent pas pareil à la
 * cliente, et le retrait en boutique reste possible dans les deux cas.
 */
export async function quoteParcel(
  country: string,
  weightKg: number,
): Promise<ShippingOption[] | null> {
  try {
    return quoteServices(await listShippingMethods(country), country, weightKg);
  } catch (error) {
    // Bruyant : un tunnel sans tarifs ne vend plus qu'en retrait boutique.
    console.error(
      "Tarifs Sendcloud indisponibles :",
      error instanceof SendcloudUnavailable ? error.message : error,
    );
    return null;
  }
}
