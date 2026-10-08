/**
 * Chemin de retour après connexion (`?suite=…`), ou `fallback`.
 *
 * Seuls les chemins internes passent. Un `suite` pointant vers un autre site
 * ferait de la page de connexion un tremplin : un lien « droopys.fr/compte/
 * connexion?suite=//faux-droopys.fr » mènerait, mot de passe saisi, sur une
 * copie du site. `//hôte` et `/\hôte` sont lus comme des adresses externes par
 * les navigateurs, d'où leur refus explicite.
 */
export function safeRedirectPath(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
