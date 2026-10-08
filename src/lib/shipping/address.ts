/**
 * Relit une adresse rangée en lignes d'étiquette (`orders.shipping_address`,
 * fabriquée par `addressLines`) : rue, complément éventuel, « CP Ville »,
 * code pays. Sendcloud la veut champ par champ.
 *
 * `null` si la forme n'est pas reconnue : mieux vaut refuser de créer une
 * étiquette que d'en imprimer une fausse.
 */
export type SplitAddress = {
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  countryCode: string;
};

export function splitAddressLines(lines: string[]): SplitAddress | null {
  if (lines.length < 3 || lines.length > 4) return null;
  const countryCode = lines.at(-1) ?? "";
  const cityLine = lines.at(-2) ?? "";
  const match = cityLine.match(/^(\S+)\s+(.+)$/);
  if (!/^[A-Z]{2}$/.test(countryCode) || !match) return null;

  return {
    line1: lines[0],
    line2: lines.length === 4 ? lines[1] : null,
    postalCode: match[1],
    city: match[2],
    countryCode,
  };
}
