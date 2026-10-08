"use client";

import { useEffect, useOptimistic, useRef } from "react";
import Link from "next/link";
import { FrameImage } from "@/components/ui/frame-image";
import { CartLineControls } from "@/components/sections/cart-line-controls";
import { useCartDrawer } from "@/components/layout/cart-drawer-context";
import { formatPrice } from "@/lib/format";
import {
  cartItemCount,
  cartSubtotalCents,
} from "@/lib/cart/totals";
import type { CartLine } from "@/types/cart";

/**
 * Tiroir du panier : un panneau qui glisse depuis la droite au clic sur
 * l'icône du panier, et qui renvoie vers /panier pour la page complète.
 * La droite, parce que c'est le bord où vit déjà l'icône du panier — le
 * panneau sort de sous le doigt plutôt qu'à l'opposé de l'écran.
 *
 * Le panneau est TOUJOURS monté, seule sa transformation change : un montage
 * conditionnel supprimerait la transition d'entrée, exactement comme pour la
 * barre collante (voir `.sticky-header` dans sections.css). Replié, il est
 * mis hors circuit par `inert` — sinon ses liens resteraient atteignables à
 * la tabulation alors qu'ils sont invisibles.
 */
type LineChange =
  | { kind: "retrait"; id: string }
  | { kind: "quantite"; id: string; quantity: number };

export function CartDrawer({ lines: serverLines }: { lines: CartLine[] }) {
  const { isOpen, close } = useCartDrawer();
  // Affichage optimiste : la ligne disparaît (ou change de quantité) dès le
  // clic, sans attendre que le serveur ait réaffiché la page. Si l'action
  // échoue, React revient de lui-même à la liste du serveur.
  const [lines, applyChange] = useOptimistic(
    serverLines,
    (current: CartLine[], change: LineChange) =>
      change.kind === "retrait"
        ? current.filter((line) => line.id !== change.id)
        : current.map((line) =>
            line.id === change.id ? { ...line, quantity: change.quantity } : line,
          ),
  );
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const count = cartItemCount(lines);
  const subtotalCents = cartSubtotalCents(lines);

  // Échap ferme le tiroir : c'est le geste attendu de tout panneau modal, et
  // l'écouteur est posé sur le document car le focus peut être n'importe où.
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Tant que le tiroir est ouvert, la page derrière ne défile pas : sans cela
  // un geste sur le tiroir emporte le contenu au lieu du panneau.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Le focus entre dans le tiroir à l'ouverture et revient d'où il venait à la
  // fermeture : sans ce retour, le clavier repartirait du début du document.
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
      return;
    }
    openerRef.current?.focus();
    openerRef.current = null;
  }, [isOpen]);

  return (
    <>
      {/* Voile cliquable. `aria-hidden` : il ne porte aucune information, le
          bouton « Fermer » du panneau offre déjà la même sortie au clavier. */}
      <div
        aria-hidden
        className={`drawer-scrim ${isOpen ? "is-open" : ""}`}
        onClick={close}
      />

      <aside
        id="tiroir-panier"
        aria-label="Panier"
        inert={!isOpen}
        className={`drawer ${isOpen ? "is-open" : ""}`}
      >
        <div className="drawer__head">
          <h2 className="text-brand-label m-0">
            Mon panier
            {count > 0 && (
              <span className="text-caption-muted ml-2">
                {count} article{count > 1 ? "s" : ""}
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button-muted-border"
            onClick={close}
          >
            <span className="sr-only">Fermer le panier</span>
            <span aria-hidden>&times;</span>
          </button>
        </div>

        <div className="drawer__body">
          {lines.length === 0 ? (
            <p className="text-paragraph m-0">
              Votre panier est vide pour le moment.
            </p>
          ) : (
            <ul className="flex flex-col gap-9">
              {lines.map((line) => (
                <li key={line.id} className="flex items-start gap-7">
                  <Link
                    href={`/produits/${line.product.slug}`}
                    className="w-16 shrink-0"
                    onClick={close}
                  >
                    <FrameImage
                      src={line.product.imageUrl}
                      alt={`${line.product.brand} — ${line.product.name}`}
                      sizes="71px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-caption-muted">
                      {line.product.brand}
                    </span>
                    <Link
                      href={`/produits/${line.product.slug}`}
                      className="link-underline-sm"
                      onClick={close}
                    >
                      <span className="text-brand-label">
                        {line.product.name}
                      </span>
                    </Link>
                    <span className="text-caption-muted">
                      Taille {line.size}
                    </span>
                    <span className="text-strong">
                      {formatPrice(line.product.priceCents * line.quantity)}
                    </span>
                    {/* Les mêmes contrôles que la page panier : retirer un
                        article ne doit pas obliger à quitter la page. */}
                    <CartLineControls
                      variantId={line.id}
                      quantity={line.quantity}
                      stock={line.stock}
                      label={`${line.product.brand} — ${line.product.name}, taille ${line.size}`}
                      onRemove={() => applyChange({ kind: "retrait", id: line.id })}
                      onQuantity={(quantity) =>
                        applyChange({ kind: "quantite", id: line.id, quantity })
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer__foot">
          <p className="m-0 flex items-baseline justify-between">
            <span className="text-brand-label">Sous-total</span>
            <span className="text-strong">{formatPrice(subtotalCents)}</span>
          </p>

          {lines.length > 0 && (
            <p className="text-caption-muted m-0">
              Livraison calculée à l&apos;étape suivante, selon le transporteur.
            </p>
          )}

          <Link href="/panier" className="link-cta-block" onClick={close}>
            Voir mon panier
          </Link>
          <button type="button" className="link-underline-sm" onClick={close}>
            Continuer mes achats
          </button>
        </div>
      </aside>
    </>
  );
}
