"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { savePromo, type PromoFormState } from "@/app/admin/(back-office)/codes-promo/actions";
import { formatPrice } from "@/lib/format";
import { promoAnnouncement } from "@/lib/promo/announcement";

/** Un produit proposé au choix des produits visés. */
export type PromoProductOption = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  priceCents: number;
  /** Prix barré en vigueur : la remise ne s'y appliquera pas. */
  onSale: boolean;
  published: boolean;
};

/** Ce que le formulaire sait déjà en modification. */
export type PromoFormValues = {
  id: string;
  code: string;
  kind: "percent" | "amount";
  value: number;
  scope: "site" | "products";
  productIds: string[];
  /** `AAAA-MM-JJ`, heure de Paris ; vide sans date de fin. */
  endsOn: string;
  maxUses: number | null;
  minSubtotalCents: number | null;
  oncePerCustomer: boolean;
  active: boolean;
  announce: boolean;
  announcement: string | null;
};

/** Centimes → « 10,50 », la forme que le champ attend et que le serveur relit. */
function euros(cents: number | null): string {
  return cents === null ? "" : (cents / 100).toFixed(2).replace(".", ",");
}

/**
 * Création et modification d'un code promo.
 *
 * Comme la fiche produit, ce formulaire n'est qu'un confort de saisie : c'est
 * la Server Action qui valide (`promoInputSchema`). Les produits visés
 * voyagent en JSON dans un champ caché.
 */
export function PromoForm({
  products,
  promo,
}: {
  products: PromoProductOption[];
  promo?: PromoFormValues;
}) {
  const [state, action, pending] = useActionState<PromoFormState, FormData>(savePromo, {});

  const [code, setCode] = useState(promo?.code ?? "");
  const [kind, setKind] = useState<"percent" | "amount">(promo?.kind ?? "percent");
  const [value, setValue] = useState(
    promo ? (promo.kind === "percent" ? String(promo.value) : euros(promo.value)) : "",
  );
  const [scope, setScope] = useState<"site" | "products">(promo?.scope ?? "site");
  const [selected, setSelected] = useState<Set<string>>(new Set(promo?.productIds ?? []));
  const [search, setSearch] = useState("");
  const [announce, setAnnounce] = useState(promo?.announce ?? false);
  const [announcement, setAnnouncement] = useState(promo?.announcement ?? "");

  const query = search.trim().toLowerCase();
  const shown = products.filter(
    (product) =>
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query),
  );

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Aperçu du message de la bande, tel qu'il sera composé à partir du code.
  const previewValue =
    kind === "percent"
      ? Number(value) || 0
      : Math.round(Number(value.replace(",", ".")) * 100) || 0;
  const preview = promoAnnouncement({
    code: code.trim().toUpperCase() || "CODE",
    kind,
    value: previewValue,
    announcement: announcement || null,
  });

  return (
    <form
      className="admin-form admin-form--wide"
      action={(formData) => {
        formData.set("productIds", JSON.stringify([...selected]));
        action(formData);
      }}
    >
      {promo && <input type="hidden" name="promoId" value={promo.id} />}

      {state.errors && state.errors.length > 0 && (
        <div role="alert" className="admin-form__error">
          <p>Le code n&apos;a pas été enregistré.</p>
          <ul>
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- le code et la remise ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Code et remise <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="promo-code">
              Code
            </label>
            <input
              id="promo-code"
              name="code"
              required
              autoComplete="off"
              className="admin-field__input admin-promo__code"
              placeholder="BLACK20"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
            <p className="admin-field__hint">
              Lettres, chiffres et tirets. La cliente peut le taper en minuscules.
            </p>
          </div>

          <div className="admin-field">
            <span className="admin-field__label">Type de remise</span>
            <div className="admin-promo__choices">
              <label className="admin-toggle">
                <input
                  type="radio"
                  name="kind"
                  value="percent"
                  checked={kind === "percent"}
                  onChange={() => setKind("percent")}
                />
                <span>Pourcentage</span>
              </label>
              <label className="admin-toggle">
                <input
                  type="radio"
                  name="kind"
                  value="amount"
                  checked={kind === "amount"}
                  onChange={() => setKind("amount")}
                />
                <span>Montant</span>
              </label>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="promo-value">
              {kind === "percent" ? "Remise (%)" : "Remise (€)"}
            </label>
            <input
              id="promo-value"
              name="value"
              required
              inputMode={kind === "percent" ? "numeric" : "decimal"}
              className="admin-field__input"
              placeholder={kind === "percent" ? "20" : "10,00"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
        </div>
      </fieldset>

      {/* ---- portée ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Sur quoi <span className="admin-badge admin-badge--required">obligatoire</span>
        </legend>

        <div className="admin-promo__choices">
          <label className="admin-toggle">
            <input
              type="radio"
              name="scope"
              value="site"
              checked={scope === "site"}
              onChange={() => setScope("site")}
            />
            <span>Tout le site</span>
          </label>
          <label className="admin-toggle">
            <input
              type="radio"
              name="scope"
              value="products"
              checked={scope === "products"}
              onChange={() => setScope("products")}
            />
            <span>Certains produits</span>
          </label>
        </div>
        <p className="admin-field__hint">
          Les articles déjà soldés (prix barré) ne profitent jamais du code.
        </p>

        {scope === "products" && (
          <div className="admin-promo__picker">
            <div className="admin-promo__picker-head">
              <input
                type="search"
                className="admin-field__input"
                aria-label="Rechercher un produit"
                placeholder="Rechercher un produit ou une marque"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <span className="admin-field__label">
                {selected.size} produit{selected.size > 1 ? "s" : ""} choisi
                {selected.size > 1 ? "s" : ""}
              </span>
            </div>

            <ul className="admin-promo__products">
              {shown.map((product) => (
                <li key={product.id}>
                  <label
                    className="admin-promo__product"
                    data-selected={selected.has(product.id) ? "true" : undefined}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggle(product.id)}
                    />
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        width={44}
                        height={58}
                        className="admin-row__image"
                      />
                    ) : (
                      <span className="admin-row__image admin-row__image--empty" aria-hidden />
                    )}
                    <span className="admin-promo__product-text">
                      <span className="admin-thumb__name">{product.name}</span>
                      <span className="admin-thumb__size">
                        {product.brand} · {formatPrice(product.priceCents)}
                        {product.onSale && " · soldé, non concerné"}
                        {!product.published && " · brouillon"}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
              {shown.length === 0 && (
                <li className="admin-field__hint">Aucun produit ne correspond à « {search} ».</li>
              )}
            </ul>
          </div>
        )}
      </fieldset>

      {/* ---- limites ---- */}
      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">
          Limites <span className="admin-badge">facultatif</span>
        </legend>

        <div className="admin-grid">
          <div className="admin-field">
            <label className="admin-field__label" htmlFor="promo-fin">
              Valable jusqu&apos;au
            </label>
            <input
              id="promo-fin"
              name="endsOn"
              type="date"
              className="admin-field__input"
              defaultValue={promo?.endsOn ?? ""}
            />
            <p className="admin-field__hint">Inclus, jusqu&apos;à minuit heure de Paris.</p>
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="promo-max">
              Nombre d&apos;utilisations
            </label>
            <input
              id="promo-max"
              name="maxUses"
              inputMode="numeric"
              className="admin-field__input"
              placeholder="Illimité"
              defaultValue={promo?.maxUses ?? ""}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label" htmlFor="promo-min">
              Montant minimum d&apos;achat (€)
            </label>
            <input
              id="promo-min"
              name="minSubtotal"
              inputMode="decimal"
              className="admin-field__input"
              placeholder="Aucun"
              defaultValue={euros(promo?.minSubtotalCents ?? null)}
            />
          </div>
        </div>

        <label className="admin-toggle">
          <input
            type="checkbox"
            name="oncePerCustomer"
            defaultChecked={promo?.oncePerCustomer ?? false}
          />
          <span>
            Une seule fois par cliente — reconnue à son compte, son e-mail, son téléphone ou son
            adresse de livraison
          </span>
        </label>
      </fieldset>

      {/* ---- bande noire ---- */}
      {scope === "site" && (
        <fieldset className="admin-fieldset">
          <legend className="admin-fieldset__legend">Bande noire du site</legend>
          <label className="admin-toggle">
            <input
              type="checkbox"
              name="announce"
              checked={announce}
              onChange={(event) => setAnnounce(event.target.checked)}
            />
            <span>Annoncer ce code dans la bande noire, à la place du message habituel</span>
          </label>

          {announce && (
            <>
              <div className="admin-field">
                <label className="admin-field__label" htmlFor="promo-message">
                  Message <span className="admin-badge">facultatif</span>
                </label>
                <input
                  id="promo-message"
                  name="announcement"
                  maxLength={160}
                  className="admin-field__input"
                  placeholder={promoAnnouncement({
                    code: code.trim().toUpperCase() || "CODE",
                    kind,
                    value: previewValue,
                    announcement: null,
                  })}
                  value={announcement}
                  onChange={(event) => setAnnouncement(event.target.value)}
                />
                <p className="admin-field__hint">
                  Vide, le message est composé à partir du code. Pensez à y laisser le code.
                </p>
              </div>
              <p className="admin-promo__preview" aria-label="Aperçu de la bande noire">
                {preview}
              </p>
              <p className="admin-field__hint">
                Le message habituel revient tout seul quand le code expire, est épuisé ou
                désactivé.
              </p>
            </>
          )}
        </fieldset>
      )}

      <fieldset className="admin-fieldset">
        <legend className="admin-fieldset__legend">État</legend>
        <label className="admin-toggle">
          <input type="checkbox" name="active" defaultChecked={promo?.active ?? true} />
          <span>Code actif</span>
        </label>
      </fieldset>

      <div className="admin-form__actions">
        <button type="submit" className="admin-button" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer le code"}
        </button>
        <Link href="/admin/codes-promo" className="admin-button admin-button--ghost">
          Annuler
        </Link>
      </div>
    </form>
  );
}
