import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { MAX_QUANTITY } from "@/lib/cart/limits";

/**
 * Le panier, dans un cookie.
 *
 * Il ne contient **que des identifiants et des quantités** : ni prix, ni nom,
 * ni photo. Tout le reste est relu en base à chaque affichage. Un panier qui
 * porterait ses prix serait un panier dont le client fixe les prix — il suffit
 * d'ouvrir les outils de développement pour payer une parka trois euros.
 *
 * Pas de table `carts` tant qu'il n'y a pas de comptes clients : une ligne en
 * base par visiteur anonyme, ce sont des milliers de paniers abandonnés à
 * nettoyer, pour un service que le cookie rend déjà.
 */
const COOKIE = "droopys_panier";

/** Trente jours : au-delà, les prix et le stock du panier n'ont plus de sens. */
const MAX_AGE = 60 * 60 * 24 * 30;

const cartCookieSchema = z.array(
  z.object({
    /** La variante porte le produit **et** la taille : elle suffit. */
    variantId: z.string().uuid(),
    quantity: z.number().int().min(1).max(MAX_QUANTITY),
  }),
);

export type CartCookie = z.infer<typeof cartCookieSchema>;

/**
 * Lit le panier. Un cookie illisible ou périmé rend un panier vide plutôt
 * qu'une erreur : le visiteur n'a pas à subir un écran rouge parce qu'une
 * version antérieure du site écrivait un autre format.
 */
export async function readCart(): Promise<CartCookie> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = cartCookieSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/**
 * Écrit le panier. N'est appelable que depuis une Server Action ou un Route
 * Handler — un Server Component ne peut pas poser de cookie.
 */
export async function writeCart(lines: CartCookie): Promise<void> {
  const store = await cookies();

  if (lines.length === 0) {
    store.delete(COOKIE);
    return;
  }

  store.set(COOKIE, JSON.stringify(lines), {
    // `httpOnly` : le panier n'a aucune raison d'être lu par du JavaScript, et
    // le fermer retire une prise à une éventuelle injection de script.
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}
