import "server-only";

import { cookies } from "next/headers";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { parseWishlist } from "@/lib/wishlist/list";

/**
 * Favoris d'un visiteur non connecté, dans un cookie.
 *
 * Seuls des identifiants de produit y sont rangés : le nom, la photo et le
 * prix sont relus en base à l'affichage, comme pour le panier.
 */
const COOKIE = "droopys_favoris";

/** Un an : un favori est une intention qui dure plus qu'un panier. */
const MAX_AGE = 60 * 60 * 24 * 365;

export async function readWishlistCookie(): Promise<string[]> {
  return parseWishlist((await cookies()).get(COOKIE)?.value);
}

/** Server Action ou Route Handler uniquement : un Server Component ne peut pas poser de cookie. */
export async function writeWishlistCookie(ids: string[]): Promise<void> {
  const store = await cookies();
  if (ids.length === 0) {
    store.delete(COOKIE);
    return;
  }
  store.set(COOKIE, JSON.stringify(ids), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/**
 * Verse les favoris du cookie dans le compte, puis vide le cookie.
 *
 * Appelé à chaque connexion. `on conflict do nothing` : une pièce déjà en
 * favori sur le compte n'est pas un doublon, c'est la même envie. Un
 * identifiant de produit supprimé entre-temps ferait échouer la clé
 * étrangère ; on ne verse donc que ceux qui existent encore.
 */
export async function mergeWishlistCookie(customerId: string): Promise<void> {
  const ids = await readWishlistCookie();
  if (ids.length === 0) return;

  const existing = await db.query.products.findMany({
    where: (product, { inArray }) => inArray(product.id, ids),
    columns: { id: true },
  });

  if (existing.length > 0) {
    await db
      .insert(wishlistItems)
      .values(existing.map(({ id }) => ({ customerId, productId: id })))
      .onConflictDoNothing();
  }
  await writeWishlistCookie([]);
}
