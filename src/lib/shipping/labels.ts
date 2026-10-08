import "server-only";

import { unstable_cache } from "next/cache";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { splitAddressLines } from "@/lib/shipping/address";
import { PANEL_V3, sendcloudFetch } from "@/lib/shipping/sendcloud";
import { SERVICES, TEST_OPTION_CODE } from "@/lib/shipping/services";

/**
 * Étiquettes Sendcloud, créées depuis l'admin (API v3 « Shipments » — la
 * création de colis en v2 est fermée aux nouveaux comptes).
 *
 * En mode test (`SENDCLOUD_TEST_LABELS=1`), l'étiquette est une lettre non
 * affranchie : gratuite, jamais prise en charge. Tout le reste — adresse,
 * point relais, numéro de suivi, PDF — suit le vrai chemin.
 */

/**
 * Adresse d'expédition enregistrée dans Sendcloud (Réglages → Mes adresses).
 * On la désigne par son identifiant plutôt que de la recopier ici : la
 * boutique la corrige dans Sendcloud, l'étiquette suit.
 */
const getSenderAddressId = unstable_cache(
  async (): Promise<number> => {
    const response = await sendcloudFetch("https://panel.sendcloud.sc/api/v2/user/addresses/sender", {
      headers: { Accept: "application/json" },
    });
    const data = z
      .object({ sender_addresses: z.array(z.object({ id: z.number() })) })
      .parse(await response.json());
    const first = data.sender_addresses[0];
    if (!first) throw new Error("Aucune adresse d'expédition dans Sendcloud (Réglages → Mes adresses).");
    return first.id;
  },
  ["sendcloud-expediteur"],
  { revalidate: 60 * 60 * 24, tags: ["sendcloud"] },
);

export type LabelOrder = {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  deliveryMethod: "domicile" | "relais" | "retrait";
  shippingService: string | null;
  servicePointId: number | null;
  shippingAddress: string[];
  totalCents: number;
  weightGrams: number;
};

export type CreatedLabel = {
  parcelId: number;
  trackingNumber: string | null;
  trackingUrl: string | null;
  isTest: boolean;
};

const responseSchema = z.object({
  data: z.object({
    parcels: z
      .array(
        z.object({
          id: z.number(),
          tracking_number: z.string().nullish(),
          tracking_url: z.string().nullish(),
        }),
      )
      .min(1),
  }),
});

/** Le numéro au format international que demandent les transporteurs. */
function internationalPhone(phone: string | null): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("0") ? `+33${digits.slice(1)}` : digits;
}

export async function createLabel(order: LabelOrder): Promise<CreatedLabel> {
  if (order.deliveryMethod === "retrait") {
    throw new Error("Un retrait en boutique n'a pas d'étiquette.");
  }
  const service = SERVICES.find((entry) => entry.key === order.shippingService);
  if (!service) throw new Error(`Service de livraison inconnu : ${order.shippingService ?? "aucun"}.`);

  const address = splitAddressLines(order.shippingAddress);
  if (!address) throw new Error("Adresse de livraison illisible : complétez-la avant de créer l'étiquette.");

  const isTest = serverEnv.SENDCLOUD_TEST_LABELS === "1";
  const relay = order.deliveryMethod === "relais";

  const body = {
    from_address: { sender_address_id: await getSenderAddressId() },
    // En relais, l'adresse est celle du point (relue chez Sendcloud au
    // paiement : « nom du point, rue, CP ville, pays »), au nom de la cliente
    // — c'est elle qui viendra le chercher. Le nom du point va en société.
    to_address: {
      name: order.customerName,
      ...(relay && address.line2
        ? { company_name: address.line1, address_line_1: address.line2 }
        : {
            address_line_1: address.line1,
            ...(address.line2 ? { address_line_2: address.line2 } : {}),
          }),
      postal_code: address.postalCode,
      city: address.city,
      country_code: address.countryCode,
      email: order.customerEmail,
      phone_number: internationalPhone(order.customerPhone),
    },
    // Le point relais ne voyage pas en mode test : la lettre non affranchie
    // ne le connaît pas.
    ...(relay && order.servicePointId && !isTest
      ? { to_service_point: { id: String(order.servicePointId) } }
      : {}),
    ship_with: {
      type: "shipping_option_code",
      properties: { shipping_option_code: isTest ? TEST_OPTION_CODE : service.optionCode },
    },
    order_number: order.reference,
    total_order_price: { currency: "EUR", value: (order.totalCents / 100).toFixed(2) },
    parcels: [{ weight: { value: (order.weightGrams / 1000).toFixed(3), unit: "kg" } }],
  };

  const response = await sendcloudFetch(`${PANEL_V3}/shipments/announce`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const parcel = responseSchema.parse(await response.json()).data.parcels[0];

  return {
    parcelId: parcel.id,
    trackingNumber: parcel.tracking_number ?? null,
    trackingUrl: parcel.tracking_url ?? null,
    isTest,
  };
}

/** Le PDF de l'étiquette, au format A4 (imprimante de bureau). */
export async function fetchLabelPdf(parcelId: number): Promise<ArrayBuffer> {
  const response = await sendcloudFetch(
    `${PANEL_V3}/parcels/${parcelId}/documents/label?paper_size=a4`,
    { headers: { Accept: "application/pdf" } },
  );
  return response.arrayBuffer();
}
