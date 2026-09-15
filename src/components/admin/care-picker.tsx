"use client";

import { useEffect, useState } from "react";
import { CARE_ADVICE } from "@/lib/care-advice";

/**
 * Choix des consignes d'entretien.
 *
 * Une fenêtre de consignes toutes faites : on clique, la ligne s'ajoute au
 * champ. Cliquer une ligne déjà présente la retire — la fenêtre reflète donc
 * l'état du champ, elle ne fait pas qu'y verser du texte.
 */
export function CarePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const lines = value.split("\n").filter(Boolean);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function toggle(line: string) {
    onChange(
      lines.includes(line)
        ? lines.filter((item) => item !== line).join("\n")
        : [...lines, line].join("\n"),
    );
  }

  return (
    <>
      <button
        type="button"
        className="admin-button admin-button--ghost admin-button--small"
        onClick={() => setOpen(true)}
      >
        Choisir des consignes
      </button>

      {open && (
        <div className="admin-modal" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="care-titre"
            className="admin-modal__panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal__head">
              <div>
                <h2 id="care-titre" className="admin-modal__title">
                  Consignes d&apos;entretien
                </h2>
                <p className="admin-field__hint">
                  Cliquez pour ajouter, cliquez de nouveau pour retirer.
                </p>
              </div>
              <button
                type="button"
                className="admin-thumb__icon"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal__body">
              {CARE_ADVICE.map((section) => (
                <div key={section.group} className="admin-care__group">
                  <h3 className="admin-filter__label">{section.group}</h3>
                  <ul className="admin-care__list">
                    {section.lines.map((line) => (
                      <li key={line}>
                        <button
                          type="button"
                          className="admin-chip admin-care__line"
                          aria-pressed={lines.includes(line)}
                          onClick={() => toggle(line)}
                        >
                          {line}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="admin-modal__foot">
              <button
                type="button"
                className="admin-button"
                onClick={() => setOpen(false)}
              >
                Terminé
              </button>
              <span className="admin-field__hint">
                {lines.length} consigne{lines.length > 1 ? "s" : ""} retenue
                {lines.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
