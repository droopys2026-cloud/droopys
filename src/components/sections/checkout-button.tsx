import Link from "next/link";

/**
 * « Passer commande » : mène au tunnel. Un simple lien désormais — la session
 * de paiement ne s'ouvre qu'à l'étape 3, une fois coordonnées et livraison
 * connues, et c'est une action, jamais un chargement de page.
 */
export function CheckoutButton() {
  return (
    <Link href="/commande" className="link-cta-block text-center">
      Passer commande
    </Link>
  );
}
