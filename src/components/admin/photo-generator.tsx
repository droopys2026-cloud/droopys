"use client";

import { useRef, useState } from "react";
import { generateProductPhoto } from "@/app/admin/(back-office)/produits/photo-actions";
import type { UploadedImage } from "@/components/admin/image-uploader";
import { toWebp } from "@/lib/images/to-webp";
import {
  PHOTO_GARMENTS,
  DEFAULT_LOOK,
  MODEL_LOOKS,
  PHOTO_SUBJECTS,
  SHOT_LABELS,
  aloneShot,
  type GenerationMode,
  type PhotoGarment,
  type PhotoSubject,
} from "@/lib/photo-prompts";

/**
 * Une photo de l'article que l'IA doit reproduire : un fichier déposé (pas
 * encore en ligne) ou une photo déjà enregistrée sur une fiche qu'on modifie.
 */
export type GenerationReference =
  | { kind: "file"; file: File; label: string }
  | { kind: "url"; url: string; label: string };

/** Ce que la génération rend au champ photos : à ajouter, ou à remplacer. */
export type GeneratedPhoto = { image: UploadedImage; replaces?: string };

/** Une photo à produire : un angle, et pour les photos portées, qui la porte. */
type Shot = {
  mode: GenerationMode;
  subject?: PhotoSubject;
  age?: string;
  /** Origine du mannequin (voir `MODEL_LOOKS`). */
  look?: string;
};

/** Les angles proposés pour chaque photo de la série. */
type Angle =
  | "face"
  | "trois-quarts"
  | "gros-plan"
  | "produit"
  | "detail"
  | "invisible"
  | "cintre"
  | "plie"
  | "scene";

/** Vêtements qu'on peut mettre sur cintre, plier ou montrer « porté sans personne ». */
const CLOTHES: PhotoGarment[] = ["manteau", "haut", "robe", "pantalon"];

/**
 * Seules les mises en scène marquées `worn` exigent un mannequin ; les
 * autres montrent l'article seul. `fits` écarte ce qui n'a pas de sens pour
 * le type d'article — des chaussures sur un cintre, par exemple.
 */
const ANGLES: {
  id: Angle;
  label: string;
  worn: boolean;
  fits?: (garment: PhotoGarment) => boolean;
}[] = [
  { id: "face", label: "Porté de face", worn: true },
  { id: "trois-quarts", label: "Porté de trois-quarts", worn: true },
  { id: "gros-plan", label: "Gros plan porté", worn: true },
  { id: "produit", label: "Produit seul (fond uni)", worn: false },
  { id: "scene", label: "Posé dans le studio", worn: false },
  {
    id: "invisible",
    label: "Mannequin invisible",
    worn: false,
    fits: (garment) => CLOTHES.includes(garment),
  },
  {
    id: "cintre",
    label: "Sur cintre",
    worn: false,
    fits: (garment) => CLOTHES.includes(garment),
  },
  {
    id: "plie",
    label: "Plié à plat",
    worn: false,
    fits: (garment) => CLOTHES.includes(garment),
  },
  { id: "detail", label: "Détail (matière, logo)", worn: false },
];

function angleFits(angle: Angle, garment: PhotoGarment | ""): boolean {
  const entry = ANGLES.find((candidate) => candidate.id === angle);
  return !garment || !entry?.fits || entry.fits(garment);
}

/** Une ligne « Photo n » : son angle et, si elle est portée, son mannequin. */
type Row = { angle: Angle; subject: PhotoSubject | ""; age: string; look: string };

const MAX_PHOTOS = 5;

/**
 * Série proposée d'office : présenter le produit, sans mannequin — c'est le
 * cas le plus courant, et le bouton marche alors sans autre choix. Les lignes
 * 4 et 5, portées, servent quand on veut un mannequin ; chaque ligne se
 * change d'un clic.
 */
const DEFAULT_ROWS: Row[] = [
  { angle: "produit", subject: "", age: "", look: "" },
  { angle: "scene", subject: "", age: "", look: "" },
  { angle: "detail", subject: "", age: "", look: "" },
  { angle: "face", subject: "", age: "", look: "" },
  { angle: "trois-quarts", subject: "", age: "", look: "" },
];

/** Case affichée pendant la génération, là où la photo va apparaître. */
type Tile =
  | { label: string; state: "loading" }
  | { label: string; state: "ready"; previewUrl: string }
  | { label: string; state: "failed" };

type Status =
  | { kind: "idle" }
  | { kind: "busy"; total: number; ready: number }
  | { kind: "error"; message: string }
  | { kind: "done"; made: number; failed: number };

/**
 * « Générer les photos avec l'IA » : à partir d'une ou deux photos réelles de
 * l'article (face et dos, typiquement), l'IA refait l'article dans le studio
 * de la boutique.
 *
 * On compose sa série : un ou plusieurs mannequins — des chaussures portées
 * par un garçon *et* par une fille —, chacun à son âge, et les prises de vue
 * voulues. Les demandes partent en parallèle.
 *
 * Les photos générées rejoignent les photos en attente, comme une photo
 * déposée à la main : rien n'est publié avant l'enregistrement de la fiche
 * (elles sont en revanche gardées dans Admin → Photos IA dès leur création).
 *
 * Marque et nom sont lus dans le formulaire au moment du clic plutôt que
 * remontés en état : ce sont des champs non contrôlés (voir `ProductForm`).
 */
export function PhotoGenerator({
  enabled,
  references,
  emptyHint,
  onGenerated,
}: {
  /** Faux sans clé Gemini : les boutons restent visibles mais inactifs. */
  enabled: boolean;
  /** Une ou deux photos de l'article, dans l'ordre où l'IA doit les lire. */
  references: GenerationReference[];
  /** Ce qu'il faut faire quand aucune photo ne peut servir de modèle. */
  emptyHint?: string;
  onGenerated: (photos: GeneratedPhoto[]) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [tiles, setTiles] = useState<Tile[]>([]);
  // Rien de pré-coché pour le type ni les mannequins : un choix pré-rempli se
  // laisse oublier, et des baskets partaient photographiées comme un manteau.
  const [garment, setGarment] = useState<PhotoGarment | "">("");
  const [count, setCount] = useState(3);
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  // Dernière génération : « Refaire » relance les mêmes photos et remplace, à
  // leur place, celles qu'elle avait produites.
  const [last, setLast] = useState<{
    shots: Shot[];
    imageIds: (string | undefined)[];
  } | null>(null);

  const visible = rows.slice(0, count);
  const missingModel = visible.findIndex(
    (row) => isWorn(row.angle) && row.subject === "",
  );
  const plan =
    garment && missingModel === -1
      ? visible.map((row) => toShot(row, garment))
      : [];

  function updateRow(index: number, change: Partial<Row>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...change } : row)),
    );
  }

  /**
   * Choisir un mannequin le donne aussi aux autres photos portées qui n'en
   * ont pas encore : sans quoi la photo 3, portée elle aussi, bloquait le
   * bouton sans qu'on comprenne pourquoi. Chaque ligne reste modifiable.
   */
  function chooseModel(index: number, subject: PhotoSubject | "") {
    const age = subject ? PHOTO_SUBJECTS[subject].defaultAge : "";
    setRows((current) =>
      current.map((row, i) =>
        i === index || (subject && isWorn(row.angle) && row.subject === "")
          ? // L'origine déjà choisie sur la ligne est gardée : changer de
            // rayon ne doit pas changer d'enfant.
            { ...row, subject, age, look: subject ? row.look || DEFAULT_LOOK : "" }
          : row,
      ),
    );
  }

  /** Une ligne qui devient portée reprend le mannequin déjà choisi ailleurs. */
  function chooseAngle(index: number, angle: Angle) {
    setRows((current) => {
      const known = current.find((row) => row.subject !== "");
      return current.map((row, i) =>
        i !== index
          ? row
          : isWorn(angle) && row.subject === "" && known
            ? { ...row, angle, subject: known.subject, age: known.age, look: known.look }
            : { ...row, angle },
      );
    });
  }

  async function run(shots: Shot[], replaces: (string | undefined)[] = []) {
    if (references.length === 0 || !garment || shots.length === 0) return;
    const form = rootRef.current?.closest("form");
    const brandSelect = form?.elements.namedItem("brandSlug");
    const nameInput = form?.elements.namedItem("name");
    const brand =
      brandSelect instanceof HTMLSelectElement && brandSelect.value
        ? (brandSelect.selectedOptions[0]?.text ?? "")
        : "";
    const productName =
      nameInput instanceof HTMLInputElement ? nameInput.value : "";

    setStatus({ kind: "busy", total: shots.length, ready: 0 });
    setTiles(
      shots.map((shot) => ({ label: shotLabel(shot), state: "loading" })),
    );
    const settle = (index: number, tile: Tile) =>
      setTiles((current) =>
        current.map((entry, i) => (i === index ? tile : entry)),
      );
    try {
      const files = await Promise.all(references.map(referenceFile));
      const results = await Promise.all(
        shots.map(async (shot, index): Promise<GeneratedPhoto | string> => {
          const data = new FormData();
          for (const file of files) data.append("reference", file);
          data.set("mode", shot.mode);
          data.set("garment", garment);
          data.set("brand", brand);
          data.set("productName", productName);
          if (shot.subject) data.set("subject", shot.subject);
          if (shot.age) data.set("age", shot.age);
          if (shot.look) data.set("look", shot.look);
          const result = await generateProductPhoto(data);
          setStatus((current) =>
            current.kind === "busy"
              ? { ...current, ready: current.ready + 1 }
              : current,
          );
          if (result.status === "error") {
            settle(index, { label: shotLabel(shot), state: "failed" });
            return result.message;
          }
          const image = await toUploaded(result.photo, shot);
          // La photo prend la place de sa case dès qu'elle arrive, sans
          // attendre les autres.
          settle(index, {
            label: shotLabel(shot),
            state: "ready",
            previewUrl: image.previewUrl,
          });
          return { image, replaces: replaces[index] };
        }),
      );

      const made = results.filter(
        (entry): entry is GeneratedPhoto => typeof entry !== "string",
      );
      const errors = results.filter(
        (entry): entry is string => typeof entry === "string",
      );
      onGenerated(made);
      // Les photos rejoignent la liste au-dessus : les cases ont fait leur
      // office.
      setTiles([]);
      setLast({
        shots,
        // Une photo ratée n'a rien à remplacer : « Refaire » l'ajoutera.
        imageIds: results.map((entry) =>
          typeof entry === "string" ? undefined : entry.image.id,
        ),
      });
      setStatus(
        made.length === 0
          ? {
              kind: "error",
              message: errors[0] ?? "La génération n'a pas abouti.",
            }
          : { kind: "done", made: made.length, failed: errors.length },
      );
    } catch (failure) {
      setTiles([]);
      console.error("Génération de photo :", failure);
      setStatus({
        kind: "error",
        message: "La génération n'a pas abouti. Réessayez.",
      });
    }
  }

  const busy = status.kind === "busy";
  const ready = enabled && references.length > 0 && !busy;

  return (
    <div ref={rootRef} className="admin-generate">
      <p className="admin-field__label">Générer les photos avec l&apos;IA</p>
      <p className="admin-field__hint">
        {!enabled
          ? "La clé Google Gemini n'est pas configurée : la génération est désactivée."
          : references.length > 0
            ? `L'IA part de : ${references.map((reference) => reference.label).join(" et ")}. Une ou deux photos de l'article suffisent — face et dos, par exemple.`
            : (emptyHint ??
              "Déposez d'abord une ou deux photos de l'article ci-dessus (face et dos, par exemple) : l'IA s'en sert comme modèle.")}
      </p>

      <label className="admin-generate__option">
        <span>Type d&apos;article</span>
        <select
          className="admin-field__input"
          value={garment}
          onChange={(event) => {
            const value = event.target.value;
            const next = isGarment(value) ? value : "";
            setGarment(next);
            // Une mise en scène qui ne va plus avec le nouveau type (des
            // chaussures « sur cintre ») repasse en produit seul.
            setRows((current) =>
              current.map((row) =>
                angleFits(row.angle, next) ? row : { ...row, angle: "produit" },
              ),
            );
          }}
        >
          <option value="">Choisir…</option>
          {Object.entries(PHOTO_GARMENTS).map(([id, entry]) => (
            <option key={id} value={id}>
              {entry.label}
            </option>
          ))}
        </select>
      </label>

      <div className="admin-generate__option">
        <span id="nombre-photos">Nombre de photos</span>
        <div
          className="admin-generate__count"
          role="group"
          aria-labelledby="nombre-photos"
        >
          {Array.from({ length: MAX_PHOTOS }, (_, index) => index + 1).map(
            (value) => (
              <button
                key={value}
                type="button"
                className="admin-generate__count-button"
                aria-pressed={count === value}
                onClick={() => setCount(value)}
              >
                {value}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Une ligne par photo, dans l'ordre de la galerie : la 1re fait la
          carte produit, la 2e apparaît au survol. */}
      <ol className="admin-generate__rows">
        {visible.map((row, index) => (
          <li
            key={index}
            className={
              garment && isWorn(row.angle) && row.subject === ""
                ? "admin-generate__row admin-generate__row--missing"
                : "admin-generate__row"
            }
          >
            <span className="admin-generate__row-title">
              Photo {index + 1}
              {index === 0 && (
                <span className="admin-generate__hint"> — la carte</span>
              )}
              {index === 1 && (
                <span className="admin-generate__hint"> — au survol</span>
              )}
            </span>
            <select
              className="admin-field__input"
              aria-label={`Angle de la photo ${index + 1}`}
              value={row.angle}
              onChange={(event) => {
                const value = event.target.value;
                if (isAngle(value)) chooseAngle(index, value);
              }}
            >
              {ANGLES.filter((angle) => angleFits(angle.id, garment)).map(
                (angle) => (
                  <option key={angle.id} value={angle.id}>
                    {angle.label}
                  </option>
                ),
              )}
            </select>
            {isWorn(row.angle) && (
              <>
                <select
                  className="admin-field__input"
                  aria-label={`Mannequin de la photo ${index + 1}`}
                  value={row.subject}
                  onChange={(event) => {
                    const value = event.target.value;
                    // L'âge suit le mannequin : « 6 mois » n'a pas de sens
                    // pour une fille, on repart de l'âge proposé.
                    chooseModel(index, isSubject(value) ? value : "");
                  }}
                >
                  <option value="">Mannequin…</option>
                  {subjectList().map((subject) => (
                    <option key={subject} value={subject}>
                      {PHOTO_SUBJECTS[subject].label.split(" ")[0]}
                    </option>
                  ))}
                </select>
                {row.subject && (
                  <select
                    className="admin-field__input"
                    aria-label={`Âge du mannequin de la photo ${index + 1}`}
                    value={row.age}
                    onChange={(event) =>
                      updateRow(index, { age: event.target.value })
                    }
                  >
                    {PHOTO_SUBJECTS[row.subject].ages.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                )}
                {row.subject && (
                  <select
                    className="admin-field__input"
                    aria-label={`Origine du mannequin de la photo ${index + 1}`}
                    value={row.look}
                    onChange={(event) =>
                      updateRow(index, { look: event.target.value })
                    }
                  >
                    {MODEL_LOOKS.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="admin-button admin-generate__series"
        disabled={!ready || plan.length === 0}
        onClick={() => void run(plan)}
      >
        {busy
          ? "Génération en cours…"
          : count > 1
            ? `Générer les ${count} photos`
            : "Générer la photo"}
        <span className="admin-generate__hint">
          {!garment
            ? "Choisissez d'abord le type d'article."
            : missingModel !== -1
              ? `Choisissez le mannequin de la photo ${missingModel + 1}.`
              : plan.map(shotLabel).join(" · ")}
        </span>
      </button>

      {tiles.length > 0 && (
        <ul
          className="admin-generate__tiles"
          aria-label="Photos en cours de génération"
        >
          {tiles.map((tile, index) => (
            <li key={index} className="admin-generate__tile">
              {tile.state === "ready" ? (
                // Aperçu local (blob:) : `next/image` n'a rien à optimiser.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tile.previewUrl}
                  alt={tile.label}
                  className="admin-generate__tile-image"
                />
              ) : (
                <div className="admin-generate__tile-wait">
                  <span className="admin-generate__tile-text">
                    {tile.state === "loading" ? "Génération…" : "Échec"}
                  </span>
                  {tile.state === "loading" && (
                    <span
                      className="admin-generate__bar"
                      role="progressbar"
                      aria-label={`Génération : ${tile.label}`}
                    >
                      <span className="admin-generate__bar-fill" />
                    </span>
                  )}
                </div>
              )}
              <span className="admin-generate__tile-label">{tile.label}</span>
            </li>
          ))}
        </ul>
      )}

      {last && (
        <div className="admin-generate__redo">
          <span>
            {last.shots.length > 1
              ? "Les photos ne conviennent pas ?"
              : "La photo ne convient pas ?"}
          </span>
          <button
            type="button"
            className="admin-button admin-button--small"
            disabled={!ready}
            onClick={() => void run(last.shots, last.imageIds)}
          >
            {last.shots.length > 1
              ? `Refaire les ${last.shots.length} photos`
              : "Refaire la photo"}
          </button>
        </div>
      )}

      <p className="admin-field__hint" aria-live="polite">
        {status.kind === "busy" &&
          `Génération en cours — ${status.ready} sur ${status.total} prête${status.ready > 1 ? "s" : ""}. Comptez une à deux minutes.`}
        {status.kind === "done" &&
          (status.failed > 0
            ? `${status.made} photo${status.made > 1 ? "s" : ""} ajoutée${status.made > 1 ? "s" : ""}, ${status.failed} n'a pas pu être faite : « Refaire » la relance.`
            : status.made === 1
              ? "Photo ajoutée ci-dessus. Elle sera enregistrée avec la fiche ; retirez-la si elle ne vous plaît pas."
              : `${status.made} photos ajoutées ci-dessus. Elles seront enregistrées avec la fiche ; retirez celles qui ne vous plaisent pas.`)}
      </p>
      {status.kind === "error" && (
        <p role="alert" className="admin-form__error">
          {status.message}
        </p>
      )}
    </div>
  );
}

/** Les mannequins, dans l'ordre de `PHOTO_SUBJECTS`. */
function subjectList(): PhotoSubject[] {
  return Object.keys(PHOTO_SUBJECTS).filter(isSubject);
}

function isWorn(angle: Angle): boolean {
  return ANGLES.some((entry) => entry.id === angle && entry.worn);
}

function isAngle(value: string): value is Angle {
  return ANGLES.some((entry) => entry.id === value);
}

/** Une ligne de la série, traduite en prise de vue pour le serveur. */
function toShot(row: Row, garment: PhotoGarment): Shot {
  switch (row.angle) {
    case "produit":
      return { mode: aloneShot(garment) };
    case "detail":
    case "invisible":
    case "cintre":
    case "plie":
    case "scene":
      return { mode: row.angle };
    case "face":
    case "trois-quarts":
    case "gros-plan": {
      const mode: GenerationMode =
        row.angle === "face"
          ? "porte"
          : row.angle === "trois-quarts"
            ? "porte-trois-quarts"
            : "gros-plan";
      return row.subject
        ? { mode, subject: row.subject, age: row.age, look: row.look }
        : { mode };
    }
  }
}

/** « Porté de face (fille, 10 ans) », « Produit seul »… */
function shotLabel(shot: Shot): string {
  if (!shot.subject) {
    return shot.mode === "chaussures" ||
      shot.mode === "vetement" ||
      shot.mode === "accessoire"
      ? "Produit seul"
      : SHOT_LABELS[shot.mode];
  }
  const spec = PHOTO_SUBJECTS[shot.subject];
  const age = spec.ages.find((entry) => entry.id === shot.age)?.label;
  const look = MODEL_LOOKS.find((entry) => entry.id === shot.look)?.label.toLowerCase();
  return `${SHOT_LABELS[shot.mode]} (${spec.label.split(" ")[0].toLowerCase()}${age ? `, ${age}` : ""}${look ? `, ${look}` : ""})`;
}

function isSubject(value: string): value is PhotoSubject {
  return Object.hasOwn(PHOTO_SUBJECTS, value);
}

function isGarment(value: string): value is PhotoGarment {
  return Object.hasOwn(PHOTO_GARMENTS, value);
}

/** Photo d'une prise de vue de la série, nommée d'après elle. */
async function toUploaded(
  photo: { mimeType: string; base64: string },
  shot: Shot,
): Promise<UploadedImage> {
  return toUploadedImage(photo, shot.mode, `Photo IA — ${shotLabel(shot)}`);
}

/**
 * La photo rendue par l'IA, traitée comme une photo déposée : WebP, 2000 px.
 * L'identifiant commence par « ia- » : c'est ce qui la signale comme générée.
 */
export async function toUploadedImage(
  photo: { mimeType: string; base64: string },
  kind: string,
  name: string,
): Promise<UploadedImage> {
  const bytes = Uint8Array.from(atob(photo.base64), (char) =>
    char.charCodeAt(0),
  );
  const raw = new File([bytes], `ia-${kind}`, { type: photo.mimeType });
  const webp = await toWebp(raw);
  return {
    id: `ia-${kind}-${crypto.randomUUID()}`,
    name,
    previewUrl: URL.createObjectURL(webp),
    file: webp,
    originalBytes: raw.size,
    webpBytes: webp.size,
  };
}

/** Une photo déjà en ligne est rechargée pour partir avec la demande. */
export async function referenceFile(reference: GenerationReference): Promise<File> {
  if (reference.kind === "file") return reference.file;
  const response = await fetch(reference.url);
  if (!response.ok)
    throw new Error(`Photo de référence introuvable (${response.status})`);
  const blob = await response.blob();
  // Même traitement qu'une photo déposée : une photo en ligne peut peser
  // plusieurs mégaoctets, au-delà de ce qu'une action serveur accepte.
  return toWebp(
    new File([blob], "reference", { type: blob.type || "image/webp" }),
  );
}
