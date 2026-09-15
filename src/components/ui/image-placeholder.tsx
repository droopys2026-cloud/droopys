/**
 * Cadre d'image. Sert de gabarit tant qu'aucune photo n'est branchée, et de
 * fond derrière les vraies images une fois `next/image` en place — c'est le
 * même cadre, donc aucun saut de mise en page au chargement.

 */
export function ImagePlaceholder({
  ratio = "2 / 3",
  label,
  className = "",
}: {
  ratio?: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className={`box-image-frame w-full ${className}`}
    />
  );
}
