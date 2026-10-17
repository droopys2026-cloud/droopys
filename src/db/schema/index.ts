/**
 * Point d'entrée unique du schéma : `drizzle-kit` et le client lisent ici.
 * Les tables sont groupées par domaine dans les fichiers voisins.
 *
 * Les chemins sont relatifs et non en `@/…` — seule exception du projet :
 * `drizzle-kit` et les scripts d'administration tournent hors de Next, qui est
 * le seul à résoudre l'alias de façon fiable dans un `export *`.
 */
export * from "./catalog";
export * from "./contact-messages";
export * from "./content";
export * from "./customers";
export * from "./generated-photos";
export * from "./navigation";
export * from "./orders";
export * from "./placements";
export * from "./promo";
export * from "./shop";
export * from "./withdrawals";
