"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { orders, withdrawals } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { sendShippingNotification } from "@/lib/email/send-shipping-notification";
import { publicEnv } from "@/lib/env";
import { getShopSettings } from "@/lib/queries/settings";
import { createLabel, type CreatedLabel } from "@/lib/shipping/labels";
import { SERVICES } from "@/lib/shipping/services";
import { parcelWeightGrams } from "@/lib/shipping/weight";

/**
 * Suivi des commandes.
 *
 * Comme pour le catalogue, chaque action vérifie la session : une Server
 * Action est une route publique, la protection de la mise en page ne s'y
 * applique pas.
 */

const statusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["a-preparer", "expediee", "livree", "retour", "annulee", "remboursee"]),
});

export async function changeOrderStatus(formData: FormData) {
  await requireAdmin();

  const parsed = statusSchema.safeParse({
    orderId: formData.get("orderId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await db
    .update(orders)
    .set({ status: parsed.data.status })
    .where(eq(orders.id, parsed.data.orderId));

  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${parsed.data.orderId}`);
}

export type LabelState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "created"; isTest: boolean };

/**
 * Crée l'étiquette Sendcloud d'une commande, enregistre le suivi, passe la
 * commande en « expédiée » et prévient la cliente.
 *
 * Une seule étiquette par commande : la recréer ferait payer deux fois le
 * transporteur. Pour en refaire une, il faut d'abord annuler la première dans
 * Sendcloud — ce n'est pas un geste à laisser à un double clic.
 */
export async function createShippingLabel(
  _state: LabelState,
  formData: FormData,
): Promise<LabelState> {
  await requireAdmin();

  const id = z.string().uuid().safeParse(formData.get("orderId"));
  if (!id.success) return { status: "error", message: "Commande introuvable." };

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id.data),
    with: {
      lines: {
        with: {
          product: {
            columns: {},
            with: {
              category: { columns: { slug: true } },
              subcategory: { columns: { slug: true } },
            },
          },
        },
      },
    },
  });
  if (!order) return { status: "error", message: "Commande introuvable." };
  if (order.sendcloudParcelId) {
    return { status: "error", message: "Cette commande a déjà son étiquette." };
  }
  if (order.deliveryMethod === "retrait") {
    return { status: "error", message: "Un retrait en boutique n'a pas d'étiquette." };
  }

  // Commande passée avant le choix du transporteur au tunnel : l'admin le
  // choisit ici. Seuls les services à domicile sont proposés — un relais
  // demanderait un point relais que la cliente n'a jamais choisi.
  let shippingService = order.shippingService;
  if (!shippingService) {
    const picked = String(formData.get("service") ?? "");
    const service = SERVICES.find((entry) => entry.key === picked && entry.kind === "domicile");
    if (!service) {
      return { status: "error", message: "Choisissez le transporteur de cette commande." };
    }
    shippingService = service.key;
    await db.update(orders).set({ shippingService }).where(eq(orders.id, order.id));
  }

  const { livraison } = await getShopSettings();
  const weightGrams = parcelWeightGrams(
    order.lines.map((line) => ({
      categorySlug: line.product?.category?.slug ?? null,
      subcategorySlug: line.product?.subcategory?.slug ?? null,
      quantity: line.quantity,
    })),
    livraison.weights,
  );
  const itemsCents = order.lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  let label: CreatedLabel;
  try {
    label = await createLabel({
      reference: order.reference,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      shippingService,
      servicePointId: order.servicePointId,
      shippingAddress: order.shippingAddress,
      totalCents: itemsCents + order.shippingCents,
      weightGrams,
    });
  } catch (error) {
    console.error(`Étiquette de ${order.reference} non créée :`, error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? `Sendcloud a refusé l'étiquette : ${error.message}`
          : "Sendcloud n'a pas répondu. Réessayez dans un instant.",
    };
  }

  await db
    .update(orders)
    .set({
      sendcloudParcelId: label.parcelId,
      trackingNumber: label.trackingNumber,
      trackingUrl: label.trackingUrl,
      labelCreatedAt: new Date(),
      labelIsTest: label.isTest,
      status: "expediee",
    })
    .where(eq(orders.id, order.id));

  // Pas d'avis à la cliente pour une étiquette de test : aucun colis ne part.
  if (!label.isTest) {
    await sendShippingNotification(order.customerEmail, {
      reference: order.reference,
      customerName: order.customerName,
      deliveryMethod: order.deliveryMethod,
      serviceLabel:
        SERVICES.find((service) => service.key === shippingService)?.label ?? "notre transporteur",
      trackingNumber: label.trackingNumber,
      trackingUrl: label.trackingUrl,
      siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    });
  }

  revalidatePath("/admin/commandes");
  revalidatePath(`/admin/commandes/${order.id}`);
  return { status: "created", isTest: label.isTest };
}

/** Marque une rétractation comme traitée (articles reçus, remboursement fait). */
export async function markWithdrawalHandled(formData: FormData) {
  await requireAdmin();
  const parsed = z
    .object({ withdrawalId: z.string().uuid(), orderId: z.string().uuid() })
    .safeParse({ withdrawalId: formData.get("withdrawalId"), orderId: formData.get("orderId") });
  if (!parsed.success) return;

  await db
    .update(withdrawals)
    .set({ handledAt: new Date() })
    .where(eq(withdrawals.id, parsed.data.withdrawalId));
  revalidatePath(`/admin/commandes/${parsed.data.orderId}`);
}
