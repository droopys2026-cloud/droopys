"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveContentPage,
  type ContentPageState,
} from "@/app/admin/(back-office)/pages/actions";
import type { ContentBlock, ContentPage } from "@/types/content-page";

/**
 * Éditeur d'une page de contenu.
 *
 * Il suit la forme des données plutôt que celle du texte : un bloc de type
 * `tableau` se saisit comme un tableau, un bloc `faq` comme des paires. Un
 * éditeur de texte libre aurait été plus rapide à écrire, mais il aurait
 * rendu impossible de changer la mise en page du site sans repasser sur
 * chaque page — c'est exactement ce que le découpage en blocs évite.
 *
 * Les blocs vivent dans l'état du composant — ils n'ont pas de représentation
 * naturelle en champ HTML — et voyagent en JSON dans un champ caché à l'envoi.
 * Le reste est en champs non contrôlés : leur valeur part dans la `FormData`.
 */
const BLOCK_LABELS: Record<ContentBlock["kind"], string> = {
  titre: "Intertitre",
  paragraphe: "Paragraphe",
  liste: "Liste à puces",
  tableau: "Tableau",
  faq: "Questions fréquentes",
  cartes: "Cartes",
  etapes: "Étapes",
  note: "Encadré",
  appel: "Bouton d'action",
};

export function ContentPageForm({ page }: { page: ContentPage }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(page.blocks);
  const [state, action, pending] = useActionState<ContentPageState, FormData>(
    saveContentPage,
    {},
  );

  function submit(formData: FormData) {
    formData.set("blocks", JSON.stringify(blocks));
    action(formData);
  }

  /** Remplace un bloc par sa version modifiée, sans toucher aux autres. */
  function update(index: number, next: ContentBlock) {
    setBlocks((current) =>
      current.map((block, position) => (position === index ? next : block)),
    );
  }

  /** Déplace un bloc d'un cran. L'ordre des blocs est l'ordre de la page. */
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    setBlocks((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form className="admin-form admin-form--wide" action={submit}>
      <input type="hidden" name="slug" value={page.slug} />

      {state.errors && state.errors.length > 0 && (
        <div role="alert" className="admin-form__error">
          <ul>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {state.saved && (
        <p role="status" className="admin-form__saved">
          Page enregistrée. Elle est à jour en boutique.
        </p>
      )}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Page</legend>
        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="page-titre">
              Titre
            </label>
            <input
              id="page-titre"
              name="title"
              required
              className="admin-field__input"
              defaultValue={page.title}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="page-slug">
              Chemin
            </label>
            <input
              id="page-slug"
              className="admin-field__input"
              defaultValue={`/${page.slug}`}
              readOnly
            />
            <span className="admin-field__hint">
              Le chemin ne se modifie pas ici : il est aussi celui du lien du
              pied de page et des liens déjà partagés.
            </span>
          </div>

          <div className="admin-field admin-field--full">
            <label className="admin-field__label" htmlFor="page-lead">
              Chapô
            </label>
            <textarea
              id="page-lead"
              name="lead"
              required
              rows={3}
              className="admin-field__input"
              defaultValue={page.lead}
            />
            <span className="admin-field__hint">
              Sert aussi de description dans les résultats de recherche : deux
              phrases au plus.
            </span>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="page-image">
              Photo d&apos;en-tête
            </label>
            <input
              id="page-image"
              name="imageUrl"
              className="admin-field__input"
              placeholder="/imgdress/…"
              defaultValue={page.image ?? ""}
            />
            <span className="admin-field__hint">
              Vide : en-tête blanc habituel, titre sur fond gris clair.
            </span>
          </div>

          <div className="admin-field">
            <span className="admin-field__label">Pied de page</span>
            <label className="admin-chip" htmlFor="page-footer">
              <input
                id="page-footer"
                name="footer"
                type="checkbox"
                defaultChecked={page.footer !== false}
              />
              Lister dans les colonnes du pied de page
            </label>
            <span className="admin-field__hint">
              Décochée, la page reste publiée et atteignable par son lien : ce
              n&apos;est pas une dépublication.
            </span>
          </div>

          <div className="admin-field">
            <span className="admin-field__label">Sommaire</span>
            <label className="admin-chip" htmlFor="page-toc">
              <input
                id="page-toc"
                name="toc"
                type="checkbox"
                defaultChecked={page.toc ?? false}
              />
              Afficher la liste des intertitres
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Contenu — {blocks.length} blocs
        </legend>

        {blocks.map((block, index) => (
          <div key={index} className="admin-card">
            <div className="admin-field__head">
              <span className="admin-badge">{BLOCK_LABELS[block.kind]}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="admin-button admin-button--small admin-button--ghost"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Monter ce bloc"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--small admin-button--ghost"
                  onClick={() => move(index, 1)}
                  disabled={index === blocks.length - 1}
                  aria-label="Descendre ce bloc"
                >
                  ↓
                </button>
              </div>
            </div>

            <BlockFields
              block={block}
              index={index}
              onChange={(next) => update(index, next)}
            />
          </div>
        ))}
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
        <Link
          href={`/${page.slug}`}
          className="admin-button admin-button--ghost"
        >
          Voir la page
        </Link>
      </div>

      <p className="admin-form__note">
        La date de dernière mise à jour est posée à l&apos;enregistrement :
        c&apos;est elle qui rend une page légale opposable, elle ne se saisit
        donc pas à la main.
      </p>
    </form>
  );
}

/** Champs propres à un type de bloc. Un `kind` = une saisie. */
function BlockFields({
  block,
  index,
  onChange,
}: {
  block: ContentBlock;
  index: number;
  onChange: (block: ContentBlock) => void;
}) {
  const id = (suffix: string) => `bloc-${index}-${suffix}`;

  switch (block.kind) {
    case "titre":
      return (
        <Field id={id("texte")} label="Texte">
          <input
            id={id("texte")}
            className="admin-field__input"
            value={block.text}
            onChange={(event) =>
              onChange({ ...block, text: event.target.value })
            }
          />
        </Field>
      );

    case "paragraphe":
    case "note":
      return (
        <Field id={id("texte")} label="Texte">
          <textarea
            id={id("texte")}
            rows={4}
            className="admin-field__input"
            value={block.text}
            onChange={(event) =>
              onChange({ ...block, text: event.target.value })
            }
          />
        </Field>
      );

    case "liste":
      return (
        <Field id={id("items")} label="Puces" hint="Une puce par ligne.">
          <textarea
            id={id("items")}
            rows={Math.max(3, block.items.length)}
            className="admin-field__input"
            value={block.items.join("\n")}
            onChange={(event) =>
              onChange({ ...block, items: splitLines(event.target.value) })
            }
          />
        </Field>
      );

    case "tableau":
      return (
        <>
          <Field id={id("caption")} label="Légende">
            <input
              id={id("caption")}
              className="admin-field__input"
              value={block.caption ?? ""}
              onChange={(event) =>
                onChange({ ...block, caption: event.target.value })
              }
            />
          </Field>
          <Field
            id={id("head")}
            label="En-têtes"
            hint="Une colonne par cellule, séparées par une barre verticale."
          >
            <input
              id={id("head")}
              className="admin-field__input"
              value={block.head.join(" | ")}
              onChange={(event) =>
                onChange({ ...block, head: splitCells(event.target.value) })
              }
            />
          </Field>
          <Field
            id={id("rows")}
            label="Lignes"
            hint="Une ligne par ligne du tableau, cellules séparées par une barre verticale."
          >
            <textarea
              id={id("rows")}
              rows={Math.max(4, block.rows.length)}
              className="admin-field__input"
              value={block.rows.map((row) => row.join(" | ")).join("\n")}
              onChange={(event) =>
                onChange({
                  ...block,
                  rows: splitLines(event.target.value).map(splitCells),
                })
              }
            />
          </Field>
        </>
      );

    case "faq":
      return (
        <>
          {block.items.map((item, position) => (
            <div key={position} className="admin-grid">
              <Field id={id(`q-${position}`)} label={`Question ${position + 1}`}>
                <input
                  id={id(`q-${position}`)}
                  className="admin-field__input"
                  value={item.question}
                  onChange={(event) =>
                    onChange({
                      ...block,
                      items: replaceAt(block.items, position, {
                        ...item,
                        question: event.target.value,
                      }),
                    })
                  }
                />
              </Field>
              <Field id={id(`a-${position}`)} label="Réponse">
                <textarea
                  id={id(`a-${position}`)}
                  rows={3}
                  className="admin-field__input"
                  value={item.answer}
                  onChange={(event) =>
                    onChange({
                      ...block,
                      items: replaceAt(block.items, position, {
                        ...item,
                        answer: event.target.value,
                      }),
                    })
                  }
                />
              </Field>
            </div>
          ))}
        </>
      );

    case "cartes":
    case "etapes":
      return (
        <>
          {block.items.map((item, position) => (
            <div key={position} className="admin-grid">
              <Field
                id={id(`t-${position}`)}
                label={
                  block.kind === "etapes"
                    ? `Étape ${position + 1}`
                    : `Carte ${position + 1}`
                }
              >
                <input
                  id={id(`t-${position}`)}
                  className="admin-field__input"
                  value={item.title}
                  onChange={(event) =>
                    onChange({
                      ...block,
                      items: replaceAt(block.items, position, {
                        ...item,
                        title: event.target.value,
                      }),
                    })
                  }
                />
              </Field>
              <Field id={id(`x-${position}`)} label="Texte">
                <textarea
                  id={id(`x-${position}`)}
                  rows={3}
                  className="admin-field__input"
                  value={item.text}
                  onChange={(event) =>
                    onChange({
                      ...block,
                      items: replaceAt(block.items, position, {
                        ...item,
                        text: event.target.value,
                      }),
                    })
                  }
                />
              </Field>
            </div>
          ))}
        </>
      );

    case "appel":
      return (
        <div className="admin-grid">
          <Field id={id("label")} label="Libellé">
            <input
              id={id("label")}
              className="admin-field__input"
              value={block.label}
              onChange={(event) =>
                onChange({ ...block, label: event.target.value })
              }
            />
          </Field>
          <Field id={id("href")} label="Destination">
            <input
              id={id("href")}
              className="admin-field__input"
              value={block.href}
              onChange={(event) =>
                onChange({ ...block, href: event.target.value })
              }
            />
          </Field>
        </div>
      );
  }
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-field admin-field--full">
      <label className="admin-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && <span className="admin-field__hint">{hint}</span>}
    </div>
  );
}

/** Découpe une saisie multiligne en items, en ignorant les lignes vides. */
function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Découpe une ligne de tableau. Les cellules vides sont conservées : une
    colonne vide au milieu d'une ligne décalerait tout le reste. */
function splitCells(value: string): string[] {
  return value.split("|").map((cell) => cell.trim());
}

function replaceAt<T>(items: T[], index: number, next: T): T[] {
  return items.map((item, position) => (position === index ? next : item));
}
