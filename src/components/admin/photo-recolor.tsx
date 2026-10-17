"use client";

import { useRef, useState } from "react";
import { generateProductPhoto } from "@/app/admin/(back-office)/produits/photo-actions";
import type { UploadedImage } from "@/components/admin/image-uploader";
import {
  referenceFile,
  toUploadedImage,
  type GenerationReference,
} from "@/components/admin/photo-generator";
import { readableInk } from "@/lib/products/color";
import type { ColorDraft } from "@/lib/products/stock-grid";

/** Case affichée pendant la génération, là où la photo va apparaître. */
type Tile =
  | { label: string; state: "loading" }
  | { label: string; state: "ready"; previewUrl: string }
  | { label: string; state: "failed" };

type Status =
  | { kind: "idle" }
  | { kind: "busy"; colorName: string; total: number; ready: number }
  | { kind: "done"; colorName: string; made: number; failed: number }
  | { kind: "error"; message: string };

/**
 * « Générer en rouge » : refait les photos d'une couleur dans une autre.
 *
 * Chaque photo de la couleur de départ part seule chez l'IA, qui la refait à
 * l'identique — même pose, même cadrage — en ne changeant que la couleur de
 * l'article. Les photos d'origine restent ; les nouvelles s'ajoutent à la
 * liste, déjà rangées dans la couleur visée.
 *
 * Marque et nom sont lus dans le formulaire au moment du clic, comme le fait
 * le générateur (voir `PhotoGenerator`).
 */
export function PhotoRecolor({
  enabled,
  source,
  sources,
  targets,
  onGenerated,
}: {
  /** Faux sans clé Gemini. */
  enabled: boolean;
  /** Couleur de départ : celle de la photo cliquée. */
  source?: ColorDraft;
  /** Les photos de la couleur de départ, dans l'ordre de la liste. */
  sources: GenerationReference[];
  /** Les autres couleurs de la fiche. */
  targets: ColorDraft[];
  onGenerated: (colorKey: string, images: UploadedImage[]) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Une case par photo en cours, comme le générateur principal : sans elles,
  // rien ne bouge à l'écran pendant la minute que prend l'IA.
  const [tiles, setTiles] = useState<Tile[]>([]);
  const busy = status.kind === "busy";

  async function recolor(target: ColorDraft) {
    const form = rootRef.current?.closest("form");
    const brandSelect = form?.elements.namedItem("brandSlug");
    const nameInput = form?.elements.namedItem("name");
    const brand =
      brandSelect instanceof HTMLSelectElement && brandSelect.value
        ? (brandSelect.selectedOptions[0]?.text ?? "")
        : "";
    const productName = nameInput instanceof HTMLInputElement ? nameInput.value : "";
    const colorName = target.name.trim() || "nouvelle couleur";

    setStatus({ kind: "busy", colorName, total: sources.length, ready: 0 });
    setTiles(
      sources.map((reference) => ({ label: `${reference.label} en ${colorName}`, state: "loading" })),
    );
    const settle = (index: number, tile: Tile) =>
      setTiles((current) => current.map((entry, i) => (i === index ? tile : entry)));
    try {
      const results = await Promise.all(
        sources.map(async (reference, index) => {
          const label = `${reference.label} en ${colorName}`;
          const data = new FormData();
          data.append("reference", await referenceFile(reference));
          data.set("mode", "recolor");
          data.set("colorName", colorName);
          data.set("hex", target.hex);
          data.set("brand", brand);
          data.set("productName", productName);
          const result = await generateProductPhoto(data);
          setStatus((current) =>
            current.kind === "busy" ? { ...current, ready: current.ready + 1 } : current,
          );
          if (result.status !== "ok") {
            settle(index, { label, state: "failed" });
            return null;
          }
          const image = await toUploadedImage(result.photo, "recolor", `Photo IA — ${colorName}`);
          settle(index, { label, state: "ready", previewUrl: image.previewUrl });
          return image;
        }),
      );
      const made = results.filter((image): image is UploadedImage => image !== null);
      // Dans l'ordre des photos de départ : la série garde sa logique (face,
      // trois-quarts, détail…) dans la nouvelle couleur.
      if (made.length > 0) onGenerated(target.key, made);
      setStatus({ kind: "done", colorName, made: made.length, failed: results.length - made.length });
    } catch (error) {
      console.error("Recoloration :", error);
      setStatus({ kind: "error", message: "La génération n'a pas abouti. Réessayez." });
    }
  }

  // Une seule photo ou plusieurs : la phrase s'accorde.
  const many = sources.length > 1;
  const sourceName = source?.name || "de la couleur choisie";

  return (
    <div ref={rootRef} className="admin-recolor">
      <p className="admin-field__hint">
        {!enabled
          ? ""
          : !source || sources.length === 0
            ? "Pour les autres couleurs : cliquez sur une photo de la couleur de départ."
            : many
              ? `Ou les ${sources.length} photos ${sourceName}, refaites à l'identique dans une autre couleur (elles s'ajoutent, les photos d'origine restent) :`
              : `Ou la photo ${sourceName}, refaite à l'identique dans une autre couleur (elle s'ajoute, la photo d'origine reste) :`}
      </p>

      <div className="admin-recolor__buttons">
        {targets.map((target) => (
          <button
            key={target.key}
            type="button"
            className="admin-recolor__button"
            // Le bouton prend la couleur visée : on voit d'un coup laquelle on
            // génère. Teinte saisie à l'admin, donc style en ligne.
            style={{ backgroundColor: target.hex, color: readableInk(target.hex) }}
            disabled={!enabled || busy || !source || sources.length === 0}
            onClick={() => void recolor(target)}
          >
            Générer en {target.name || "nouvelle couleur"}
          </button>
        ))}
      </div>

      {tiles.length > 0 && (
        <ul className="admin-generate__tiles" aria-label="Photos en cours de génération">
          {tiles.map((tile, index) => (
            <li key={index} className="admin-generate__tile">
              {tile.state === "ready" ? (
                // Aperçu local (blob:) : `next/image` n'a rien à optimiser.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={tile.previewUrl} alt={tile.label} className="admin-generate__tile-image" />
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

      <p className="admin-field__hint" role="status">
        {status.kind === "busy"
          ? `Génération en ${status.colorName}… ${status.ready}/${status.total}`
          : status.kind === "done"
            ? `${status.made} photo${status.made > 1 ? "s" : ""} en ${status.colorName} ajoutée${status.made > 1 ? "s" : ""}${status.failed > 0 ? ` — ${status.failed} n'a pas abouti, réessayez` : ""}.`
            : status.kind === "error"
              ? status.message
              : ""}
      </p>
    </div>
  );
}
