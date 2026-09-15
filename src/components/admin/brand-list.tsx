"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconTrash } from "@/components/admin/admin-icons";
import { BRANDS, type Brand } from "@/lib/brands";

/**
 * Liste des marques distribuées, avec suppression.
 *
 * La base n'est pas branchée : la suppression ne vit que dans l'état de la
 * page, d'où la note sous la liste. Le jour où l'action serveur existe,
 * seul `remove` change.
 */
export function BrandList() {
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  // Une seule marque à la fois en attente de confirmation : supprimer une
  // marque efface une page de la boutique, ça ne se fait pas d'un clic.
  const [pending, setPending] = useState<string | null>(null);

  function remove(slug: string) {
    setBrands((current) => current.filter((brand) => brand.slug !== slug));
    setPending(null);
  }

  if (brands.length === 0) {
    return (
      <AdminEmpty
        title="Aucune marque enregistrée"
        text="Les marques ajoutées ici apparaîtront dans le menu et auront leur page."
        action={
          <Link href="/admin/marques/nouvelle" className="admin-button">
            Ajouter une marque
          </Link>
        }
      />
    );
  }

  return (
    <div className="admin-rows">
      <ul className="admin-rows__list">
        {brands.map((brand) => (
          <li key={brand.slug} className="admin-row">
            <div className="admin-row__main">
              <span className="admin-row__name">{brand.name}</span>
              <Link href={`/marques/${brand.slug}`} className="admin-row__link">
                /marques/{brand.slug}
              </Link>
            </div>

            {pending === brand.slug ? (
              <div className="admin-row__actions">
                <span className="admin-row__ask">Supprimer&nbsp;?</span>
                <button
                  type="button"
                  className="admin-button admin-button--small"
                  onClick={() => remove(brand.slug)}
                >
                  Oui, supprimer
                </button>
                <button
                  type="button"
                  className="admin-button admin-button--small admin-button--ghost"
                  onClick={() => setPending(null)}
                >
                  Annuler
                </button>
              </div>
            ) : (
              <div className="admin-row__actions">
                <Link
                  href="/admin/marques/nouvelle"
                  className="admin-button admin-button--small admin-button--ghost"
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  className="admin-row__delete"
                  aria-label={`Supprimer ${brand.name}`}
                  onClick={() => setPending(brand.slug)}
                >
                  <IconTrash />
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="admin-form__note">
        {brands.length} marque{brands.length > 1 ? "s" : ""} distribuée
        {brands.length > 1 ? "s" : ""}. Les suppressions seront définitives une
        fois la base de données connectée.
      </p>
    </div>
  );
}
