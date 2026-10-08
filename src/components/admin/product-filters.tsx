import Link from "next/link";
import { IconSearch } from "@/components/admin/admin-icons";
import type { AdminProductFilters } from "@/lib/queries/admin-catalog";

/**
 * Tri du catalogue.
 *
 * Les filtres vivent dans l'URL et non dans un état React : la liste qu'on
 * regarde se partage, se met en favori, et revient intacte avec le bouton
 * « Précédent ». C'est aussi ce qui permet de la rendre côté serveur, donc de
 * trier en base plutôt que de charger tout le catalogue pour le filtrer dans
 * le navigateur.
 *
 * Trois familles indépendantes : on cherche « les Moncler du rayon garçon »
 * aussi souvent que « tous les brouillons ».
 */
type Option = { id: string; label: string };

function href(filters: AdminProductFilters, patch: AdminProductFilters): string {
  const next = { ...filters, ...patch };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `/admin/produits?${query}` : "/admin/produits";
}

function FilterRow({
  label,
  name,
  options,
  filters,
}: {
  label: string;
  name: keyof AdminProductFilters;
  options: Option[];
  filters: AdminProductFilters;
}) {
  const current = filters[name];

  return (
    <div className="admin-filter">
      <span className="admin-filter__label">{label}</span>
      <div className="admin-filter__chips">
        <Link
          href={href(filters, { [name]: undefined })}
          className="admin-chip"
          aria-current={!current ? "true" : undefined}
        >
          Tous
        </Link>
        {options.map((option) => {
          const chosen = current === option.id;
          return (
            <Link
              key={option.id}
              // Recliquer sur un filtre actif le retire : c'est le geste
              // qu'on fait spontanément, autant qu'il fasse quelque chose.
              href={href(filters, { [name]: chosen ? undefined : option.id })}
              className="admin-chip"
              aria-current={chosen ? "true" : undefined}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ProductFilters({
  filters,
  brands,
  categories,
}: {
  filters: AdminProductFilters;
  brands: Option[];
  categories: Option[];
}) {
  const active = [filters.brand, filters.category, filters.etat].filter(
    Boolean,
  ).length;
  // La recherche compte comme un tri : elle change ce qu'on voit, donc elle
  // est effacée par le même bouton que les filtres.
  const narrowed = active > 0 || Boolean(filters.q);

  return (
    <div className="admin-filters">
      {/* Formulaire en GET vers sa propre page : la requête part dans l'URL,
          sans routeur ni état client. Les filtres en cours sont conservés en
          champs cachés — chercher ne doit pas remettre le tri à zéro. */}
      <form action="/admin/produits" method="get" role="search">
        {filters.brand && (
          <input type="hidden" name="brand" value={filters.brand} />
        )}
        {filters.category && (
          <input type="hidden" name="category" value={filters.category} />
        )}
        {filters.etat && (
          <input type="hidden" name="etat" value={filters.etat} />
        )}

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
            name="q"
            type="search"
            className="admin-field__input admin-search__input"
            placeholder="Rechercher par nom, marque ou référence…"
            defaultValue={filters.q ?? ""}
          />
        </div>
      </form>

      <FilterRow
        label="Marque"
        name="brand"
        options={brands}
        filters={filters}
      />
      <FilterRow
        label="Rayon"
        name="category"
        options={categories}
        filters={filters}
      />
      <FilterRow
        label="État"
        name="etat"
        options={[
          { id: "publie", label: "Publiés" },
          { id: "brouillon", label: "Brouillons" },
        ]}
        filters={filters}
      />

      {narrowed && (
        <Link
          href="/admin/produits"
          className="admin-button admin-button--ghost admin-button--small"
        >
          Effacer le tri ({active + (filters.q ? 1 : 0)})
        </Link>
      )}
    </div>
  );
}
