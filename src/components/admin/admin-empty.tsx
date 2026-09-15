/**
 * État vide, identique dans toute l'admin : une section sans données doit se
 * reconnaître au premier coup d'œil, quelle que soit la page.
 */
export function AdminEmpty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-empty">
      <p className="admin-empty__title">{title}</p>
      <p className="admin-empty__text">{text}</p>
      {action}
    </div>
  );
}
