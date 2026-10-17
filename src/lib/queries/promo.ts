import "server-only";

import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, promoCodes } from "@/db/schema";
import { formatPrice } from "@/lib/format";
import { readPromoCode } from "@/lib/promo/cookie";
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

/** Commandes déjà payées avec ce code par cette adresse e-mail. */
export async function countCustomerUses(code: string, email: string): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(orders)
    .where(
      and(
        eq(orders.promoCode, code),
        sql`lower(${orders.customerEmail}) = lower(${email.trim()})`,
      ),
    );
  return row?.total ?? 0;
}

/** Le code saisi au panier, évalué sur ce panier. */
export type CartPromo =
  | { code: string; ok: true; discountCents: number }
  | { code: string; ok: false; message: string };

/**
 * Évalue un code sur des lignes de panier. `email` sert à « une fois par
 * cliente » : sans lui (visiteuse non connectée, au panier), la règle n'est
 * vérifiée qu'au paiement, quand l'e-mail est connu.
 */
export async function evaluateCode(
  code: string,
  lines: PromoLine[],
  email: string | null,
): Promise<CartPromo> {
  const rules = await getPromoRules(code);
  if (!rules) return { code, ok: false, message: "Ce code n'existe pas." };
  const usedByCustomer =
    rules.oncePerCustomer && email ? await countCustomerUses(code, email) : 0;
  const result = evaluatePromo(rules, { lines, usedByCustomer, now: new Date() });
  return result.ok
    ? { code, ok: true, discountCents: result.discountCents }
    : { code, ok: false, message: refusalMessage(result, formatPrice) };
}

/** Le code du cookie, évalué sur le panier ; `null` sans code saisi. */
export async function getCartPromo(
  lines: PromoLine[],
  email: string | null,
): Promise<CartPromo | null> {
  const code = await readPromoCode();
  if (!code) return null;
  return evaluateCode(code, lines, email);
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
