/**
 * Déplacement d'un élément d'un cran dans une liste ordonnée.
 *
 * La fonction ne touche pas la base : elle désigne les deux lignes dont les
 * positions doivent s'échanger, et laisse l'appelant écrire. C'est ce qui
 * permet de la partager entre sous-rayons, rubriques, colonnes et liens, sans
 * qu'un helper générique ait à connaître une table.
 *
 * Un échange plutôt qu'une renumérotation : deux lignes touchées quelle que
 * soit la longueur de la liste.
 */
export type Ordered = { id: string; position: number };

export type Direction = "haut" | "bas";

export function swapTargets<T extends Ordered>(
  /** La liste entière, déjà triée par position. */
  rows: T[],
  id: string,
  direction: Direction,
): { current: T; other: T } | null {
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return null;

  const other = rows[direction === "haut" ? index - 1 : index + 1];
  // Aux extrémités, il n'y a rien à échanger : le bouton est déjà désactivé
  // à l'écran, mais l'action peut être appelée sans passer par lui.
  return other ? { current: rows[index], other } : null;
}
