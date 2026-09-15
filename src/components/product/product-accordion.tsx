/**
 * Section repliable de la fiche produit.
 *
 * `<details>` natif : le navigateur gère déjà le clavier, l'état annoncé et
 * la recherche dans la page — trois choses qu'un accordéon maison oublie
 * presque toujours.
 */
export function ProductAccordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="product-accordion" open={defaultOpen}>
      <summary className="product-accordion__summary">{title}</summary>
      <div className="product-accordion__body">{children}</div>
    </details>
  );
}
