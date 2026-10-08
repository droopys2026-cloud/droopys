import { FrameImage } from "@/components/ui/frame-image";

/**
 * Gabarit des pages de connexion : photo d'ambiance à gauche, formulaire à
 * droite. Sous 1024 px la photo passe au-dessus, en paysage, pour ne pas
 * repousser le formulaire hors de l'écran.
 */
export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page pt-7 pb-14">
      <div className="account-auth">
        <FrameImage
          src="/imgdress/connexion.webp"
          alt="Une cliente regarde dans son sac Droopy's"
          ratio="4 / 5"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="max-lg:aspect-[3/2]!"
          imageClassName="object-[55%_50%]"
          priority
        />

        <div className="account-auth__panel">
          <h2 className="account-title">{title}</h2>
          {children}
        </div>
      </div>
    </section>
  );
}
