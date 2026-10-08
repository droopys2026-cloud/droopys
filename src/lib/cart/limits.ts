/**
 * Bornes du panier, partagées par le serveur et le navigateur.
 *
 * Le fichier est volontairement pur : `@/lib/cart/cookie` porte `server-only`,
 * et un composant client ne peut donc pas y lire cette constante sans faire
 * échouer la compilation.
 */

/**
 * Quantité maximale par ligne. Le formulaire s'en sert pour ne pas proposer
 * l'impossible ; c'est le serveur qui refuse, lui, « 10 000 doudounes ».
 */
export const MAX_QUANTITY = 20;
