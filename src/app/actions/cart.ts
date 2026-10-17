"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { productVariants, products } from "@/db/schema";
import { readCart, writeCart } from "@/lib/cart/cookie";
import { MAX_QUANTITY } from "@/lib/cart/limits";
import { writePromoCode } from "@/lib/promo/cookie";

/**
 * Gestes du panier.
 *
 * Une action n'accepte jamais de prix : elle reçoit une variante et une
 * quantité, et vérifie en base que la variante existe, qu'elle appartient à
 * un produit publié, et qu'elle est en stock. Le montant se calcule au
 * paiement, à partir du catalogue — jamais à partir de ce qui arrive du
 * navigateur.
 */
/**
 * Le panier s'affiche sur toutes les pages — pastille de l'en-tête, tiroir —
 * donc c'est la page en cours qu'il faut réafficher, quelle qu'elle soit.
 *
 * `refresh` et non `revalidatePath("/", "layout")` : ce dernier jetait aussi
 * le cache du catalogue, et l'accueil recalculait tous ses carrousels pour un
 * simple retrait d'article — de quoi faire attendre plus d'une minute quand
 * la base traîne. Le panier vit dans un cookie, aucune donnée en cache n'a
 * changé : il suffit de réafficher.
 */
function revalidateCart() {
  refresh();
}

export type CartActionState = { error?: string; added?: boolean };

const addSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(MAX_QUANTITY),
});

export async function addToCart(
  _state: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const parsed = addSchema.safeParse({
    variantId: formData.get("variantId"),
    quantity: formData.get("quantity") ?? 1,
  });
  if (!parsed.success) return { error: "Choisissez une taille disponible." };

  const variant = await db
    .select({ id: productVariants.id, stock: productVariants.quantity })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(
      and(
        eq(productVariants.id, parsed.data.variantId),
        eq(products.published, true),
      ),
    )
    .limit(1);

  const found = variant[0];
  if (!found) return { error: "Cet article n'est plus disponible." };
  if (found.stock <= 0) return { error: "Cette taille est épuisée." };

  const cart = await readCart();
  const existing = cart.find((line) => line.variantId === found.id);

  // Le stock borne la quantité côté serveur : un panier ne promet jamais plus
  // que ce qui existe, quoi qu'ait envoyé le navigateur.
  const wanted = (existing?.quantity ?? 0) + parsed.data.quantity;
  const quantity = Math.min(wanted, found.stock, MAX_QUANTITY);

  await writeCart(
    existing
      ? cart.map((line) =>
          line.variantId === found.id ? { ...line, quantity } : line,
        )
      : [...cart, { variantId: found.id, quantity }],
  );

  revalidateCart();

  // « Acheter maintenant » : même ajout, puis droit au tunnel. Le reste du
  // panier y part aussi — on n'efface jamais ce que le client avait choisi.
  if (formData.get("intent") === "acheter") redirect("/commande");

  return { added: true };
}

const updateSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.coerce.number().int().min(0).max(MAX_QUANTITY),
});

/** Change la quantité d'une ligne. Zéro retire la ligne : c'est le même geste. */
export async function updateCartLine(formData: FormData) {
  const parsed = updateSchema.safeParse({
    variantId: formData.get("variantId"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) return;

  const cart = await readCart();

  await writeCart(
    parsed.data.quantity === 0
      ? cart.filter((line) => line.variantId !== parsed.data.variantId)
      : cart.map((line) =>
          line.variantId === parsed.data.variantId
            ? { ...line, quantity: parsed.data.quantity }
            : line,
        ),
  );

  revalidateCart();
}

export async function removeCartLine(formData: FormData) {
  const id = z.string().uuid().safeParse(formData.get("variantId"));
  if (!id.success) return;

  const cart = await readCart();
  await writeCart(cart.filter((line) => line.variantId !== id.data));
  revalidateCart();
}

/** Vide le panier. Appelé après un paiement abouti. */
export async function clearCart() {
  await writeCart([]);
  // Le code a servi : le garder l'appliquerait d'office à la commande suivante.
  await writePromoCode(null);
  revalidateCart();
}
