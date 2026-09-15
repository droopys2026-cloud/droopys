import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = { title: "Nouvelle marque | Admin Droopys" };

/**
 * Formulaire de création. Les champs existent, mais rien n'est encore
 * enregistré : l'action serveur se branchera ici quand la base sera en place.
 */
export default function AdminNouvelleMarquePage() {
  return (
    <div className="admin-page">
      <Link href="/admin/marques" className="admin-back">
        <span aria-hidden>←</span> Retour aux marques
      </Link>

      <AdminPageHeader
        title="Nouvelle marque"
        action={
          <Link
            href="/admin/marques"
            className="admin-button admin-button--ghost"
          >
            Annuler
          </Link>
        }
      />

      <form className="admin-form">
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="nom">
            Nom de la marque
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            className="admin-field__input"
            placeholder="Stone Island"
          />
        </div>
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="slug">
            Adresse de la page
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            className="admin-field__input"
            placeholder="stone-island"
          />
        </div>
        <div className="admin-field">
          <label className="admin-field__label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            className="admin-field__input"
            placeholder="Quelques lignes affichées sur la page de la marque."
          />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-button" disabled>
            Enregistrer
          </button>
          <p className="admin-form__note">
            L&apos;enregistrement sera actif une fois la base de données
            connectée.
          </p>
        </div>
      </form>
    </div>
  );
}
