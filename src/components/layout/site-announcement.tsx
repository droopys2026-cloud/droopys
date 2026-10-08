import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { getShopSettings } from "@/lib/queries/settings";

/**
 * Bandeau d'annonce, alimenté par les réglages.
 *
 * Le message était recopié dans chacune des pages ; il n'est plus écrit
 * qu'une fois, et se modifie depuis Admin › Réglages sans déploiement.
 * Vide, le bandeau ne s'affiche pas du tout — c'est la façon de le retirer.
 */
export async function SiteAnnouncement() {
  const { annonce } = await getShopSettings();
  if (!annonce.message.trim()) return null;

  return <AnnouncementBar>{annonce.message}</AnnouncementBar>;
}
