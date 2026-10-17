/**
 * Reconnaître une cliente d'une commande à l'autre, pour « une fois par
 * cliente ».
 *
 * L'e-mail seul se contourne en en tapant un autre : on rapproche donc aussi
 * le compte, le téléphone et l'adresse de livraison à domicile. Un seul point
 * commun suffit. Les adresses de point relais et de retrait n'en sont pas :
 * des dizaines de clientes partagent le même relais.
 */

/** Ce qu'on sait d'une cliente — au panier, souvent rien d'autre que son compte. */
export type CustomerIdentity = {
  customerId?: string | null;
  email?: string | null;
  phone?: string | null;
  deliveryMethod?: "domicile" | "relais" | "retrait" | null;
  addressLines?: string[] | null;
};

/**
 * Les 9 derniers chiffres : « 06 27 75 48 39 », « +33 6 27… » et « 0033… »
 * donnent la même clé. Moins de 9 chiffres n'identifie personne.
 */
export function phoneKey(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9 ? digits.slice(-9) : null;
}

/**
 * Rue et code postal, sans casse, espaces ni ponctuation. Le complément
 * (bâtiment, appartement) est laissé de côté : en changer ne fait pas une
 * autre cliente.
 */
export function addressKey(lines: string[]): string | null {
  // Lignes rangées par `addressLines` : rue, complément éventuel, « code
  // postal ville », pays. Le code postal se lit sur l'avant-dernière, pour
  // ne pas prendre un numéro de rue à quatre chiffres pour lui.
  const street = lines[0];
  const postalCode = lines.at(-2)?.match(/\b\d{4,5}\b/)?.[0];
  if (!street || !postalCode) return null;
  const normalized = street
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  return normalized === "" ? null : `${normalized}|${postalCode}`;
}

function homeAddressKey(identity: CustomerIdentity): string | null {
  return identity.deliveryMethod === "domicile" && identity.addressLines
    ? addressKey(identity.addressLines)
    : null;
}

export function isSameCustomer(current: CustomerIdentity, previous: CustomerIdentity): boolean {
  if (current.customerId && current.customerId === previous.customerId) return true;

  const email = current.email?.trim().toLowerCase();
  if (email && email === previous.email?.trim().toLowerCase()) return true;

  const phone = current.phone ? phoneKey(current.phone) : null;
  if (phone && previous.phone && phone === phoneKey(previous.phone)) return true;

  const address = homeAddressKey(current);
  return address !== null && address === homeAddressKey(previous);
}
