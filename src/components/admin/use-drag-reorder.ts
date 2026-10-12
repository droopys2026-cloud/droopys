"use client";

import { useId, useState, type DragEvent } from "react";

/**
 * Déplace l'élément de `from` vers `to`, les autres se décalant d'un rang.
 * Rend la liste telle quelle si l'un des rangs sort du tableau.
 */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Glisser-déposer natif pour réordonner une liste de vignettes.
 *
 * Le glisser-déposer HTML suffit ici : une liste courte, à la souris, dans
 * l'admin. Il n'existe pas au clavier ni au doigt — les flèches ↑ ↓ restent
 * donc à côté, et ce sont elles qui portent l'accessibilité.
 *
 * Un type de données propre à chaque liste marque nos glissements : une photo
 * lâchée depuis le Finder ne doit rien réordonner (elle continue jusqu'à la
 * zone de dépôt des fichiers), et une vignette des photos en ligne lâchée sur
 * les photos à envoyer non plus — les deux listes sont enregistrées à part.
 */
export function useDragReorder(onMove: (from: number, to: number) => void) {
  // Le navigateur met les types en minuscules : l'identifiant est normalisé.
  const listId = useId().replace(/[^a-z0-9]/gi, "").toLowerCase();
  const dragType = `application/x-droopys-vignette-${listId}`;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const isOurs = (event: DragEvent) => event.dataTransfer.types.includes(dragType);

  const reset = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (index: number) => ({
    draggable: true,
    "data-dragging": dragIndex === index ? "true" : undefined,
    "data-drop-target": overIndex === index && dragIndex !== index ? "true" : undefined,
    onDragStart: (event: DragEvent) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(dragType, String(index));
      setDragIndex(index);
    },
    onDragOver: (event: DragEvent) => {
      if (!isOurs(event)) return;
      // Sans `preventDefault`, le navigateur refuse le dépôt.
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (overIndex !== index) setOverIndex(index);
    },
    onDrop: (event: DragEvent) => {
      if (!isOurs(event)) return;
      event.preventDefault();
      const from = Number(event.dataTransfer.getData(dragType));
      reset();
      onMove(from, index);
    },
    onDragEnd: reset,
  });
}
