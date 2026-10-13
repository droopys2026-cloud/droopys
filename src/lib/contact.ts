/**
 * Sujets proposés dans le formulaire de contact. Ici et non dans l'action :
 * un fichier « use server » n'exporte que des fonctions, et la liste sert
 * aussi au formulaire, côté navigateur.
 */
export const CONTACT_SUBJECTS = [
  "Ma commande",
  "Un retour ou un remboursement",
  "Une question sur un article",
  "La boutique de Marseille",
  "Presse et partenariats",
  "Autre",
] as const;
