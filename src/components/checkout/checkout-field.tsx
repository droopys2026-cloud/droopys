/**
 * Champ du tunnel. L'erreur n'apparaît qu'une fois le champ quitté : signaler
 * « obligatoire » pendant qu'on tape encore réprimande au lieu d'aider.
 */
export function CheckoutField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  type = "text",
  full = false,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  /** Message à afficher, déjà filtré sur « champ quitté ». */
  error?: string;
  autoComplete: string;
  type?: string;
  full?: boolean;
  hint?: string;
}) {
  const describedBy = [error ? `${id}-erreur` : null, hint ? `${id}-aide` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`content-field ${full ? "content-field--full" : ""}`}>
      <label className="content-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className="content-field__input"
      />
      {hint && (
        <span id={`${id}-aide`} className="content-field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-erreur`} className="checkout-field-error">
          {error}
        </span>
      )}
    </div>
  );
}
