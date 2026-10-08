import Image from "next/image";
import Link from "next/link";
import { getShopSettings } from "@/lib/queries/settings";
import { socialLinks } from "@/lib/social";
import { CONTENT_GROUPS } from "@/lib/content-pages";
import { footerPagesOfGroup } from "@/lib/queries/content";
import type { ContentGroup } from "@/types/content-page";
import {
  IconFacebook,
  IconInstagram,
  IconTiktok,
} from "@/components/ui/icons";

/**
 * Colonnes de liens du pied de page.
 *
 * Elles ne sont plus écrites ici : elles se déduisent du registre des pages
 * de contenu. C'est ce qui garantit qu'un lien du pied de page mène toujours
 * à une page existante, et qu'une page ajoutée depuis l'admin apparaisse
 * d'elle-même au bon endroit.
 *
 * Quatre colonnes sur grand écran, deux sur tablette, une sur mobile —
 * la grille se replie seule, aucune variante de composant à maintenir.
 */
async function footerColumns() {
  const groups = (
    Object.entries(CONTENT_GROUPS) as [
      ContentGroup,
      { label: string; order: number },
    ][]
  ).sort(([, a], [, b]) => a.order - b.order);

  const columns = await Promise.all(
    groups.map(async ([group, { label }]) => ({
      title: label,
      links: [
        ...(await footerPagesOfGroup(group)).map((page) => ({
          label: page.title,
          href: `/${page.slug}`,
        })),
        // La fonction de rétractation doit être facile à trouver depuis
        // toutes les pages (directive (UE) 2023/2673) : elle tient sa place
        // dans la colonne légale, quelles que soient les pages de l'admin.
        ...(group === "legal"
          ? [{ label: "Se rétracter du contrat ici", href: "/retractation" }]
          : []),
      ],
    })),
  );

  // Une colonne sans lien laisserait un titre seul en bas de page.
  return columns.filter((column) => column.links.length > 0);
}

/**
 * Moyens de paiement acceptés, en logotypes officiels plutôt qu'en pastilles
 * de texte. Les proportions sont celles du `viewBox` de chaque fichier : le
 * carré de Mastercard et la bande allongée de Visa n'ont rien de commun, et
 * les forcer à la même largeur en déformerait un.
 */
const PAYMENT_METHODS = [
  { name: "Visa", logo: "/logos/visa.svg", width: 1000, height: 324.68 },
  { name: "Mastercard", logo: "/logos/mastercard.svg", width: 1000, height: 618 },
  { name: "CB", logo: "/logos/cb.svg", width: 300, height: 221 },
];

/** Icône de chaque réseau ; les adresses viennent des Réglages (`socialLinks`). */
const SOCIAL_ICONS = {
  instagram: IconInstagram,
  facebook: IconFacebook,
  tiktok: IconTiktok,
};

export async function SiteFooter() {
  const [columns, { reseaux }] = await Promise.all([footerColumns(), getShopSettings()]);
  const social = socialLinks(reseaux);

  return (
    <footer className="section-footer">
      {/* Bandeau 1 — les colonnes de navigation. */}
      <div className="container-page grid grid-cols-1 gap-x-9 gap-y-13 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="heading-h4">{column.title}</h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link--footer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bandeau 2 — paiement et réseaux. */}
      <div className="border-t border-[var(--color-border-muted)]">
        <div className="container-page grid grid-cols-1 gap-13 py-13 md:grid-cols-2">
          <section>
            <h3 className="heading-h4">Moyens de paiement</h3>
            <ul className="flex flex-wrap items-center gap-6">
              {PAYMENT_METHODS.map((method) => (
                <li key={method.name}>
                  {/* `unoptimized` : l'optimiseur d'images de Next refuse le
                      SVG sans `dangerouslyAllowSVG`, et ces fichiers font
                      moins de 6 ko. */}
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={method.width}
                    height={method.height}
                    unoptimized
                    className="payment-logo"
                  />
                </li>
              ))}
            </ul>
          </section>

          {social.length > 0 && (
            <section>
              <h3 className="heading-h4">Suivez-nous</h3>
              <ul className="flex gap-6">
                {social.map(({ network, label, href }) => {
                  const Icon = SOCIAL_ICONS[network];
                  return (
                    <li key={network}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={label}
                        className="icon-link-nav"
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

        </div>
      </div>

      {/* Bandeau 3 — mention légale. */}
      <div className="border-t border-[var(--color-border-muted)]">
        <div className="container-page flex flex-col items-center justify-between gap-6 py-9 md:flex-row">
          <p className="text-caption-muted m-0">
            © {new Date().getFullYear()} Droopy&apos;s — Tous droits réservés
          </p>
          <Link href="/retractation" className="link-underline-sm">
            Se rétracter du contrat ici
          </Link>
          <p className="text-caption-muted m-0">
            Paiement sécurisé · Retours sous 30 jours
          </p>
        </div>
      </div>
    </footer>
  );
}
