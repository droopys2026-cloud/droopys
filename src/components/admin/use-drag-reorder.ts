"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

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

/** Au-delà de ce déplacement, un appui devient un glissement et non un clic. */
const DRAG_THRESHOLD_PX = 6;
/**
 * Au doigt, un glissement immédiat empêcherait de faire défiler la page dès
 * qu'on pose le pouce sur une photo : il faut un appui long, comme pour
 * réordonner les icônes d'un téléphone.
 */
const LONG_PRESS_MS = 300;

type Drag = { from: number; over: number };

/**
 * Glisser-déposer pour réordonner une liste de vignettes, à la souris comme
 * au doigt.
 *
 * Écrit sur les événements de pointeur plutôt que sur le glisser-déposer
 * HTML : ce dernier ne marche pas au doigt sur la plupart des téléphones, et
 * la boutique met ses fiches à jour depuis le sien.
 *
 * Au clavier : Alt + flèche déplace la vignette qui a le focus.
 *
 * Usage : `listProps` sur la liste, `itemProps(index)` sur chaque vignette.
 * Un appui sans glissement reste un clic ordinaire ; un clic qui termine un
 * glissement est avalé, pour ne pas sélectionner la photo qu'on vient de
 * déposer.
 */
export function useDragReorder(onMove: (from: number, to: number) => void) {
  const listId = useId();
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const press = useRef<{
    index: number;
    x: number;
    y: number;
    pointerId: number;
    timer?: ReturnType<typeof setTimeout>;
  } | null>(null);
  const swallowClick = useRef(false);

  const update = (next: Drag | null) => {
    dragRef.current = next;
    setDrag(next);
  };

  // Pendant un glissement au doigt, le navigateur voudrait faire défiler la
  // page : on l'en empêche, le temps du glissement seulement. L'écouteur doit
  // être non passif pour pouvoir annuler, ce que React ne permet pas.
  useEffect(() => {
    const block = (event: TouchEvent) => {
      if (dragRef.current) event.preventDefault();
    };
    document.addEventListener("touchmove", block, { passive: false });
    return () => document.removeEventListener("touchmove", block);
  }, []);

  const indexAt = (x: number, y: number): number | null => {
    const target = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>(`[data-reorder-list="${listId}"] > [data-reorder-index]`);
    return target ? Number(target.dataset.reorderIndex) : null;
  };

  const cancelPress = () => {
    if (press.current?.timer) clearTimeout(press.current.timer);
    press.current = null;
  };

  const listProps = { "data-reorder-list": listId };

  const itemProps = (index: number) => ({
    "data-reorder-index": index,
    "data-dragging": drag?.from === index ? "true" : undefined,
    "data-drop-target": drag && drag.over === index && drag.from !== index ? "true" : undefined,

    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      // Les réglages de la vignette (couleur, retirer) gardent leur geste.
      if ((event.target as HTMLElement).closest("select, input, [data-no-drag]")) return;
      const element = event.currentTarget;
      const pointerId = event.pointerId;
      press.current = { index, x: event.clientX, y: event.clientY, pointerId };
      if (event.pointerType !== "mouse") {
        press.current.timer = setTimeout(() => {
          element.setPointerCapture(pointerId);
          update({ from: index, over: index });
        }, LONG_PRESS_MS);
      }
    },

    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      const start = press.current;
      if (!start) return;
      if (!dragRef.current) {
        const moved = Math.hypot(event.clientX - start.x, event.clientY - start.y);
        if (moved < DRAG_THRESHOLD_PX) return;
        // Au doigt, bouger avant l'appui long, c'est faire défiler : on laisse.
        if (event.pointerType !== "mouse") return cancelPress();
        event.currentTarget.setPointerCapture(start.pointerId);
        update({ from: start.index, over: start.index });
      }
      const over = indexAt(event.clientX, event.clientY);
      if (over !== null && over !== dragRef.current?.over) {
        update({ from: start.index, over });
      }
    },

    onPointerUp: () => {
      const done = dragRef.current;
      cancelPress();
      if (!done) return;
      swallowClick.current = true;
      update(null);
      if (done.from !== done.over) onMove(done.from, done.over);
    },

    onPointerCancel: () => {
      cancelPress();
      update(null);
    },

    onClickCapture: (event: MouseEvent) => {
      if (!swallowClick.current) return;
      swallowClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    },

    // Un appui long au doigt ouvrirait sinon le menu « Enregistrer l'image ».
    onContextMenu: (event: MouseEvent) => {
      if (press.current || dragRef.current) event.preventDefault();
    },

    onKeyDown: (event: KeyboardEvent) => {
      if (!event.altKey) return;
      const step =
        event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : 0;
      if (step === 0) return;
      event.preventDefault();
      onMove(index, index + step);
    },
  });

  return { listProps, itemProps, dragging: drag !== null };
}
