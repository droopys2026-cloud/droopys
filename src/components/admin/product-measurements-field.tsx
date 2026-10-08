"use client";

/** Une mesure relevée sur la pièce : son intitulé et sa valeur. */
export type Measurement = { label: string; value: string };

/** Mesures relevées sur la pièce elle-même, à plat. */
export const DEFAULT_MEASUREMENTS: Measurement[] = [
  { label: "Longueur totale", value: "" },
  { label: "Largeur d'épaules", value: "" },
  { label: "Longueur de manche", value: "" },
  { label: "Demi-tour de taille", value: "" },
];

/**
 * Mesures du vêtement.
 *
 * Facultatives : laissées vides, elles ne s'affichent pas du tout sur la
 * fiche. Mieux vaut pas de mesures qu'une mesure inventée — mais quand elles
 * y sont, elles évitent des retours.
 */
export function ProductMeasurementsField({
  value,
  onChange,
}: {
  value: Measurement[];
  onChange: (measurements: Measurement[]) => void;
}) {
  function patch(index: number, part: Partial<Measurement>) {
    onChange(
      value.map((entry, i) => (i === index ? { ...entry, ...part } : entry)),
    );
  }

  return (
    <fieldset className="admin-fieldset">
      <legend className="admin-fieldset__legend">
        Mesures du vêtement <span className="admin-badge">facultatif</span>
      </legend>

      <p className="admin-field__hint">
        Relevées sur la pièce à plat. Laissez vide si vous ne les avez pas :
        rien ne s&apos;affichera sur la fiche.
      </p>

      <ul className="admin-measures">
        {value.map((entry, index) => (
          <li key={index} className="admin-measure">
            <input
              className="admin-field__input"
              aria-label="Intitulé de la mesure"
              value={entry.label}
              onChange={(event) => patch(index, { label: event.target.value })}
            />
            <input
              className="admin-field__input"
              aria-label={`Valeur de « ${entry.label} »`}
              placeholder="48 cm"
              value={entry.value}
              onChange={(event) => patch(index, { value: event.target.value })}
            />
            <button
              type="button"
              className="admin-thumb__icon"
              aria-label={`Retirer « ${entry.label} »`}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="admin-button admin-button--ghost admin-button--small"
        onClick={() => onChange([...value, { label: "Nouvelle mesure", value: "" }])}
      >
        Ajouter une mesure
      </button>
    </fieldset>
  );
}
