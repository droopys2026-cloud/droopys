"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveProduct,
  type ProductFormState,
} from "@/app/admin/(back-office)/produits/actions";
import { CarePicker } from "@/components/admin/care-picker";
import type { UploadedImage } from "@/components/admin/image-uploader";
import {
  DEFAULT_MEASUREMENTS,
  ProductMeasurementsField,
  type Measurement,
} from "@/components/admin/product-measurements-field";
import { ProductPhotosField } from "@/components/admin/product-photos-field";
import { ProductPlacementsField } from "@/components/admin/product-placements-field";
import {
  ProductSizesField,
  type SizeStock,
} from "@/components/admin/product-sizes-field";

/** Ce que le formulaire sait déjà en modification. Absent en création. */
export type ProductFormValues = {
  id: string;
  brandSlug: string;
  name: string;
  priceCents: number;
  compareAtPriceCents: number | null;
  reference: string | null;
  categorySlug: string | null;
  subcategoryId: string | null;
  /** Sous-rayons où l'article apparaît en plus du sien. */
  placementIds: string[];
  description: string[];
  madeIn: string | null;
  composition: string | null;
  care: string | null;
  modelNote: string | null;
  sizeAdvice: string | null;
  badge: string | null;
  published: boolean;
  sizes: SizeStock[];
  measurements: Measurement[];
  images: string[];
};

type Option = { id: string; label: string };

/** Un sous-rayon n'a de sens que rattaché à son rayon : il voyage avec lui. */
type SubcategoryOption = Option & { categorySlug: string };

/** Centimes → « 495,00 », la forme attendue par le champ et relue par Zod. */
function euros(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

/**
 * Formulaire de fiche produit, en création comme en modification.
 *
 * Les champs simples sont **non contrôlés** : leur valeur part dans la
 * `FormData` à l'envoi, sans état React. Seuls les blocs composés — tailles,
 * mesures, photos — gardent un état, parce qu'ils n'ont pas de représentation
 * naturelle en champ HTML ; ils voyagent alors en JSON dans un champ caché.
 *
 * L'envoi passe par une Server Action : c'est elle, et non ce composant, qui
 * valide. Ce qui est vérifié ici l'est pour le confort de saisie, jamais pour
 * la sécurité — un formulaire peut être appelé sans passer par cette page.
 */
export function ProductForm({
  brands,
  categories,
  subcategories,
  product,
}: {
  brands: Option[];
  categories: Option[];
  subcategories: SubcategoryOption[];
  product?: ProductFormValues;
}) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(
    saveProduct,
    {},
  );

  /**
   * Le rayon est le seul champ simple sous état : la liste des sous-rayons en
   * dépend, et une liste qui ne se rafraîchit qu'à l'envoi laisserait choisir
   * « Robes » pour un article du rayon garçon.
   */
  const [categorySlug, setCategorySlug] = useState(product?.categorySlug ?? "");
  const [subcategoryId, setSubcategoryId] = useState(
    product?.subcategoryId ?? "",
  );
  const available = subcategories.filter(
    (entry) => entry.categorySlug === categorySlug,
  );

  const [sizes, setSizes] = useState<SizeStock[]>(product?.sizes ?? []);
  const [measurements, setMeasurements] = useState<Measurement[]>(
    product?.measurements?.length ? product.measurements : DEFAULT_MEASUREMENTS,
  );
  const [kept, setKept] = useState<string[]>(product?.images ?? []);
  const [pendingImages, setPendingImages] = useState<UploadedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /**
   * Les fichiers vivent dans l'état React, pas dans un `<input type="file">` :
   * ils ont été convertis en WebP dans le navigateur. On les rattache donc à
   * la `FormData` juste avant l'envoi.
   */
  function submit(formData: FormData) {
    for (const image of pendingImages) formData.append("photos", image.file);
    formData.set("sizes", JSON.stringify(sizes));
    formData.set(
      "measurements",
      JSON.stringify(
        measurements.filter((entry) => entry.label.trim() && entry.value.trim()),
      ),
    );
    formData.set("keptImages", JSON.stringify(kept));
    action(formData);
  }

  return (
    <form className="admin-form admin-form--wide" action={submit}>
      {product && <input type="hidden" name="productId" value={product.id} />}

      {state.errors && state.errors.length > 0 && (
        /* Le récapitulatif est placé avant les champs, pas sous le bouton :
           un message sous le bouton n'est lu ni par un lecteur d'écran qui
           vient de remonter, ni par un œil pressé. */
        <div role="alert" className="admin-form__error">
          <p>
            {state.errors.length > 1
              ? "La fiche n'a pas été enregistrée :"
              : "La fiche n'a pas été enregistrée."}
          </p>
          <ul>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- identité ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Identité{" "}
          <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="marque">
              Marque
            </label>
            <select
              id="marque"
              name="brandSlug"
              required
              className="admin-field__input"
              defaultValue={product?.brandSlug ?? ""}
            >
              <option value="">Choisir une marque</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.label}
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
              name="name"
              required
              className="admin-field__input"
              placeholder="Pantalon Daya Cropped Vintage Blue"
              defaultValue={product?.name ?? ""}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="prix">
              Prix (€)
            </label>
            <input
              id="prix"
              name="priceCents"
              required
              inputMode="decimal"
              className="admin-field__input"
              placeholder="495,00"
              defaultValue={euros(product?.priceCents)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="prix-barre">
              Prix barré (€) <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="prix-barre"
              name="compareAtPriceCents"
              inputMode="decimal"
              className="admin-field__input"
              placeholder="Laisser vide hors promotion"
              defaultValue={euros(product?.compareAtPriceCents)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="reference">
              Référence <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="reference"
              name="reference"
              className="admin-field__input"
              placeholder="PA0807FAD4H01I30VU"
              defaultValue={product?.reference ?? ""}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="badge">
              Pastille <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="badge"
              name="badge"
              className="admin-field__input"
              placeholder="Nouveau"
              defaultValue={product?.badge ?? ""}
            />
            <p className="admin-field__hint">
              Affichée en coin de la photo, sur la carte comme sur la fiche.
            </p>
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
              name="categorySlug"
              required
              className="admin-field__input"
              value={categorySlug}
              onChange={(event) => {
                setCategorySlug(event.target.value);
                // Sans cette remise à zéro, le sous-rayon du rayon précédent
                // resterait sélectionné et partirait avec le formulaire.
                setSubcategoryId("");
              }}
            >
              <option value="">Choisir un rayon</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="sous-rayon">
              Sous-rayon <span className="admin-badge">facultatif</span>
            </label>
            <select
              id="sous-rayon"
              name="subcategoryId"
              className="admin-field__input"
              value={subcategoryId}
              onChange={(event) => setSubcategoryId(event.target.value)}
              disabled={available.length === 0}
            >
              <option value="">
                {categorySlug === ""
                  ? "Choisir un rayon d'abord"
                  : available.length === 0
                    ? "Ce rayon n'a pas encore de sous-rayon"
                    : "Aucun"}
              </option>
              {available.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
            <p className="admin-field__hint">
              Les sous-rayons se créent dans{" "}
              <Link href="/admin/menu">Menu</Link>.
            </p>
          </div>

          <ProductPlacementsField
            groups={categories.map((category) => ({
              label: category.label,
              // Le sous-rayon principal est déjà la place de l'article.
              options: subcategories.filter(
                (entry) => entry.categorySlug === category.id && entry.id !== subcategoryId,
              ),
            }))}
            selected={product?.placementIds ?? []}
          />

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="conseil-taille">
              Conseil de taille <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="conseil-taille"
              name="sizeAdvice"
              className="admin-field__input"
              placeholder="Prendre votre taille habituelle."
              defaultValue={product?.sizeAdvice ?? ""}
            />
            <p className="admin-field__hint">
              Affiché sous le sélecteur : c&apos;est le renseignement qui évite
              le plus de retours.
            </p>
          </div>
        </div>
      </fieldset>

      <ProductSizesField value={sizes} onChange={setSizes} />

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
            name="description"
            rows={7}
            className="admin-field__input"
            defaultValue={product?.description.join("\n") ?? ""}
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
              name="madeIn"
              className="admin-field__input"
              placeholder="Maroc"
              defaultValue={product?.madeIn ?? ""}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="composition">
              Composition
            </label>
            <input
              id="composition"
              name="composition"
              className="admin-field__input"
              placeholder="100 % coton"
              defaultValue={product?.composition ?? ""}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="mannequin">
              Note mannequin <span className="admin-badge">facultatif</span>
            </label>
            <input
              id="mannequin"
              name="modelNote"
              className="admin-field__input"
              placeholder="Notre mannequin mesure 1 m 40 et porte une taille 10."
              defaultValue={product?.modelNote ?? ""}
            />
          </div>

          <CareField defaultValue={product?.care ?? ""} />
        </div>
      </fieldset>

      <ProductMeasurementsField
        value={measurements}
        onChange={setMeasurements}
      />

      <ProductPhotosField
        kept={kept}
        onKeptChange={setKept}
        pending={pendingImages}
        onPendingChange={setPendingImages}
        selectedId={selectedImage}
        onSelect={setSelectedImage}
      />

      {/* ---- publication ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">Publication</legend>
        <label className="admin-toggle">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? false}
          />
          <span>Publier cette fiche en boutique</span>
        </label>
        <p className="admin-field__hint">
          Décochée, la fiche reste un brouillon : visible ici, introuvable sur
          le site.
        </p>
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer le produit"}
        </button>
        <Link
          href="/admin/produits"
          className="admin-button admin-button--ghost"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

/**
 * Conseil d'entretien.
 *
 * Il garde un état, à la différence des autres champs de texte : le sélecteur
 * de consignes écrit dedans, et un champ non contrôlé ne saurait pas se
 * mettre à jour depuis un bouton voisin.
 */
function CareField({ defaultValue }: { defaultValue: string }) {
  const [care, setCare] = useState(defaultValue);

  return (
    <div className="admin-field admin-field--full">
      <div className="admin-field__head">
        <label className="admin-field__label" htmlFor="entretien">
          Conseil d&apos;entretien
        </label>
        <CarePicker value={care} onChange={setCare} />
      </div>
      <textarea
        id="entretien"
        name="care"
        rows={4}
        className="admin-field__input"
        value={care}
        onChange={(event) => setCare(event.target.value)}
        placeholder={
          "Une consigne par ligne :\nLavage sur cycle délicat en machine à 30°.\nNe pas sécher en machine.\nRepassage doux sur l'envers."
        }
      />
    </div>
  );
}
