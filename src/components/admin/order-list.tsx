"use client";

import { useState } from "react";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconSearch } from "@/components/admin/admin-icons";
import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

/**
 * Liste des commandes : recherche et tri par état.
 *
 * Le tri par état est le geste quotidien — « qu'est-ce que j'expédie
 * aujourd'hui ? » — donc il est en premier, avant la recherche.
 */
export function OrderList() {
  const [status, setStatus] = useState<OrderStatus | null>("a-preparer");
  const [search, setSearch] = useState("");
  const query = search.trim();

  return (
    <div className="admin-filters">
      <div className="admin-filter">
        <span className="admin-filter__label">État</span>
        <div className="admin-filter__chips">
          <button
            type="button"
            className="admin-chip"
            aria-pressed={status === null}
            onClick={() => setStatus(null)}
          >
            Toutes
          </button>
          {ORDER_STATUSES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="admin-chip"
              aria-pressed={status === entry.id}
              onClick={() => setStatus(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-search">
        <span className="admin-search__icon" aria-hidden>
          <IconSearch />
        </span>
        <label className="sr-only" htmlFor="recherche-commande">
          Rechercher une commande
        </label>
        <input
          id="recherche-commande"
          type="search"
          className="admin-field__input admin-search__input"
          placeholder="Numéro de commande, nom ou e-mail…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <AdminEmpty
        title={
          query
            ? `Aucune commande pour « ${query} »`
            : status
              ? `Aucune commande « ${ORDER_STATUSES.find((s) => s.id === status)?.label.toLowerCase()} »`
              : "Aucune commande"
        }
        text="Les commandes s'afficheront ici dès la première vente."
      />
    </div>
  );
}
