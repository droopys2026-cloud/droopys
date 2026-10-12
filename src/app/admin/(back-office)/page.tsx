import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { countProducts } from "@/lib/queries/admin-catalog";
import { countOrdersByStatus, listOrders } from "@/lib/queries/orders";

/**
 * Tableau de bord.
 *
 * Quatre chiffres, pas douze : ceux sur lesquels on agit le matin. Chacun est
 * un lien vers la liste filtrée correspondante — un compteur qu'on ne peut
 * pas ouvrir ne sert qu'à décorer.
 */
export default async function AdminHomePage() {
  await requireAdmin();

  const [catalogue, statuses, recent] = await Promise.all([
    countProducts(),
    countOrdersByStatus(),
    listOrders(),
  ]);

  const toPrepare = statuses.get("a-preparer") ?? 0;
  const revenueCents = recent.reduce((total, order) => {
    // Une commande annulée n'est pas un chiffre d'affaires. Un retour non
    // plus, mais il garde sa trace : on l'écarte du total, pas de la liste.
    if (order.status === "annulee" || order.status === "retour" || order.status === "remboursee") {
      return total;
    }
    return total + order.totalCents;
  }, 0);

  const tiles = [
    {
      label: "À préparer",
      value: String(toPrepare),
      href: "/admin/commandes?etat=a-preparer",
      hint: "Commandes payées, pas encore expédiées",
    },
    {
      label: "Commandes",
      value: String(recent.length),
      href: "/admin/commandes",
      hint: "Depuis l'ouverture",
    },
    {
      label: "Encaissé",
      value: formatPrice(revenueCents),
      href: "/admin/commandes",
      hint: "Hors commandes annulées et retours",
    },
    {
      label: "Catalogue",
      value: `${catalogue.published} / ${catalogue.total}`,
      href: "/admin/produits",
      hint: "Fiches publiées sur fiches enregistrées",
    },
  ];

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Tableau de bord"
        lead="L'essentiel de la boutique, et où agir."
      />

      <ul className="admin-tiles">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Link href={tile.href} className="admin-tile">
              <span className="admin-tile__label">{tile.label}</span>
              <span className="admin-tile__value">{tile.value}</span>
              <span className="admin-tile__hint">{tile.hint}</span>
            </Link>
          </li>
        ))}
      </ul>

      {catalogue.total > 0 && catalogue.published === 0 && (
        <p className="admin-form__note">
          Aucune fiche n&apos;est publiée : la boutique est vide pour les
          visiteurs. Publiez un produit depuis{" "}
          <Link href="/admin/produits">le catalogue</Link>.
        </p>
      )}
    </div>
  );
}
