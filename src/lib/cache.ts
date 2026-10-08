/**
 * Étiquettes du cache de données.
 *
 * Les lectures partagées par toutes les pages — réglages, pages de contenu,
 * catalogue — sont mémorisées entre les rendus, pas seulement au sein d'un
 * rendu. Sans cela, générer 82 pages statiques ouvre 82 fois les mêmes
 * requêtes : le pooler Supabase sature et le build échoue en « statement
 * timeout ».
 *
 * Chaque étiquette est invalidée par les actions qui écrivent la donnée
 * correspondante, via `revalidateTag`. Une écriture sans invalidation laisse
 * le site sur des valeurs périmées : c'est le seul piège de ce mécanisme, et
 * c'est pourquoi les étiquettes vivent ici, en un seul endroit.
 */
export const CACHE_TAGS = {
  settings: "reglages",
  content: "pages-contenu",
  catalog: "catalogue",
} as const;
