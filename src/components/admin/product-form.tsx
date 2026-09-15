"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ImageUploader,
  type UploadedImage,
} from "@/components/admin/image-uploader";
import { CarePicker } from "@/components/admin/care-picker";
import { BRANDS } from "@/lib/brands";
import { CATEGORIES } from "@/lib/categories";
import { SIZE_SCALES, getSizeScale } from "@/lib/sizes";
import {
  GENERATION_MODES,
  PHOTO_GARMENTS,
  buildAccessoryPackshotPrompt,
  buildGarmentPackshotPrompt,
  buildOnModelPrompt,
  buildOutletPackshotPrompt,
  buildShoePackshotPrompt,
  type GenerationMode,
  type PhotoGarment,
  type PhotoSubject,
} from "@/lib/photo-prompts";

/** Mesures relevées sur la pièce elle-même, à plat. */
const DEFAULT_MEASUREMENTS = [
  "Longueur totale",
  "Largeur d'épaules",
  "Longueur de manche",
  "Demi-tour de taille",
];

/**
 * Formulaire de fiche produit.
 *
 * Rien n'est encore enregistré : la base n'est pas branchée. Tout l'état vit
 * donc dans le composant, et le bouton d'enregistrement reste inactif — mieux
 * vaut un bouton visiblement mort qu'un bouton qui perd la saisie en silence.
 */
export function ProductForm() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  // Les tailles se choisissent dans un tableau, elles ne se tapent pas : une
  // saisie libre finit toujours par produire « 4 », « 4A » et « 4 ANS » côte
  // à côte, et la recherche par taille ne marche plus.
  const [picker, setPicker] = useState(false);
  const [scaleId, setScaleId] = useState("numeros");
  const [sizes, setSizes] = useState<string[]>([]);
  const [stock, setStock] = useState<Record<string, number>>({});
  const [measurements, setMeasurements] = useState(DEFAULT_MEASUREMENTS);
  const [care, setCare] = useState("");

  const [brandSlug, setBrandSlug] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState<PhotoSubject>("garcon");
  const [garment, setGarment] = useState<PhotoGarment>("manteau");

  // Sans marque, les prompts parlent simplement de « la pièce » : écrire
  // « la marque » produirait une phrase bancale envoyée telle quelle à l'IA.
  const brandName =
    BRANDS.find((brand) => brand.slug === brandSlug)?.name ?? "";

  // Chaque mode a son prompt. Ils se recalculent à la frappe et ne sont
  // jamais affichés : le vendeur remplit une fiche, il ne lit pas des
  // instructions destinées à une machine.
  const prompts = useMemo(() => {
    const input = {
      subject,
      garment,
      brand: brandName,
      productName: name || "pièce",
    };
    return {
      chaussures: buildShoePackshotPrompt(input),
      vetement: buildGarmentPackshotPrompt(input),
      accessoire: buildAccessoryPackshotPrompt(input),
      outlet: buildOutletPackshotPrompt(input),
      porte: buildOnModelPrompt(input),
    } satisfies Record<GenerationMode, string>;
  }, [subject, garment, brandName, name]);

  return (
    <form className="admin-form admin-form--wide">
      {/* ---- identité ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Identité{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="marque">
              Marque <span className="admin-badge">facultatif</span>
            </label>
            <select
              id="marque"
              className="admin-field__input"
              value={brandSlug}
              onChange={(event) => setBrandSlug(event.target.value)}
            >
              <option value="">Sans marque</option>
              {BRANDS.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="nom">
              Nom du produit
            </label>
            <input
              id="nom"
              className="admin-field__input"
              placeholder="Pantalon Daya Cropped Vintage Blue"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="prix">
              Prix (€)
            </label>
            <input
              id="prix"
              className="admin-field__input"
              placeholder="495,00"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="prix-barre">
              Prix barré (€) <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="prix-barre"
              className="admin-field__input"
              placeholder="Laisser vide hors promotion"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="reference">
              Référence <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="reference"
              className="admin-field__input"
              placeholder="PA0807FAD4H01I30VU"
            />
          </div>
        </div>
      </fieldset>

      {/* ---- classement ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Classement{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="rayon">
              Rayon
            </label>
            <select
              id="rayon"
              className="admin-field__input"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value as PhotoSubject)
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.headline ?? category.title}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="sous-rayon">
              Sous-rayon <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="sous-rayon"
              className="admin-field__input"
              placeholder="Pantalons et jeans"
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="type">
              Type de vêtement
            </label>
            <select
              id="type"
              className="admin-field__input"
              value={garment}
              onChange={(event) =>
                setGarment(event.target.value as PhotoGarment)
              }
            >
              {Object.entries(PHOTO_GARMENTS).map(([value, entry]) => (
                <option key={value} value={value}>
                  {entry.label}
                </option>
              ))}
            </select>
            <p className="admin-field__hint">
              Sert au cadrage des photos générées par l&apos;IA.
            </p>
          </div>
        </div>
      </fieldset>

      {/* ---- tailles ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Tailles et stock{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-sizes-head">
          <p className="admin-field__label">
            {sizes.length === 0
              ? "Aucune taille choisie"
              : `${sizes.length} taille${sizes.length > 1 ? "s" : ""} proposée${sizes.length > 1 ? "s" : ""}`}
          </p>
          <button
            type="button"
            className="admin-button admin-button--ghost admin-button--small"
            aria-expanded={picker}
            onClick={() => setPicker(!picker)}
          >
            {picker ? "Fermer" : "Choisir les tailles"}
          </button>
        </div>

        {picker && (
          <div className="admin-picker">
            <div className="admin-picker__tabs">
              {SIZE_SCALES.map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  className="admin-picker__tab"
                  aria-pressed={scaleId === scale.id}
                  onClick={() => setScaleId(scale.id)}
                >
                  {scale.label}
                </button>
              ))}
            </div>

            <ul className="admin-picker__grid">
              {getSizeScale(scaleId)?.sizes.map((size) => {
                const chosen = sizes.includes(size);
                return (
                  <li key={size}>
                    <button
                      type="button"
                      className="admin-chip"
                      aria-pressed={chosen}
                      onClick={() => {
                        if (chosen) {
                          setSizes(sizes.filter((item) => item !== size));
                          const next = { ...stock };
                          delete next[size];
                          setStock(next);
                        } else {
                          setSizes([...sizes, size]);
                        }
                      }}
                    >
                      {size}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {sizes.length > 0 && (
          /* Un vrai tableau : deux colonnes titrées valent mieux qu'un champ
             nu à côté d'une taille — on doit voir d'un coup ce qui est en
             stock et ce qui ne l'est pas. */
          <table className="admin-stock">
            <thead>
              <tr>
                <th scope="col">Taille</th>
                <th scope="col">Stock</th>
                <th scope="col">
                  <span className="sr-only">Retirer</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((size) => {
                const quantity = stock[size] ?? 0;
                return (
                  <tr key={size}>
                    <td className="admin-stock__size">{size}</td>
                    <td>
                      <div className="admin-stock__cell">
                        <input
                          type="number"
                          min={0}
                          className="admin-size__input"
                          aria-label={`Stock pour la taille ${size}`}
                          placeholder="0"
                          value={stock[size] ?? ""}
                          onChange={(event) =>
                            setStock({
                              ...stock,
                              [size]: Number(event.target.value),
                            })
                          }
                        />
                        <span
                          className={
                            quantity > 0
                              ? "admin-stock__state"
                              : "admin-stock__state admin-stock__state--out"
                          }
                        >
                          {quantity > 0 ? "en stock" : "rupture"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-thumb__icon"
                        aria-label={`Retirer la taille ${size}`}
                        onClick={() => {
                          setSizes(sizes.filter((item) => item !== size));
                          const next = { ...stock };
                          delete next[size];
                          setStock(next);
                        }}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <p className="admin-field__hint">
          Une taille à 0 s&apos;affiche en rupture ; une taille non choisie
          n&apos;est pas proposée du tout.
        </p>
      </fieldset>

      {/* ---- descriptif ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Descriptif{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-field">
          <label className="admin-field__label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={7}
            className="admin-field__input"
            placeholder={
              "Une ligne par point :\nJean droit en denim de coton bleu délavé.\nCoupe cropped.\nClassique 5 poches."
            }
          />
        </div>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="fabrication">
              Fabriqué en
            </label>
            <input
              id="fabrication"
              className="admin-field__input"
              placeholder="Maroc"
            />
          </div>
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="composition">
              Composition
            </label>
            <input
              id="composition"
              className="admin-field__input"
              placeholder="100 % coton"
            />
          </div>
          <div className="admin-field admin-field--full">
            <div className="admin-field__head">
              <label className="admin-field__label" htmlFor="entretien">
                Conseil d&apos;entretien
              </label>
              <CarePicker value={care} onChange={setCare} />
            </div>
            <textarea
              id="entretien"
              rows={4}
              className="admin-field__input"
              value={care}
              onChange={(event) => setCare(event.target.value)}
              placeholder={
                "Une consigne par ligne :\nLavage sur cycle délicat en machine à 30°.\nNe pas sécher en machine.\nRepassage doux sur l'envers."
              }
            />
          </div>
        </div>
      </fieldset>

      {/* ---- mesures ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Mesures du vêtement <span className="admin-badge">facultatif</span>
        </legend>

        {/* Facultatif : laissé vide, le bloc ne s'affiche pas du tout sur la
            fiche. Mieux vaut pas de mesures qu'une mesure inventée — mais
            quand elles y sont, elles évitent des retours. */}
        <p className="admin-field__hint">
          Relevées sur la pièce à plat. Laissez vide si vous ne les avez pas :
          rien ne s&apos;affichera sur la fiche.
        </p>
        <ul className="admin-measures">
          {measurements.map((label, index) => (
            <li key={label} className="admin-measure">
              <input
                className="admin-field__input"
                aria-label="Intitulé de la mesure"
                value={label}
                onChange={(event) => {
                  const next = [...measurements];
                  next[index] = event.target.value;
                  setMeasurements(next);
                }}
              />
              <input
                className="admin-field__input"
                aria-label={`Valeur de « ${label} »`}
                placeholder="48 cm"
              />
              <button
                type="button"
                className="admin-thumb__icon"
                aria-label={`Retirer « ${label} »`}
                onClick={() =>
                  setMeasurements(measurements.filter((_, i) => i !== index))
                }
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="admin-button admin-button--ghost admin-button--small"
          onClick={() => setMeasurements([...measurements, "Nouvelle mesure"])}
        >
          Ajouter une mesure
        </button>
      </fieldset>

      {/* ---- photos ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Photos{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <ImageUploader
          images={images}
          onChange={setImages}
          selectedId={selectedImage}
          onSelect={setSelectedImage}
        />

        {/* Trois boutons, trois IA : un packshot et une photo portée ne
            demandent pas la même chose, et une seule IA qui ferait les deux
            les ferait mal toutes les deux. */}
        <div className="admin-generate">
          <p className="admin-field__label">
            Générer une photo{" "}
            <span className="admin-badge admin-badge--required">
              obligatoire
            </span>
          </p>
          <div className="admin-generate__actions">
            {GENERATION_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className="admin-button admin-button--ghost admin-button--small"
                disabled={!selectedImage}
                onClick={() => {
                  // Le prompt correspondant est prêt : il partira au
                  // fournisseur d'images dès qu'on en aura choisi un.
                  void prompts[mode.id];
                }}
              >
                {mode.label}
                <span className="admin-generate__hint">{mode.hint}</span>
              </button>
            ))}
          </div>
          <p className="admin-field__hint">
            Chaque photo passe par une génération avant publication : c&apos;est
            ce qui donne à toute la boutique la même lumière et le même décor.{" "}
            {selectedImage
              ? "La photo choisie sert de référence : la pièce est reproduite à l'identique, seul le décor change."
              : "Choisissez d'abord une photo dans la liste."}
          </p>
        </div>
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled>
          Enregistrer le produit
        </button>
        <Link
          href="/admin/produits"
          className="admin-button admin-button--ghost"
        >
          Annuler
        </Link>
        <p className="admin-form__note">
          L&apos;enregistrement et l&apos;envoi des photos seront actifs une
          fois Supabase connecté.
        </p>
      </div>
    </form>
  );
}
