"use client";

import { useState } from "react";
import { FrameImage } from "@/components/ui/frame-image";

/**
 * Galerie de la fiche produit : une bande de miniatures et la vue courante.
 *
 * Les miniatures sont des boutons et non des images cliquables : elles
 * changent l'état de la page, elles ne mènent nulle part. C'est aussi ce qui
 * les rend atteignables au clavier sans rien ajouter.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="product-gallery">
      {/* Une seule photo : la bande de miniatures n'aurait rien à montrer. */}
      {images.length > 1 && (
        <div
          className="product-gallery__thumbs"
          role="tablist"
          aria-label="Vues du produit"
        >
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-current={index === current}
              aria-label={`Vue ${index + 1} sur ${images.length}`}
              className="product-thumb"
              onClick={() => setCurrent(index)}
            >
              <FrameImage src={image} alt="" ratio="2 / 3" sizes="76px" />
            </button>
          ))}
        </div>
      )}

      <FrameImage
        src={images[current]}
        alt={alt}
        ratio="4 / 5"
        sizes="(max-width: 1024px) 100vw, 55vw"
        priority
      />
    </div>
  );
}
