import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, promoCodes } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { readPromoCode } from "@/lib/promo/cookie";
import { isSameCustomer, type CustomerIdentity } from "@/lib/promo/identity";
import {
  evaluatePromo,
  refusalMessage,
  type PromoLine,
  type PromoRules,
} from "@/lib/promo/discount";

/**
 * Lecture des codes promo.
 *
 * Jamais en cache : un code se désactive, expire ou s'épuise d'une minute à
 * l'autre, et une remise accordée sur une lecture périmée est de l'argent
 * perdu.
 */

/** Un code par sa saisie normalisée, avec ses produits visés. */
export async function getPromoRules(code: string): Promise<PromoRules | null> {
  const row = await db.query.promoCodes.findFirst({
    where: eq(promoCodes.code, code),
    with: { products: { columns: { productId: true } } },
  });
  if (!row) return null;
  return {
    code: row.code,
    kind: row.kind,
    value: row.value,
    scope: row.scope,
    productIds: row.products.map((entry) => entry.productId),
    endsAt: row.endsAt,
    maxUses: row.maxUses,
    minSubtotalCents: row.minSubtotalCents,
    oncePerCustomer: row.oncePerCustomer,
    uses: row.uses,
    active: row.active,
  };
}

/**
 * Commandes déjà payées avec ce code par cette cliente — reconnue à son
 * compte, son e-mail, son téléphone ou son adresse de livraison à domicile
 * (`isSameCustomer`). Les commandes d'un code se comptent par dizaines : les
 * comparer ici, plutôt qu'en SQL, garde une seule définition de « la même
 * cliente », testée.
 */
export async function countCustomerUses(code: string, identity: CustomerIdentity): Promise<number> {
  const previous = await db
    .select({
      customerId: orders.customerId,
      email: orders.customerEmail,
      phone: orders.customerPhone,
      deliveryMethod: orders.deliveryMethod,
      addressLines: orders.shippingAddress,
    })
    .from(orders)
    .where(eq(orders.promoCode, code));
  return previous.filter((order) => isSameCustomer(identity, order)).length;
}

/** Le code saisi au panier, évalué sur ce panier. */
export type CartPromo =
  | { code: string; ok: true; discountCents: number }
  | { code: string; ok: false; message: string };

/**
 * Évalue un code sur des lignes de panier. `identity` sert à « une fois par
 * cliente » : au panier on ne connaît que le compte connecté, s'il y en a un ;
 * au paiement, e-mail, téléphone et adresse s'y ajoutent, et la règle est
 * vérifiée en entier.
 */
export async function evaluateCode(
  code: string,
  lines: PromoLine[],
  identity: CustomerIdentity,
): Promise<CartPromo> {
  const rules = await getPromoRules(code);
  if (!rules) return { code, ok: false, message: "Ce code n'existe pas." };
  const known = Boolean(identity.customerId || identity.email || identity.phone || identity.addressLines);
  const usedByCustomer = rules.oncePerCustomer && known ? await countCustomerUses(code, identity) : 0;
  const result = evaluatePromo(rules, { lines, usedByCustomer, now: new Date() });
  return result.ok
    ? { code, ok: true, discountCents: result.discountCents }
    : { code, ok: false, message: refusalMessage(result, formatPrice) };
}

/** Le code du cookie, évalué sur le panier ; `null` sans code saisi. */
export async function getCartPromo(
  lines: PromoLine[],
  identity: CustomerIdentity,
): Promise<CartPromo | null> {
  const code = await readPromoCode();
  if (!code) return null;
  return evaluateCode(code, lines, identity);
}

/**
 * Le code « tout le site » à annoncer dans la bande noire, s'il y en a un de
 * valable maintenant. Le plus récent l'emporte.
 */
export async function getAnnouncedPromo() {
  const rows = await db
    .select({
      code: promoCodes.code,
      kind: promoCodes.kind,
      value: promoCodes.value,
      announcement: promoCodes.announcement,
    })
    .from(promoCodes)
    .where(
      and(
        eq(promoCodes.active, true),
        eq(promoCodes.announce, true),
        eq(promoCodes.scope, "site"),
        sql`(${promoCodes.endsAt} is null or ${promoCodes.endsAt} > now())`,
        sql`(${promoCodes.maxUses} is null or ${promoCodes.uses} < ${promoCodes.maxUses})`,
      ),
    )
    .orderBy(desc(promoCodes.createdAt))
    .limit(1);
  return rows[0] ?? null;
}
