"use client";

import { useState } from "react";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconSearch } from "@/components/admin/admin-icons";
import { BRANDS } from "@/lib/brands";
import { CATEGORIES } from "@/lib/categories";
import { PHOTO_GARMENTS } from "@/lib/photo-prompts";

/**
 * Tri du catalogue.
 *
 * Trois familles de filtres, chacune indépendante : on cherche « les Moncler
 * du rayon garçon » aussi souvent que « toutes les chaussures ». Les filtres
 * s'ajoutent, ils ne se remplacent pas.
 *
 * `null` signifie « tous » : c'est l'état de départ de chaque famille.
 */
type Filters = {
  brand: string | null;
  category: string | null;
  garment: string | null;
};

const EMPTY: Filters = { brand: null, category: null, garment: null };

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  return (
    <div className="admin-filter">
      <span className="admin-filter__label">{label}</span>
      <div className="admin-filter__chips">
        <button
          type="button"
          className="admin-chip"
          aria-pressed={value === null}
          onClick={() => onChange(null)}
        >
          Tous
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="admin-chip"
            aria-pressed={value === option.id}
            onClick={() => onChange(value === option.id ? null : option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductFilters() {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [search, setSearch] = useState("");
  const query = search.trim();
  const active = Object.values(filters).filter(Boolean).length;
  // La recherche compte comme un tri : elle change ce qu'on voit, donc elle
  // doit être effacée par le même bouton que les filtres.
  const narrowed = active > 0 || query.length > 0;

  return (
    <div className="admin-filters">
      <div className="admin-search">
        <label className="sr-only" htmlFor="recherche-produit">
          Rechercher un produit
        </label>
        {/* La loupe est posée dans le champ : elle indique la fonction sans
            prendre une colonne à elle. */}
        <span className="admin-search__icon" aria-hidden>
          <IconSearch />
        </span>
        <input
          id="recherche-produit"
          type="search"
          className="admin-field__input admin-search__input"
          placeholder="Rechercher par nom, marque ou référence…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {query.length > 0 && (
          <button
            type="button"
            className="admin-thumb__icon"
            aria-label="Effacer la recherche"
            onClick={() => setSearch("")}
          >
            ×
          </button>
        )}
      </div>

      <FilterRow
        label="Marque"
        value={filters.brand}
        onChange={(brand) => setFilters({ ...filters, brand })}
        options={BRANDS.map((brand) => ({ id: brand.slug, label: brand.name }))}
      />

      <FilterRow
        label="Rayon"
        value={filters.category}
        onChange={(category) => setFilters({ ...filters, category })}
        options={CATEGORIES.map((category) => ({
          id: category.slug,
          label: category.title,
        }))}
      />

      <FilterRow
        label="Type"
        value={filters.garment}
        onChange={(garment) => setFilters({ ...filters, garment })}
        options={Object.entries(PHOTO_GARMENTS).map(([id, entry]) => ({
          id,
          label: entry.label,
        }))}
      />

      {narrowed && (
        <button
          type="button"
          className="admin-button admin-button--ghost admin-button--small"
          onClick={() => {
            setFilters(EMPTY);
            setSearch("");
          }}
        >
          Effacer le tri ({active + (query ? 1 : 0)})
        </button>
      )}

      {/* Le catalogue est vide : on le dit, et on distingue « rien en
          boutique » de « rien qui corresponde au tri ». */}
      <AdminEmpty
        title={
          query
            ? `Aucun résultat pour « ${query} »`
            : narrowed
              ? "Aucun produit ne correspond à ce tri"
              : "Aucun produit enregistré"
        }
        text={
          narrowed
            ? "Élargissez le tri, ou ajoutez un produit dans ce rayon."
            : "Ajoutez un premier produit pour le voir apparaître ici."
        }
      />
    </div>
  );
}
