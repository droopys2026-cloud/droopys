import "server-only";

import { cookies } from "next/headers";
import { normalizeCode } from "@/lib/promo/discount";

/**
 * Le code promo saisi au panier, dans un cookie à part.
 *
 * Il ne porte que le code, jamais la remise : la remise est recalculée à
 * chaque affichage et revérifiée au paiement (`@/lib/promo/discount`). Un
 * cookie qui porterait le montant serait un montant fixé par le navigateur.
 */
const COOKIE = "droopys_promo";

/** Même durée que le panier : le code vit avec lui. */
const MAX_AGE = 60 * 60 * 24 * 30;

export async function readPromoCode(): Promise<string | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  const code = raw ? normalizeCode(raw) : "";
  return code === "" ? null : code;
}

/** Server Action ou Route Handler seulement — un Server Component ne pose pas de cookie. */
export async function writePromoCode(code: string | null): Promise<void> {
  const store = await cookies();
  if (code === null) {
    store.delete(COOKIE);
    return;
  }
  store.set(COOKIE, code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
