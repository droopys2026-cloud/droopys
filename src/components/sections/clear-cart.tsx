"use client";

import { useEffect, useRef } from "react";
import { clearCart } from "@/app/actions/cart";

/**
 * Vide le panier — et le brouillon du tunnel — à l'affichage de la confirmation.
 *
 * Le geste est fait depuis le navigateur parce que le cookie ne peut pas être
 * réécrit par un Server Component. Il est volontairement idempotent et gardé
 * par une référence : React monte deux fois un composant en développement, et
 * vider deux fois un panier déjà vide ne doit rien casser.
 */
export function ClearCartOnMount() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    void clearCart();
    // Le brouillon du tunnel part avec le panier : une prochaine commande ne
    // doit pas s'ouvrir sur l'adresse de celle-ci.
    try {
      sessionStorage.removeItem("droopys_tunnel");
    } catch {
      // Stockage indisponible : il n'y avait rien à effacer.
    }
  }, []);

  return null;
}
