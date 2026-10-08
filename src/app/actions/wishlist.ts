"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { ensureCustomer } from "@/lib/auth";
import { getCurrentUser } from "@/lib/supabase/server";
import { getWishlistIds } from "@/lib/wishlist/ids";
import { toggleInWishlist } from "@/lib/wishlist/list";
import { readWishlistCookie, writeWishlistCookie } from "@/lib/wishlist/store";

/** Lu au chargement par `WishlistProvider` pour colorer les cœurs. */
export async function loadWishlist(): Promise<string[]> {
  return getWishlistIds();
}

/**
 * Ajoute ou retire un favori : dans le compte si le visiteur est connecté,
 * dans le cookie sinon. Rend l'état final, que le bouton confronte à son
 * état optimiste.
 */
export async function toggleWishlist(productId: unknown): Promise<{ saved: boolean }> {
  const id = z.string().uuid().parse(productId);

  // Un identifiant qui ne correspond à aucun produit est refusé ici plutôt
  // que par la clé étrangère : l'erreur serait la même, le message illisible.
  const product = await db.query.products.findFirst({
    where: (row, { eq: equals }) => equals(row.id, id),
    columns: { id: true },
  });
  if (!product) throw new Error("Produit introuvable.");

  const user = await getCurrentUser();
  let saved: boolean;

  if (user) {
    const customer = await ensureCustomer(user);
    const removed = await db
      .delete(wishlistItems)
      .where(
        and(eq(wishlistItems.customerId, customer.id), eq(wishlistItems.productId, id)),
      )
      .returning({ productId: wishlistItems.productId });

    saved = removed.length === 0;
    if (saved) {
      await db
        .insert(wishlistItems)
        .values({ customerId: customer.id, productId: id })
        .onConflictDoNothing();
    }
  } else {
    const result = toggleInWishlist(await readWishlistCookie(), id);
    await writeWishlistCookie(result.list);
    saved = result.saved;
  }

  revalidatePath("/favoris");
  return { saved };
}
