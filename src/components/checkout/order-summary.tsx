import { FrameImage } from "@/components/ui/frame-image";
import { formatPrice } from "@/lib/format";
import { variantLabel } from "@/lib/products/variants";
import type { CartPromo } from "@/lib/queries/promo";
import type { CartLine } from "@/types/cart";

/**
 * Récapitulatif du panier, à droite du tunnel. Les montants affichés sont
 * indicatifs : le serveur les recalcule à l'ouverture du paiement, et c'est
 * le bouton « Payer » qui porte le total qui fait foi.
 */
export function OrderSummary({
  lines,
  shippingCents,
  promo,
}: {
  lines: CartLine[];
  /** `null` tant que le mode de livraison n'est pas choisi. */
  shippingCents: number | null;
  promo: CartPromo | null;
}) {
  const discountCents = promo?.ok ? promo.discountCents : 0;
  const itemsCents = lines.reduce(
    (total, line) => total + line.unitPriceCents * line.quantity,
    0,
  );

  return (
    <aside className="checkout-summary" aria-labelledby="recapitulatif">
      <h2 id="recapitulatif" className="account-subtitle">
        Récapitulatif
      </h2>

      <ul className="checkout-summary__lines">
        {lines.map((line) => (
          <li key={line.id} className="checkout-summary__line">
            <FrameImage
              src={line.product.imageUrl}
              alt={`${line.product.brand} — ${line.product.name}`}
              ratio="2 / 3"
              sizes="56px"
            />
            <span>
              <span className="text-caption-muted block">{line.product.brand}</span>
              {line.product.name}
              <span className="account-card__muted block">
                {variantLabel(line)} · ×{line.quantity}
              </span>
            </span>
            <span className="text-strong">
              {formatPrice(line.unitPriceCents * line.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="checkout-summary__totals">
        <div className="checkout-summary__row">
          <span>Sous-total</span>
          <span>{formatPrice(itemsCents)}</span>
        </div>
        {promo && (
          <div className="checkout-summary__row">
            <span>Code {promo.code}</span>
            <span>{promo.ok ? `−${formatPrice(promo.discountCents)}` : "non valable"}</span>
          </div>
        )}
        {promo && !promo.ok && (
          <span className="account-card__muted">
            {promo.message} Retirez-le depuis le panier.
          </span>
        )}
        <div className="checkout-summary__row">
          <span>Livraison</span>
          <span>
            {shippingCents === null
              ? "Étape suivante"
              : shippingCents === 0
                ? "Offerte"
                : formatPrice(shippingCents)}
          </span>
        </div>
        <div className="checkout-summary__row checkout-summary__total">
          <span>Total</span>
          <span>{formatPrice(itemsCents - discountCents + (shippingCents ?? 0))}</span>
        </div>
        <span className="account-card__muted">TVA incluse</span>
      </div>
    </aside>
  );
}
