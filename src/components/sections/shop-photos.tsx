import { FrameImage } from "@/components/ui/frame-image";
import type { Shop } from "@/lib/shops";

/**
 * Photos d'une boutique, deux par ligne. Partagé entre la fiche boutique et
 * la page « À propos » pour que les deux montrent le même magasin, cadré pareil.
 */
export function ShopPhotos({ photos }: { photos: Shop["photos"] }) {
  if (photos.length === 0) return null;

  return (
    <div className="content-shop__photos">
      {photos.map((photo) => (
        <FrameImage
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          // Les photos sont en 3:4 : le cadre suit leur rapport pour ne rien
          // rogner de l'enseigne.
          ratio="3 / 4"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
      ))}
    </div>
  );
}
