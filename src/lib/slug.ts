/**
 * Fabrication d'identifiants d'URL.
 *
 * Le slug est l'adresse publique d'une fiche : il doit rester lisible,
 * stable, et ne contenir que ce qu'une URL accepte sans encodage.
 */
export function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      // Retire les accents restés seuls après la décomposition NFD.
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
  );
}

/**
 * Rend `base` unique au regard des slugs déjà pris.
 *
 * Le suffixe est un compteur et non un identifiant aléatoire : « parka-2 » se
 * retient et se dicte au téléphone, « parka-a3f9 » non.
 */
export function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "produit";
  if (!taken.has(root)) return root;

  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const candidate = `${root}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  throw new Error(`Impossible de dériver un slug libre depuis « ${root} ».`);
}
