import Link from "next/link";

/**
 * État vide d'un rayon : affiché tant qu'aucun article n'y est rattaché.
 * Le bouton renvoie à l'accueil plutôt que de laisser le visiteur sur une
 * page sans issue — c'est la seule action utile à cet endroit.
 */
export function EmptyCollection() {
  return (
    <section className="container-page flex flex-col items-center gap-9 py-17 text-center">
      <p className="text-paragraph m-0">Cette collection est vide</p>
      <Link href="/" className="link-cta-block">
        Continue shopping
      </Link>
    </section>
  );
}
