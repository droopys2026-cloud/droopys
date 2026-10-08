import Link from "next/link";

/**
 * Page des favoris sans favori. Un visiteur non connecté apprend que sa
 * liste ne tient qu'à cet appareil, et comment la garder.
 */
export function WishlistEmpty({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="container-page flex flex-col items-center gap-9 py-17 text-center">
      <p className="text-paragraph m-0">
        Votre liste de favoris est vide pour le moment.
      </p>
      <p className="text-caption-muted m-0 max-w-[48ch]">
        Touchez le cœur d&apos;un article pour le mettre de côté.
        {!signedIn &&
          " Sans compte, vos favoris restent sur cet appareil ; connectez-vous pour les retrouver partout."}
      </p>
      {signedIn ? (
        <Link href="/nouveautes" className="link-cta-block">
          Découvrir les nouveautés
        </Link>
      ) : (
        <Link href="/compte/connexion?suite=%2Ffavoris" className="link-cta-block">
          Me connecter
        </Link>
      )}
    </section>
  );
}
