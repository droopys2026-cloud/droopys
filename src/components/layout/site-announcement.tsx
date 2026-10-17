import Image from "next/image";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { promoAnnouncement } from "@/lib/promo/announcement";
import { getAnnouncedPromo } from "@/lib/queries/promo";
import { getShopSettings } from "@/lib/queries/settings";

/**
 * Bandeau d'annonce, alimenté par les réglages.
 *
 * Le message était recopié dans chacune des pages ; il n'est plus écrit
 * qu'une fois, et se modifie depuis Admin › Réglages sans déploiement.
 * Vide, le bandeau ne s'affiche pas du tout — c'est la façon de le retirer.
 *
 * Un code promo annoncé à l'admin (Codes promo) remplace ce message.
 *
 * Un message qui parle de Klarna s'accompagne de son logo : la boutique garde
 * la main sur le texte, et un autre message fait disparaître le logo seul.
 */
export async function SiteAnnouncement() {
  const [{ annonce }, promo] = await Promise.all([getShopSettings(), getAnnouncedPromo()]);

  // Un code « tout le site » annoncé passe avant le message des réglages, le
  // temps qu'il est valable : à son expiration, le message habituel revient
  // seul, sans repasser par l'admin.
  if (promo) return <AnnouncementBar>{promoAnnouncement(promo)}</AnnouncementBar>;

  if (!annonce.message.trim()) return null;

  const klarna = /klarna/i.test(annonce.message);

  return (
    <AnnouncementBar
      logo={
        klarna ? (
          <Image
            src="/imgdress/klarna-badge.png"
            alt="Klarna"
            width={144}
            height={72}
            className="announcement-bar__logo"
          />
        ) : undefined
      }
    >
      {annonce.message}
    </AnnouncementBar>
  );
}
