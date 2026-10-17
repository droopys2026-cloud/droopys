/**
 * Remise d'un code promo sur un panier.
 *
 * Fonction pure : c'est elle qui fixe le montant que Stripe débitera (voir
 * docs/superpowers/specs/2026-10-17-codes-promo-design.md). Le panier, le
 * tunnel et la création du paiement l'appellent tous, pour qu'il n'existe
 * qu'une seule façon de compter.
 *
 * Règles :
 * - seuls les articles **non soldés** profitent de la remise, et seulement
 *   ceux choisis pour un code « certains produits » ;
 * - un pourcentage s'arrondit au centime, un montant fixe ne dépasse jamais
 *   le total des articles concernés ;
 * - le minimum d'achat se compte sur tout le panier (soldés compris), avant
 *   remise : c'est le montant que la cliente voit au panier ;
 * - la livraison n'est jamais concernée.
 */

export type PromoRules = {
  code: string;
  kind: "percent" | "amount";
  /** Pourcentage (1 à 100) ou montant en centimes, selon `kind`. */
  value: number;
  scope: "site" | "products";
  /** Produits visés, pour `scope: "products"`. */
  productIds: string[];
  endsAt: Date | null;
  maxUses: number | null;
  minSubtotalCents: number | null;
  oncePerCustomer: boolean;
  uses: number;
  active: boolean;
};

export type PromoLine = {
  productId: string;
  unitPriceCents: number;
  quantity: number;
  /** Article soldé (prix barré en vigueur) : exclu de la remise. */
  onSale: boolean;
};

export type PromoRefusal =
  | { ok: false; reason: "inactif" | "expire" | "epuise" | "deja-utilise" | "aucun-article" }
  | { ok: false; reason: "minimum"; minSubtotalCents: number };

export type PromoResult =
  | { ok: true; discountCents: number; eligibleCents: number }
  | PromoRefusal;

export function evaluatePromo(
  rules: PromoRules,
  context: {
    lines: PromoLine[];
    /** Commandes déjà payées avec ce code par cette cliente (0 si inconnue). */
    usedByCustomer: number;
    now: Date;
  },
): PromoResult {
  if (!rules.active) return { ok: false, reason: "inactif" };
  if (rules.endsAt !== null && context.now.getTime() > rules.endsAt.getTime()) {
    return { ok: false, reason: "expire" };
  }
  if (rules.maxUses !== null && rules.uses >= rules.maxUses) {
    return { ok: false, reason: "epuise" };
  }
  if (rules.oncePerCustomer && context.usedByCustomer > 0) {
    return { ok: false, reason: "deja-utilise" };
  }

  const subtotal = context.lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );
  if (rules.minSubtotalCents !== null && subtotal < rules.minSubtotalCents) {
    return { ok: false, reason: "minimum", minSubtotalCents: rules.minSubtotalCents };
  }

  const targets = new Set(rules.productIds);
  const eligibleCents = context.lines
    .filter((line) => !line.onSale && (rules.scope === "site" || targets.has(line.productId)))
    .reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);

  const discountCents =
    rules.kind === "percent"
      ? Math.round((eligibleCents * rules.value) / 100)
      : Math.min(rules.value, eligibleCents);

  if (discountCents <= 0) return { ok: false, reason: "aucun-article" };
  return { ok: true, discountCents, eligibleCents };
}

/** Le motif d'un refus, tel que la cliente le lit sous le champ. */
export function refusalMessage(refusal: PromoRefusal, formatPrice: (cents: number) => string): string {
  switch (refusal.reason) {
    case "inactif":
      return "Ce code n'est pas valable.";
    case "expire":
      return "Ce code a expiré.";
    case "epuise":
      return "Ce code a déjà été utilisé le nombre de fois prévu.";
    case "deja-utilise":
      return "Vous avez déjà utilisé ce code.";
    case "aucun-article":
      return "Ce code ne s'applique à aucun article de votre panier (les articles déjà soldés en sont exclus).";
    case "minimum":
      return `Ce code est valable dès ${formatPrice(refusal.minSubtotalCents)} d'achat.`;
  }
}

/** « BLACK20 », quelle que soit la saisie : espaces retirés, majuscules. */
export function normalizeCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
