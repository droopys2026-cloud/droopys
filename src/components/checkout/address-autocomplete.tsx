"use client";

import { useEffect, useId, useRef, useState } from "react";
import { z } from "zod";

/**
 * Champ « Adresse » avec suggestions, pour la France.
 *
 * La cliente tape le début de son adresse ; la Base Adresse Nationale (API
 * officielle de la Géoplateforme, gratuite, sans clé) propose des adresses
 * complètes, et en choisir une remplit d'un coup rue, code postal et ville.
 * Hors de France, c'est un champ ordinaire : la base ne couvre pas l'étranger.
 *
 * Motif WAI « combobox » : le focus reste dans le champ, les flèches parcourent
 * la liste (`aria-activedescendant`), Entrée choisit, Échap ferme.
 */

const ENDPOINT = "https://data.geopf.fr/geocodage/search";

const responseSchema = z.object({
  features: z.array(
    z.object({
      properties: z.object({
        label: z.string(),
        name: z.string(),
        postcode: z.string(),
        city: z.string(),
        type: z.string(),
      }),
    }),
  ),
});

type Suggestion = z.infer<typeof responseSchema>["features"][number]["properties"];

export type ChosenAddress = { line1: string; postalCode: string; city: string };

/** « 139 bis avenue… » → « 139 bis » : le numéro tapé, s'il y en a un. */
function typedNumber(query: string): string | null {
  return query.match(/^\s*(\d+\s*(?:bis|ter|quater)?)\b/i)?.[1]?.trim() ?? null;
}

export function AddressAutocomplete({
  id,
  value,
  country,
  error,
  onChange,
  onChoose,
  onBlur,
}: {
  id: string;
  value: string;
  country: string;
  error?: string;
  onChange: (value: string) => void;
  onChoose: (address: ChosenAddress) => void;
  onBlur: () => void;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Vrai seulement pendant la frappe : une valeur posée par un choix ou par
  // une adresse enregistrée ne doit pas relancer de recherche.
  const typing = useRef(false);
  const enabled = country === "FR";

  useEffect(() => {
    if (!enabled || !typing.current || value.trim().length < 3) return;

    const controller = new AbortController();
    // Une requête par pause de frappe, pas une par lettre.
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: value,
          limit: "5",
          autocomplete: "1",
          index: "address",
        });
        const response = await fetch(`${ENDPOINT}?${params}`, { signal: controller.signal });
        if (!response.ok) return;
        const parsed = responseSchema.safeParse(await response.json());
        if (!parsed.success) return;
        setSuggestions(parsed.data.features.map((feature) => feature.properties));
        setActive(-1);
        setOpen(parsed.data.features.length > 0);
      } catch (failure) {
        // Une frappe plus récente a annulé celle-ci : rien à signaler. Une
        // panne de l'API, elle, laisse simplement la saisie manuelle.
        if (!(failure instanceof DOMException && failure.name === "AbortError")) {
          console.warn("Suggestions d'adresse indisponibles :", failure);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, enabled]);

  function choose(suggestion: Suggestion) {
    // La base connaît parfois la rue sans le numéro : on garde alors celui
    // que la cliente a tapé, plutôt que de l'effacer.
    const number = suggestion.type === "street" ? typedNumber(value) : null;
    typing.current = false;
    onChoose({
      line1: number ? `${number} ${suggestion.name}` : suggestion.name,
      postalCode: suggestion.postcode,
      city: suggestion.city,
    });
    setOpen(false);
    setSuggestions([]);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(suggestions[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="content-field content-field--full address-autocomplete">
      <label className="content-field__label" htmlFor={id}>
        Adresse
      </label>
      <input
        id={id}
        type="text"
        role={enabled ? "combobox" : undefined}
        aria-autocomplete={enabled ? "list" : undefined}
        aria-expanded={enabled ? open : undefined}
        aria-controls={enabled ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-aide${error ? ` ${id}-erreur` : ""}`}
        autoComplete="address-line1"
        value={value}
        onChange={(event) => {
          typing.current = true;
          onChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        onBlur={() => {
          // Laisse le temps au clic sur une suggestion d'aboutir.
          setTimeout(() => setOpen(false), 150);
          onBlur();
        }}
        className="content-field__input"
      />
      <span id={`${id}-aide`} className="content-field__hint">
        {enabled
          ? "Commencez à taper, puis choisissez votre adresse dans la liste."
          : "Numéro et nom de rue."}
      </span>
      {error && (
        <span id={`${id}-erreur`} className="checkout-field-error">
          {error}
        </span>
      )}

      {enabled && open && (
        <ul id={listId} role="listbox" aria-label="Adresses proposées" className="address-suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.label}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              className="address-suggestions__item"
              // `onMouseDown` et non `onClick` : il part avant que le champ
              // perde le focus et ferme la liste.
              onMouseDown={(event) => {
                event.preventDefault();
                choose(suggestion);
              }}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
