import { redirect } from "next/navigation";

/**
 * Les rayons se gèrent désormais depuis Menu — un rayon *est* un onglet du
 * menu, deux pages pour la même chose ne faisaient que perdre la cliente.
 * L'adresse est gardée pour les favoris et les fiches qui y renvoyaient.
 */
export default function AdminRayonsPage() {
  redirect("/admin/menu");
}
