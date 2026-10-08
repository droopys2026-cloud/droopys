import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { fetchLabelPdf } from "@/lib/shipping/labels";

/**
 * L'étiquette d'une commande, en PDF, pour impression.
 *
 * Le fichier vit chez Sendcloud derrière la clé secrète : on le relaie ici
 * plutôt que d'envoyer le navigateur chez Sendcloud, qui demanderait la clé.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireAdmin();

  const id = z.string().uuid().safeParse((await params).id);
  if (!id.success) return new Response("Commande introuvable.", { status: 404 });

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id.data),
    columns: { reference: true, sendcloudParcelId: true },
  });
  if (!order?.sendcloudParcelId) {
    return new Response("Cette commande n'a pas d'étiquette.", { status: 404 });
  }

  try {
    const pdf = await fetchLabelPdf(order.sendcloudParcelId);
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        // `inline` : le PDF s'ouvre dans l'onglet, prêt à imprimer.
        "Content-Disposition": `inline; filename="etiquette-${order.reference}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(`Étiquette de ${order.reference} illisible chez Sendcloud :`, error);
    return new Response("Sendcloud n'a pas rendu l'étiquette. Réessayez dans un instant.", {
      status: 502,
    });
  }
}
