/**
 * Réseaux sociaux de la boutique, tels que saisis dans Admin → Réglages.
 *
 * Un champ vide ou qui n'est pas une adresse `https://` n'affiche rien : un
 * lien vers la page d'accueil d'Instagram ne mène pas à la boutique, il fait
 * juste quitter le site.
 */
export type SocialNetwork = "instagram" | "facebook" | "tiktok";

export type SocialLink = { network: SocialNetwork; label: string; href: string };

const NETWORKS: { network: SocialNetwork; label: string }[] = [
  { network: "instagram", label: "Instagram" },
  { network: "facebook", label: "Facebook" },
  { network: "tiktok", label: "TikTok" },
];

/** Pages d'accueil des réseaux, en attendant que les comptes soient saisis. */
const FALLBACK: Record<SocialNetwork, string> = {
  instagram: "https://www.instagram.com",
  facebook: "https://www.facebook.com",
  tiktok: "https://www.tiktok.com",
};

/**
 * Les comptes saisis dans Réglages ; si aucun ne l'est encore, les trois
 * réseaux pointent vers leur page d'accueil, pour que la carte et le pied de
 * page restent affichés. À remplacer par les vrais comptes dans l'admin.
 */
export function socialLinks(reseaux: Partial<Record<SocialNetwork, string>>): SocialLink[] {
  const configured = NETWORKS.flatMap(({ network, label }) => {
    const href = reseaux[network]?.trim() ?? "";
    return href.startsWith("https://") ? [{ network, label, href }] : [];
  });
  if (configured.length > 0) return configured;
  return NETWORKS.map(({ network, label }) => ({ network, label, href: FALLBACK[network] }));
}
