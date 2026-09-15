/**
 * Tableau de bord. Aucune donnée n'est branchée pour l'instant : la page
 * annonce l'état plutôt que d'afficher des chiffres inventés, qu'on finirait
 * par prendre pour de vrais.
 */
export default function AdminHomePage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Tableau de bord</h1>
        <p className="admin-page__lead">
          L&apos;espace d&apos;administration de la boutique.
        </p>
      </header>

      <div className="admin-empty">
        <p className="admin-empty__title">Aucune donnée pour le moment</p>
        <p className="admin-empty__text">
          Les chiffres apparaîtront ici une fois la base de données connectée.
        </p>
      </div>
    </div>
  );
}
