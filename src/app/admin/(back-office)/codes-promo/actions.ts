"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { promoCodeProducts, promoCodes } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { promoInputSchema } from "@/lib/promo/schema";

/**
 * Écriture des codes promo. Chaque action commence par `requireAdmin()` :
 * une Server Action est une route publique.
 */

export type PromoFormState = { errors?: string[] };

const productIdsField = z.array(z.string());

function readProductIds(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || raw === "") return [];
  try {
    const parsed = productIdsField.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    // Liste illisible : vide, et la validation dira qu'il manque des produits.
    return [];
  }
}

/** Le bandeau s'affiche sur toutes les pages : c'est tout le site à rafraîchir. */
function revalidatePromos() {
  revalidatePath("/admin/codes-promo");
  revalidatePath("/", "layout");
}

export async function savePromo(
  _state: PromoFormState,
  formData: FormData,
): Promise<PromoFormState> {
  await requireAdmin();

  const parsed = promoInputSchema.safeParse({
    code: formData.get("code") ?? "",
    kind: formData.get("kind") ?? "",
    value: formData.get("value") ?? "",
    scope: formData.get("scope") ?? "",
    productIds: readProductIds(formData.get("productIds")),
    endsOn: formData.get("endsOn") ?? "",
    maxUses: formData.get("maxUses") ?? "",
    minSubtotal: formData.get("minSubtotal") ?? "",
    oncePerCustomer: formData.get("oncePerCustomer") === "on",
    active: formData.get("active") === "on",
    announce: formData.get("announce") === "on",
    announcement: formData.get("announcement") ?? "",
  });
  if (!parsed.success) return { errors: parsed.error.issues.map((issue) => issue.message) };
  const input = parsed.data;

  const promoId = formData.get("promoId");
  const isUpdate = typeof promoId === "string" && promoId !== "";
  if (isUpdate && !z.string().uuid().safeParse(promoId).success) {
    return { errors: ["Ce code n'existe plus."] };
  }

  // Deux codes identiques : impossible de savoir lequel appliquer. Vérifié
  // avant l'écriture pour un message clair ; l'index unique reste le garde-fou.
  const taken = await db.query.promoCodes.findFirst({
    where: isUpdate
      ? and(eq(promoCodes.code, input.code), ne(promoCodes.id, promoId))
      : eq(promoCodes.code, input.code),
    columns: { id: true },
  });
  if (taken) return { errors: [`Le code ${input.code} existe déjà.`] };

  const values = {
    code: input.code,
    kind: input.kind,
    value: input.value,
    scope: input.scope,
    endsAt: input.endsAt,
    maxUses: input.maxUses,
    minSubtotalCents: input.minSubtotalCents,
    oncePerCustomer: input.oncePerCustomer,
    active: input.active,
    announce: input.announce,
    announcement: input.announcement,
  };

  await db.transaction(async (tx) => {
    let id: string;
    if (isUpdate) {
      const [row] = await tx
        .update(promoCodes)
        .set(values)
        .where(eq(promoCodes.id, promoId))
        .returning({ id: promoCodes.id });
      if (!row) throw new Error("Code promo introuvable.");
      id = row.id;
    } else {
      const [row] = await tx.insert(promoCodes).values(values).returning({ id: promoCodes.id });
      id = row.id;
    }

    await tx.delete(promoCodeProducts).where(eq(promoCodeProducts.promoCodeId, id));
    if (input.productIds.length > 0) {
      await tx
        .insert(promoCodeProducts)
        .values(input.productIds.map((productId) => ({ promoCodeId: id, productId })));
    }
  });

  revalidatePromos();
  redirect("/admin/codes-promo");
}

/** Active ou désactive sans passer par le formulaire. */
export async function togglePromo(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("promoId"));
  if (!id.success) return;

  const promo = await db.query.promoCodes.findFirst({
    where: eq(promoCodes.id, id.data),
    columns: { active: true },
  });
  if (!promo) return;

  await db.update(promoCodes).set({ active: !promo.active }).where(eq(promoCodes.id, id.data));
  revalidatePromos();
}

/**
 * Supprime un code. Les commandes passées avec gardent son nom et leur remise
 * (`orders.promo_code` est un texte, pas une clé étrangère).
 */
export async function deletePromo(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("promoId"));
  if (!id.success) return;

  await db.delete(promoCodes).where(eq(promoCodes.id, id.data));
  revalidatePromos();
}
