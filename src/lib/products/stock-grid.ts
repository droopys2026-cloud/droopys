/**
 * Grille du stock à l'admin : une case par couleur × taille.
 *
 * Fonction pure, à part du formulaire : c'est elle qui décide ce que devient
 * une quantité saisie quand on ajoute une couleur ou retire une taille, et
 * c'est la partie qui doit se tester sans navigateur.
 */

/** Une couleur telle que l'admin la saisit, avant enregistrement. */
export type ColorDraft = {
  /** Identifiant en base, ou provisoire (« nouvelle-… ») tant qu'elle n'est pas enregistrée. */
  key: string;
  name: string;
  /** `#rrggbb`, la valeur que rend `<input type="color">`. */
  hex: string;
};

/** Une case du stock. `price` reste du texte saisi (« 52,00 ») : le serveur le lit. */
export type StockCell = {
  colorKey: string | null;
  size: string;
  quantity: number;
  /** Vide : prix du produit. */
  price: string;
};

/**
 * Réaligne le stock sur les couleurs et tailles déclarées : une case par
 * combinaison, dans l'ordre couleur puis taille, en gardant ce qui était déjà
 * saisi.
 *
 * Passer d'une pièce sans couleur à une pièce en couleurs reporte le stock
 * saisi sur la première couleur, et l'inverse : la vendeuse qui ajoute sa
 * première teinte ne doit pas voir son stock remis à zéro.
 */
export function alignStock(
  colors: ColorDraft[],
  sizes: string[],
  stock: StockCell[],
): StockCell[] {
  const byCell = new Map(stock.map((cell) => [cellId(cell.colorKey, cell.size), cell]));
  const colorKeys: (string | null)[] = colors.length > 0 ? colors.map((color) => color.key) : [null];
  const firstKey = colorKeys[0];

  return colorKeys.flatMap((colorKey) =>
    sizes.map((size) => {
      const own = byCell.get(cellId(colorKey, size));
      if (own) return own;
      // Reprise d'une case orpheline : seule la première couleur hérite.
      const carried =
        colorKey === firstKey
          ? colorKey === null
            ? stock.find((cell) => cell.colorKey !== null && cell.size === size)
            : byCell.get(cellId(null, size))
          : undefined;
      return carried
        ? { ...carried, colorKey }
        : { colorKey, size, quantity: 0, price: "" };
    }),
  );
}

function cellId(colorKey: string | null, size: string): string {
  return `${colorKey ?? ""}\u0000${size}`;
}
