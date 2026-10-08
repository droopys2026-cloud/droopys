import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import type { SendcloudMethod } from "@/lib/shipping/services";

/**
 * Appels à l'API Sendcloud, côté serveur uniquement : la clé secrète ne quitte
 * jamais le serveur. Les réponses passent par un schéma Zod — c'est une donnée
 * externe comme une autre.
 */

const PANEL = "https://panel.sendcloud.sc/api/v2";
export const PANEL_V3 = "https://panel.sendcloud.sc/api/v3";
const SERVICE_POINTS = "https://servicepoints.sendcloud.sc/api/v2";

export class SendcloudUnavailable extends Error {}

function authHeader(): string {
  const { SENDCLOUD_PUBLIC_KEY: user, SENDCLOUD_SECRET_KEY: secret } = serverEnv;
  if (!user || !secret) {
    throw new SendcloudUnavailable("SENDCLOUD_PUBLIC_KEY ou SENDCLOUD_SECRET_KEY absente.");
  }
  return `Basic ${Buffer.from(`${user}:${secret}`).toString("base64")}`;
}

async function sendcloudGet(url: string): Promise<unknown> {
  const response = await sendcloudFetch(url, { headers: { Accept: "application/json" } });
  return response.json();
}

/**
 * Appel authentifié à Sendcloud. Lève `SendcloudUnavailable` avec le statut
 * et, quand Sendcloud en donne, son message d'erreur — c'est lui qui dit
 * qu'une adresse est incomplète ou qu'un service ne dessert pas ce pays.
 */
export async function sendcloudFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { Authorization: authHeader(), ...init.headers },
    // Le cache est géré par `unstable_cache` autour, pas par `fetch`.
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new SendcloudUnavailable(
      `Sendcloud a répondu ${response.status} pour ${new URL(url).pathname}${detail ? ` : ${detail.slice(0, 400)}` : ""}`,
    );
  }
  return response;
}

const methodsSchema = z.object({
  shipping_methods: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      carrier: z.string(),
      min_weight: z.string(),
      max_weight: z.string(),
      countries: z.array(z.object({ iso_2: z.string(), price: z.number() })),
    }),
  ),
});

/**
 * Méthodes d'envoi vers un pays, au départ de la boutique. Mises en cache six
 * heures : les tarifs ne bougent pas d'une heure à l'autre, et le tunnel ne
 * doit pas attendre Sendcloud à chaque affichage.
 */
export const listShippingMethods = unstable_cache(
  async (country: string): Promise<SendcloudMethod[]> => {
    const data = methodsSchema.parse(
      await sendcloudGet(`${PANEL}/shipping_methods?to_country=${encodeURIComponent(country)}&from_postal_code=13015`),
    );
    return data.shipping_methods;
  },
  ["sendcloud-methodes"],
  { revalidate: 60 * 60 * 6, tags: ["sendcloud"] },
);

const servicePointSchema = z.object({
  id: z.number(),
  name: z.string(),
  street: z.string(),
  house_number: z.string().nullish(),
  postal_code: z.string(),
  city: z.string(),
  country: z.string(),
  carrier: z.string(),
  is_active: z.boolean(),
});

export type ServicePoint = z.infer<typeof servicePointSchema>;

/**
 * Relit un point relais chez Sendcloud. Le tunnel ne croit pas l'adresse que
 * lui envoie le navigateur : seul l'identifiant fait foi, le reste vient d'ici.
 * (La barre finale de l'URL est exigée par Sendcloud : sans elle, il rend 400.)
 */
export async function getServicePoint(id: number): Promise<ServicePoint> {
  return servicePointSchema.parse(await sendcloudGet(`${SERVICE_POINTS}/service-points/${id}/`));
}
