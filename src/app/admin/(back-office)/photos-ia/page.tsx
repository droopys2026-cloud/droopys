import type { Metadata } from "next";
import Image from "next/image";
import { deleteGeneratedPhoto } from "@/app/admin/(back-office)/photos-ia/actions";
import { AdminEmpty } from "@/components/admin/admin-empty";
import { IconTrash } from "@/components/admin/admin-icons";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { requireAdmin } from "@/lib/auth";
import { SHOT_LABELS, type GenerationMode } from "@/lib/photo-prompts";
import { listGeneratedPhotos } from "@/lib/photos/library";

export const metadata: Metadata = { title: "Photos IA | Admin Droopy's" };

/**
 * Toutes les photos générées par l'IA, les plus récentes d'abord.
 *
 * Chacune y est gardée dès sa création, qu'elle ait servi ou non : on la
 * retrouve, on la télécharge pour Instagram ou pour une autre fiche, ou on la
 * supprime.
 */
export default async function AdminGeneratedPhotosPage() {
  await requireAdmin();
  const photos = await listGeneratedPhotos();

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Photos IA"
        lead="Toutes les photos générées depuis les fiches produit, gardées même si la fiche n'a pas été enregistrée."
      />

      {photos.length === 0 ? (
        <AdminEmpty
          title="Aucune photo générée"
          text="Les photos créées avec « Générer les photos avec l'IA », dans une fiche produit, apparaîtront ici."
        />
      ) : (
        <ul className="admin-gallery">
          {photos.map((photo) => {
            const label = shotLabel(photo.shot);
            const title = [photo.brand, photo.productName].filter(Boolean).join(" — ") || "Sans nom";
            return (
              <li key={photo.id} className="admin-gallery__item">
                <Image
                  src={photo.url}
                  alt={`${title}, ${label}`}
                  width={400}
                  height={600}
                  sizes="(min-width: 1200px) 240px, 45vw"
                  className="admin-gallery__image"
                />
                <div className="admin-gallery__meta">
                  <p className="admin-gallery__title">{title}</p>
                  <p className="admin-gallery__info">
                    {label} ·{" "}
                    {photo.createdAt.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      timeZone: "Europe/Paris",
                    })}
                  </p>
                </div>
                <div className="admin-gallery__actions">
                  {/* `?download=` : le stockage renvoie alors le fichier en
                      pièce jointe. L'attribut `download` seul ne suffit pas,
                      le fichier étant servi depuis un autre domaine. */}
                  <a
                    href={`${photo.url}?download=${encodeURIComponent(fileName(title, label, photo.url))}`}
                    className="admin-button admin-button--small"
                  >
                    Télécharger
                  </a>
                  <form action={deleteGeneratedPhoto}>
                    <input type="hidden" name="photoId" value={photo.id} />
                    <button
                      type="submit"
                      className="admin-row__delete"
                      aria-label={`Supprimer la photo ${label} de ${title}`}
                      title="Supprimer définitivement"
                    >
                      <IconTrash />
                    </button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function shotLabel(shot: string): string {
  return isShot(shot) ? SHOT_LABELS[shot] : shot;
}

function isShot(value: string): value is GenerationMode {
  return Object.hasOwn(SHOT_LABELS, value);
}

/** « moncler-doudoune-maya-porte-de-face.jpg » plutôt qu'un identifiant. */
function fileName(title: string, label: string, url: string): string {
  const extension = url.split(".").pop() ?? "jpg";
  const base = `${title} ${label}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "photo-ia"}.${extension}`;
}
