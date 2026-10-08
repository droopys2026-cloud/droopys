"use client";

import { useEffect, useRef } from "react";
import { z } from "zod";

/**
 * Mini-carte des points relais, intégrée à l'étape de livraison.
 *
 * C'est la carte de Sendcloud, chargée dans une `iframe` à la place du
 * plein écran que propose son script : même page, même données, mais la
 * cliente choisit son relais sans quitter le formulaire. Le protocole est
 * celui du script officiel (`embed.sendcloud.sc/spp/1.0.0/api.min.js`) :
 * l'adresse `/embed/v3/service-point-picker/` et ses paramètres, puis un
 * message `servicePointSelected` envoyé par la carte au choix d'un point.
 */

const ORIGIN = "https://servicepoints.sendcloud.sc";

/** Le message de la carte est une donnée externe : on le valide. */
const messageSchema = z.object({
  type: z.literal("servicePointSelected"),
  point: z.object({
    id: z.number(),
    name: z.string(),
    street: z.string(),
    house_number: z.string().nullish(),
    postal_code: z.string(),
    city: z.string(),
    carrier: z.string(),
  }),
});

export type PickedServicePoint = z.infer<typeof messageSchema>["point"];

/** Une ligne lisible pour rappeler le point choisi. */
export function servicePointLabel(point: PickedServicePoint): string {
  const street = [point.house_number, point.street].filter(Boolean).join(" ");
  return `${point.name} — ${street}, ${point.postal_code} ${point.city}`;
}

export function ServicePointMap({
  apiKey,
  carrier,
  postalCode,
  currentId,
  onSelect,
}: {
  apiKey: string;
  carrier: string;
  /** Centre de la carte au départ ; la cliente peut chercher ailleurs. */
  postalCode: string;
  currentId?: number;
  onSelect: (point: PickedServicePoint) => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  // Le dernier `onSelect` sans réabonner l'écouteur à chaque rendu.
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Seuls les messages de *cette* carte, venus de Sendcloud, comptent :
      // n'importe quelle page peut poster un message à la nôtre.
      if (event.origin !== ORIGIN || event.source !== frameRef.current?.contentWindow) {
        return;
      }
      const parsed = messageSchema.safeParse(event.data);
      if (parsed.success) onSelectRef.current(parsed.data.point);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const params = new URLSearchParams({
    "api-key": apiKey,
    country: "FR",
    "postal-code": postalCode,
    carrier,
    id: currentId ? String(currentId) : "",
    language: "fr-fr",
    // Intégrée dans la page, la carte n'a pas à se fermer.
    "close-button": "0",
    "ignore-integration-settings": "false",
  });

  return (
    <iframe
      ref={frameRef}
      // La clé force une carte neuve quand le transporteur change : la carte
      // de Sendcloud ne relit pas ses paramètres après chargement.
      key={carrier}
      src={`${ORIGIN}/embed/v3/service-point-picker/?${params}`}
      title="Carte des points relais"
      className="checkout-map"
      loading="lazy"
    />
  );
}
