"use server";

import { and, desc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { customerAddresses } from "@/db/schema";
import { requireCustomer } from "@/lib/auth";
import {
  addressSchema,
  issueMessages,
  pickValues,
  type FormValues,
} from "@/lib/account/schema";

/**
 * Carnet d'adresses.
 *
 * Chaque écriture filtre sur `customer_id` **dans la requête** : changer
 * l'identifiant d'adresse dans le formulaire ne permet pas de toucher celle
 * d'un autre client — la requête ne trouve simplement rien.
 */

export type AddressFormState =
  | { status: "idle" }
  | { status: "error"; errors: string[]; values: FormValues };

const PATH = "/compte/adresses";
const MAX_ADDRESSES = 10;

const ADDRESS_FIELDS = [
  "fullName",
  "line1",
  "line2",
  "postalCode",
  "city",
  "country",
  "phone",
] as const;

function readAddress(formData: FormData) {
  return addressSchema.safeParse({
    fullName: formData.get("fullName") ?? "",
    line1: formData.get("line1") ?? "",
    line2: formData.get("line2") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    city: formData.get("city") ?? "",
    country: formData.get("country") ?? "",
    phone: formData.get("phone") ?? "",
    isDefault: formData.get("isDefault") === "on",
  });
}

/** Crée (sans `addressId`) ou modifie (avec) une adresse. */
export async function saveAddress(
  _state: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const { customer } = await requireCustomer(PATH);

  const parsed = readAddress(formData);
  const values = pickValues(formData, ADDRESS_FIELDS);
  if (!parsed.success) {
    return { status: "error", errors: issueMessages(parsed.error), values };
  }

  const rawId = formData.get("addressId");
  const addressId = rawId ? z.string().uuid().safeParse(rawId) : null;
  if (addressId && !addressId.success) {
    return { status: "error", errors: ["Adresse introuvable."], values };
  }

  const existing = await db
    .select({ id: customerAddresses.id, isDefault: customerAddresses.isDefault })
    .from(customerAddresses)
    .where(eq(customerAddresses.customerId, customer.id));

  // Propriété vérifiée sur les adresses **de ce client** : l'identifiant d'un
  // autre client n'y figure pas, et la modification s'arrête là.
  if (addressId && !existing.some((row) => row.id === addressId.data)) {
    return { status: "error", errors: ["Adresse introuvable."], values };
  }
  if (!addressId && existing.length >= MAX_ADDRESSES) {
    return {
      status: "error",
      errors: [`${MAX_ADDRESSES} adresses au plus : supprimez-en une avant d'en ajouter.`],
      values,
    };
  }

  // La première adresse est l'adresse par défaut, qu'on l'ait cochée ou non,
  // et l'adresse par défaut le reste tant qu'une autre ne prend pas sa place :
  // un carnet sans adresse par défaut n'aurait rien à préremplir.
  const wasDefault = existing.some(
    (row) => row.id === addressId?.data && row.isDefault,
  );
  const isDefault = parsed.data.isDefault || existing.length === 0 || wasDefault;
  const row = { ...parsed.data, isDefault };

  await db.transaction(async (tx) => {
    // Décocher l'ancienne d'abord : l'index unique refuserait deux adresses
    // par défaut le temps de l'écriture.
    if (isDefault) {
      await tx
        .update(customerAddresses)
        .set({ isDefault: false })
        .where(eq(customerAddresses.customerId, customer.id));
    }

    if (addressId) {
      await tx
        .update(customerAddresses)
        .set(row)
        .where(
          and(
            eq(customerAddresses.id, addressId.data),
            eq(customerAddresses.customerId, customer.id),
          ),
        );
    } else {
      await tx
        .insert(customerAddresses)
        .values({ ...row, customerId: customer.id });
    }
  });

  revalidatePath(PATH);
  redirect(PATH);
}

/** Supprime une adresse ; si c'était celle par défaut, la plus récente prend le relais. */
export async function deleteAddress(formData: FormData) {
  const { customer } = await requireCustomer(PATH);

  const id = z.string().uuid().safeParse(formData.get("addressId"));
  if (!id.success) return;

  await db.transaction(async (tx) => {
    const [removed] = await tx
      .delete(customerAddresses)
      .where(
        and(
          eq(customerAddresses.id, id.data),
          eq(customerAddresses.customerId, customer.id),
        ),
      )
      .returning({ isDefault: customerAddresses.isDefault });

    if (!removed?.isDefault) return;

    const [next] = await tx
      .select({ id: customerAddresses.id })
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customer.id))
      .orderBy(desc(customerAddresses.createdAt))
      .limit(1);
    if (next) {
      await tx
        .update(customerAddresses)
        .set({ isDefault: true })
        .where(eq(customerAddresses.id, next.id));
    }
  });

  revalidatePath(PATH);
}

export async function setDefaultAddress(formData: FormData) {
  const { customer } = await requireCustomer(PATH);

  const id = z.string().uuid().safeParse(formData.get("addressId"));
  if (!id.success) return;

  await db.transaction(async (tx) => {
    const target = await tx
      .select({ id: customerAddresses.id })
      .from(customerAddresses)
      .where(
        and(
          eq(customerAddresses.id, id.data),
          eq(customerAddresses.customerId, customer.id),
        ),
      );
    if (target.length === 0) return;

    await tx
      .update(customerAddresses)
      .set({ isDefault: false })
      .where(
        and(
          eq(customerAddresses.customerId, customer.id),
          ne(customerAddresses.id, id.data),
        ),
      );
    await tx
      .update(customerAddresses)
      .set({ isDefault: true })
      .where(eq(customerAddresses.id, id.data));
  });

  revalidatePath(PATH);
}
