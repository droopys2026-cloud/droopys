"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { promoLines } from "@/lib/cart/totals";
import { normalizeCode } from "@/lib/promo/discount";
import { writePromoCode } from "@/lib/promo/cookie";
import { getCart } from "@/lib/queries/cart";
import { evaluateCode } from "@/lib/queries/promo";
import { getCurrentUser } from "@/lib/supabase/server";

/**
 * Code promo du panier.
 *
 * L'action ne fait que vérifier et retenir le code : la remise est recalculée
 * à chaque affichage, puis une dernière fois au paiement. Un code refusé n'est
 * pas retenu, pour qu'un mauvais code ne reste pas collé au panier.
 */
export type PromoActionState = { error?: string };

const codeSchema = z
  .string()
  .transform(normalizeCode)
  .pipe(z.string().min(1, "Saisissez un code.").max(30, "Ce code n'existe pas."));

export async function applyPromoCode(
  _state: PromoActionState,
  formData: FormData,
): Promise<PromoActionState> {
  const parsed = codeSchema.safeParse(formData.get("code") ?? "");
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const [lines, user] = await Promise.all([getCart(), getCurrentUser()]);
  if (lines.length === 0) return { error: "Votre panier est vide." };

  const promo = await evaluateCode(parsed.data, promoLines(lines), {
    customerId: user?.id,
    email: user?.email,
  });
  if (!promo.ok) return { error: promo.message };

  await writePromoCode(promo.code);
  refresh();
  return {};
}

export async function removePromoCode() {
  await writePromoCode(null);
  refresh();
}
