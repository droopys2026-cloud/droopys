/**
 * En-tête commun aux pages de l'admin : titre, phrase d'introduction et, à
 * droite, l'action principale de la page quand elle en a une.
 */
export function AdminPageHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="admin-page__header">
      <div className="admin-page__heading">
        <h1 className="admin-page__title">{title}</h1>
        {lead && <p className="admin-page__lead">{lead}</p>}
      </div>
      {action}
    </header>
  );
}
