/**
 * Erreurs d'un formulaire, annoncées **avant** les champs : un message glissé
 * sous le bouton n'est lu ni par un lecteur d'écran revenu en haut du
 * formulaire, ni par un œil pressé.
 */
export function FormAlert({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div role="alert" className="account-alert">
      {errors.length === 1 ? (
        <p className="m-0">{errors[0]}</p>
      ) : (
        <ul>
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
