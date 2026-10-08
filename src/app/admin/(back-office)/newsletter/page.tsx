import type { Metadata } from "next";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { listSubscribers } from "@/lib/queries/newsletter";

export const metadata: Metadata = { title: "Newsletter | Admin Droopy's" };

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
};

/**
 * Inscrits à la lettre, saisis par le formulaire « Restons en contact » du
 * pied de page. Aucun outil d'envoi n'est branché : l'export CSV est le pont
 * vers celui qu'on choisira.
 */
export default async function AdminNewsletterPage() {
  await requireAdmin();

  const rows = await listSubscribers();
  const active = rows.filter((row) => !row.unsubscribedAt).length;

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Newsletter"
        lead="Les adresses laissées dans « Restons en contact ». L'export ne contient que les inscrits actifs."
      />

      <div className="admin-table-wrap">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="admin-field__hint m-0">
            {active} inscrit{active > 1 ? "s" : ""} actif{active > 1 ? "s" : ""}
            {rows.length > active && ` · ${rows.length - active} désinscrit${rows.length - active > 1 ? "s" : ""}`}
          </p>
          {active > 0 && (
            // Un `<a>` et non un `Link` : c'est un téléchargement, pas une page.
            <a
              href="/admin/newsletter/export"
              className="admin-button admin-button--ghost admin-button--small"
              download
            >
              Exporter en CSV
            </a>
          )}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">E-mail</th>
              <th scope="col">Inscrit le</th>
              <th scope="col">État</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="admin-table__name">
                  {row.email}
                </th>
                <td className="admin-table__muted">
                  {row.subscribedAt.toLocaleDateString("fr-FR", DATE_FORMAT)}
                </td>
                <td>
                  {row.unsubscribedAt ? (
                    <span className="admin-badge">
                      Désinscrit le{" "}
                      {row.unsubscribedAt.toLocaleDateString("fr-FR", DATE_FORMAT)}
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge--live">Inscrit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <AdminEmpty
          title="Aucun inscrit"
          text="Une adresse apparaît ici dès qu'un visiteur remplit « Restons en contact » en bas des pages du site."
        />
      )}
    </div>
  );
}
