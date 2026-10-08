/**
 * « Aussi visible dans » : les autres sous-rayons où l'article apparaît.
 *
 * Facultatif et replié par défaut : la plupart des fiches n'ont besoin que de
 * leur rayon. On l'ouvre pour une doudoune qui doit aussi sortir sous
 * Manteaux › Doudounes, ou des baskets sous Chaussures › Baskets.
 *
 * De simples cases non contrôlées : elles partent dans la `FormData` sous
 * `placements`, et c'est l'action qui vérifie chaque identifiant.
 */
export function ProductPlacementsField({
  groups,
  selected,
}: {
  /** Les onglets du menu et leurs sous-rayons, dans l'ordre du site. */
  groups: { label: string; options: { id: string; label: string }[] }[];
  selected: string[];
}) {
  const count = selected.length;

  return (
    <details className="admin-placements" open={count > 0}>
      <summary className="admin-placements__summary">
        Ajouter dans d&apos;autres rayons{" "}
        <span className="admin-badge">facultatif</span>
        {count > 0 && (
          <span className="admin-placements__count">
            {count === 1 ? "1 rayon coché" : `${count} rayons cochés`}
          </span>
        )}
      </summary>
      <p className="admin-field__hint">
        L&apos;article reste dans son rayon, et apparaît en plus dans ceux que
        vous cochez.
      </p>
      <div className="admin-placements__groups">
        {groups.map((group) => (
          <fieldset key={group.label} className="admin-placements__group">
            <legend className="admin-placements__legend">{group.label}</legend>
            {group.options.map((option) => (
              <label key={option.id} className="admin-placements__option">
                <input
                  type="checkbox"
                  name="placements"
                  value={option.id}
                  defaultChecked={selected.includes(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </details>
  );
}
