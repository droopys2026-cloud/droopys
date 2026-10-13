import type { Metadata } from "next";
import { toggleContactMessageHandled } from "@/app/admin/(back-office)/messages/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { listContactMessages } from "@/lib/queries/contact-messages";

export const metadata: Metadata = { title: "Messages clients | Admin Droopy's" };

/**
 * Messages laissés par le formulaire de la page Contact.
 *
 * « Répondre » ouvre la messagerie de l'ordinateur, adresse et objet remplis :
 * la réponse part de la vraie boîte de la boutique, où le fil se poursuit.
 * Le site n'envoie rien lui-même ici.
 */
export default async function AdminMessagesPage() {
  await requireAdmin();

  const messages = await listContactMessages();
  const pending = messages.filter((message) => !message.handledAt).length;

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Messages clients"
        lead="Les messages envoyés depuis la page Contact. Ceux qui attendent une réponse sont en haut."
      />

      {messages.length > 0 && (
        <p className="admin-field__hint m-0">
          {pending} en attente · {messages.length} au total
        </p>
      )}

      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          const reply = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`;
          return (
            <article key={message.id} className="admin-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="admin-card__title m-0">{message.subject}</h2>
                  <span className="admin-field__hint">
                    {message.createdAt.toLocaleString("fr-FR", {
                      dateStyle: "long",
                      timeStyle: "short",
                      timeZone: "Europe/Paris",
                    })}
                  </span>
                </div>
                {message.handledAt ? (
                  <span className="admin-badge">
                    Traité le{" "}
                    {message.handledAt.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })}
                  </span>
                ) : (
                  <span className="admin-badge admin-badge--required">À traiter</span>
                )}
              </div>

              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="admin-field__hint">Client</dt>
                <dd className="m-0">{message.name}</dd>
                <dt className="admin-field__hint">E-mail</dt>
                <dd className="m-0">{message.email}</dd>
                {message.phone && (
                  <>
                    <dt className="admin-field__hint">Téléphone</dt>
                    <dd className="m-0">
                      <a href={`tel:${message.phone.replace(/[^+0-9]/g, "")}`}>{message.phone}</a>
                    </dd>
                  </>
                )}
                {message.orderReference && (
                  <>
                    <dt className="admin-field__hint">Commande</dt>
                    <dd className="m-0">{message.orderReference}</dd>
                  </>
                )}
              </dl>

              {/* `pre-line` garde les retours à la ligne du client sans
                  interpréter quoi que ce soit : React échappe le texte. */}
              <p className="m-0 whitespace-pre-line">{message.message}</p>

              <div className="flex flex-wrap gap-2">
                <a href={reply} className="admin-button admin-button--small">
                  Répondre
                </a>
                <form action={toggleContactMessageHandled}>
                  <input type="hidden" name="id" value={message.id} />
                  <button type="submit" className="admin-button admin-button--ghost admin-button--small">
                    {message.handledAt ? "Rouvrir" : "Marquer comme traité"}
                  </button>
                </form>
              </div>
            </article>
          );
        })}
      </div>

      {messages.length === 0 && (
        <AdminEmpty
          title="Aucun message"
          text="Un message apparaît ici dès qu'un visiteur remplit le formulaire de la page Contact."
        />
      )}
    </div>
  );
}
