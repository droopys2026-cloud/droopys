import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { formatPrice } from "@/lib/format";
import {
  amountToFreeShippingCents,
  cartItemCount,
  cartSubtotalCents,
} from "@/lib/cart";
import type { CartLine } from "@/types/cart";

/**
 * Page panier : la liste des articles à gauche, le récapitulatif à droite.
 *
 * Rien n'est modifiable pour l'instant — pas de quantité, pas de suppression.
 * Ces gestes supposent un panier persistant (session ou API) qui n'existe pas
 * encore ; les afficher inertes tromperait le client. À brancher ici.
 */
export function CartDetail({ lines }: { lines: CartLine[] }) {
  const count = cartItemCount(lines);
  const subtotalCents = cartSubtotalCents(lines);
  const missingCents = amountToFreeShippingCents(lines);

  if (lines.length === 0) {
    return (
      <section className="container-page flex flex-col items-center py-14 text-center">
        <h1 className="heading-h2 pt-0">Mon panier</h1>
        <p className="text-paragraph m-0">Votre panier est vide.</p>
        <Link href="/" className="link-cta-block">
          Découvrir la sélection
        </Link>
      </section>
    );
  }

  return (
    <section className="container-page py-14">
      <h1 className="heading-h2 pt-0">
        Mon panier
        <span className="text-caption-muted ml-6">
          {count} article{count > 1 ? "s" : ""}
        </span>
      </h1>

      <div className="flex flex-col gap-13 lg:flex-row lg:items-start lg:gap-17">
        <ul className="flex flex-1 flex-col gap-11">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex items-start gap-9 border-b border-[var(--color-border-muted)] pb-11"
            >
              <Link
                href={`/produits/${line.product.slug}`}
                className="w-17 shrink-0"
              >
                <FrameImage
                  src={line.product.imageUrl}
                  alt={`${line.product.brand} — ${line.product.name}`}
                  sizes="100px"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-caption-muted">{line.product.brand}</span>
                <Link
                  href={`/produits/${line.product.slug}`}
                  className="link-underline-sm"
                >
                  <span className="text-brand-label">{line.product.name}</span>
                </Link>
                <span className="text-caption-muted">
                  Taille {line.size} · Quantité {line.quantity}
                </span>
              </div>

              <span className="text-strong shrink-0">
                {formatPrice(line.product.priceCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {/* Récapitulatif : fond gris clair, l'une des trois sous-surfaces
            relevées, ce qui le détache de la liste sans nouvelle couleur. */}
        <aside className="bg-surface-alt flex w-full flex-col gap-7 p-11 lg:w-96 lg:shrink-0">
          <h2 className="text-brand-label m-0">Récapitulatif</h2>

          <p className="m-0 flex items-baseline justify-between">
            <span className="text-caption-muted">Sous-total</span>
            <span className="text-strong">{formatPrice(subtotalCents)}</span>
          </p>

          <p className="m-0 flex items-baseline justify-between">
            <span className="text-caption-muted">Livraison</span>
            <span className="text-strong">
              {missingCents > 0 ? "Calculée à l'étape suivante" : "Offerte"}
            </span>
          </p>

          {missingCents > 0 && (
            <p className="text-caption-muted m-0">
              Plus que {formatPrice(missingCents)} pour la livraison offerte.
            </p>
          )}

          <Link href="/commande" className="link-cta-block text-center">
            Passer commande
          </Link>
        </aside>
      </div>
    </section>
  );
}
