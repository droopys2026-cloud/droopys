import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { IconSearch } from "@/components/ui/icons";
import type { Product } from "@/types/product";

/** Quelques entrées pour qui arrive sur la page sans savoir quoi taper. */
const SUGGESTIONS = ["Doudoune", "Manteau", "Pull", "Baskets", "Bonnet"];

/**
 * Corps de la page de recherche : le champ, puis les résultats.
 *
 * Le formulaire est en `GET` vers sa propre page — pas d'état client, pas de
 * `useState` : la requête vit dans l'URL, donc elle se partage, se met en
 * favori et revient intacte avec le bouton « Précédent ».
 */
export function SearchPanel({
  query,
  results,
}: {
  query: string;
  results: Product[];
}) {
  return (
    <section className="container-page py-14">
      <form action="/recherche" method="get" role="search" className="mb-13">
        <label className="content-field__label" htmlFor="recherche-q">
          Rechercher un article
        </label>
        <div className="mt-2 flex items-center gap-4">
          <input
            id="recherche-q"
            name="q"
            type="search"
            defaultValue={query}
            autoComplete="off"
            placeholder="Doudoune, manteau, C.P. Company…"
            className="content-field__input flex-1"
          />
          <button
            type="submit"
            className="icon-button-default"
            aria-label="Lancer la recherche"
          >
            <IconSearch />
          </button>
        </div>
      </form>

      {query === "" ? (
        <div>
          <p className="text-paragraph">Essayez par exemple :</p>
          <ul className="flex flex-wrap gap-4">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <Link
                  href={`/recherche?q=${encodeURIComponent(suggestion)}`}
                  className="link-underline-sm"
                >
                  {suggestion}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-9 py-17 text-center">
          <p className="text-paragraph m-0">
            Aucun article ne correspond à « {query} ».
          </p>
          <Link href="/" className="link-cta-block">
            Retour à l&apos;accueil
          </Link>
        </div>
      ) : (
        <>
          {/* Le nombre est annoncé aux lecteurs d'écran : sans lui, une
              nouvelle recherche ne change rien d'audible. */}
          <p className="text-caption-muted" aria-live="polite">
            {results.length} article{results.length > 1 ? "s" : ""} pour «{" "}
            {query} »
          </p>
          <ul className="grid grid-cols-2 gap-x-11 gap-y-13 lg:grid-cols-4">
            {results.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
