import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { wishlistItems } from "@/db/schema";
import { getCurrentUser } from "@/lib/supabase/server";
import { readWishlistCookie } from "@/lib/wishlist/store";

/**
 * Identifiants des favoris du visiteur, le plus récent d'abord : ceux du
 * compte s'il est connecté, ceux du cookie sinon. Les deux ne coexistent
 * jamais longtemps — le cookie est versé dans le compte à la connexion.
 */
export async function getWishlistIds(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return readWishlistCookie();

  const rows = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.customerId, user.id))
    .orderBy(desc(wishlistItems.createdAt));
  return rows.map((row) => row.productId);
}
