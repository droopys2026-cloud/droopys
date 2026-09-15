import Link from "next/link";

/**
 * État de la page des favoris.
 *
 * Elle est toujours vide, et ce n'est pas un oubli : le cœur des cartes
 * produit est un état local (`WishlistButton`), il disparaît au changement de
 * page. Tant qu'il n'y a ni compte ni stockage, afficher une liste ici
 * reviendrait à inventer des favoris que l'utilisateur n'a pas.
 */
export function WishlistEmpty() {
  return (
    <section className="container-page flex flex-col items-center gap-9 py-17 text-center">
      <p className="text-paragraph m-0">
        Votre liste de favoris est vide pour le moment.
      </p>
      <p className="text-caption-muted m-0 max-w-[48ch]">
        Touchez le cœur d&apos;un article pour le mettre de côté. La
        conservation d&apos;une liste d&apos;une visite à l&apos;autre arrivera
        avec les comptes client.
      </p>
      <Link href="/" className="link-cta-block">
        Découvrir les nouveautés
      </Link>
    </section>
  );
}
