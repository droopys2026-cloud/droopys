import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { serverEnv } from "@/lib/env";
import {
  SENDCLOUD_DELIVERED,
  isValidSendcloudSignature,
  parcelStatusSchema,
} from "@/lib/shipping/webhook";

/**
 * Webhook Sendcloud : une commande expédiée passe en « livrée » quand le
 * transporteur annonce la livraison, sans que la boutique ait à cliquer.
 *
 * Mêmes règles que le webhook Stripe :
 * 1. la signature est vérifiée avant toute lecture du corps ;
 * 2. l'appel est idempotent — seule une commande encore « expédiée » change,
 *    un réessai de Sendcloud ne fait donc rien ;
 * 3. tout ce qui n'est pas une livraison est acquitté en 200, sinon
 *    Sendcloud réessaierait indéfiniment des événements qu'on ignore.
 */
export async function POST(request: Request) {
  const secret = serverEnv.SENDCLOUD_SECRET_KEY;
  if (!secret) {
    console.error("SENDCLOUD_SECRET_KEY absente : webhook Sendcloud refusé.");
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }

  // Le corps brut : la signature porte sur les octets reçus.
  const payload = await request.text();
  if (!isValidSendcloudSignature(payload, request.headers.get("sendcloud-signature"), secret)) {
    console.error("Signature Sendcloud invalide.");
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  let json: unknown;
  try {
    json = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Corps illisible." }, { status: 400 });
  }

  const event = parcelStatusSchema.safeParse(json);
  if (!event.success || event.data.parcel.status.id !== SENDCLOUD_DELIVERED) {
    return NextResponse.json({ received: true });
  }

  // Une lettre de test est « livrée » dès sa création : elle ne doit pas
  // faire croire qu'une vraie commande est arrivée.
  const updated = await db
    .update(orders)
    .set({ status: "livree" })
    .where(
      and(
        eq(orders.sendcloudParcelId, event.data.parcel.id),
        eq(orders.status, "expediee"),
        eq(orders.labelIsTest, false),
      ),
    )
    .returning({ id: orders.id, reference: orders.reference });

  for (const order of updated) {
    console.info(`Commande ${order.reference} livrée (Sendcloud).`);
    revalidatePath(`/admin/commandes/${order.id}`);
  }
  if (updated.length > 0) revalidatePath("/admin/commandes");

  return NextResponse.json({ received: true });
}
