/**
 * Services de livraison proposés au tunnel, et leur prix réel chez Sendcloud.
 *
 * Module pur : il reçoit la liste des méthodes Sendcloud et rend les options
 * à afficher. Le prix n'est **pas** fixé par la boutique : c'est le tarif du
 * transporteur pour ce poids et ce pays, plus la TVA (Sendcloud donne ses
 * prix hors taxes).
 *
 * Sendcloud découpe chaque service en tranches de poids (« Colissimo Home
 * 0.25-0.5kg », « 0.5-0.75kg »…) : on retient celle qui contient le colis.
 * Les variantes qu'on ne propose pas — signature, QR, casier, samedi — sont
 * écartées par le motif du nom. Chronopost à domicile (Chrono 18, 16 € pour
 * un petit colis) a été retiré en octobre 2026 : trop cher pour ce qu'il
 * apporte ; Chronopost reste proposé en relais, en Shop2Shop.
 */

/** Une méthode d'envoi telle que la rend `GET /api/v2/shipping_methods`. */
export type SendcloudMethod = {
  id: number;
  name: string;
  carrier: string;
  min_weight: string;
  max_weight: string;
  countries: { iso_2: string; price: number }[];
};

export type Carrier = "colissimo" | "mondial_relay" | "chronopost";
export type ServiceKind = "domicile" | "relais";

export type ShippingService = {
  key: string;
  carrier: Carrier;
  kind: ServiceKind;
  label: string;
  /** Ce que la cliente lit sous le libellé. */
  detail: string;
  /** Nom de la tranche Sendcloud : « <préfixe> <poids>kg ». */
  pattern: RegExp;
  /**
   * Code de l'option d'envoi dans l'API v3 de Sendcloud, celle qui crée les
   * étiquettes (la v2 est fermée aux nouveaux comptes). Relevé avec
   * `POST /api/v3/shipping-options` : mêmes services, mêmes prix qu'en v2.
   */
  optionCode: string;
};

export const SERVICES: ShippingService[] = [
  {
    key: "colissimo-domicile",
    carrier: "colissimo",
    kind: "domicile",
    label: "Colissimo à domicile",
    detail: "Livré dans votre boîte aux lettres ou en main propre, 48 h.",
    pattern: /^Colissimo Home \d/,
    optionCode: "colissimo:home/fr",
  },
  {
    key: "mondial-relay-domicile",
    carrier: "mondial_relay",
    kind: "domicile",
    label: "Mondial Relay à domicile",
    detail: "Livré chez vous, 3 à 5 jours.",
    pattern: /^Mondial Relay Home Domestic \d/,
    optionCode: "mondial_relay:home_domestic,dualapi/c2c",
  },
  {
    key: "colissimo-relais",
    carrier: "colissimo",
    kind: "relais",
    label: "Colissimo en point relais",
    detail: "Bureau de poste ou relais Pickup, 48 h.",
    pattern: /^Colissimo Service Point \d/,
    optionCode: "colissimo:post-office",
  },
  {
    key: "mondial-relay-relais",
    carrier: "mondial_relay",
    kind: "relais",
    label: "Mondial Relay en point relais",
    detail: "Dans un commerce près de chez vous, 3 à 5 jours.",
    pattern: /^Mondial Relay Point Relais \d/,
    optionCode: "mondial_relay:service_point,dualapi/size=l,c2c",
  },
  {
    key: "chronopost-relais",
    carrier: "chronopost",
    kind: "relais",
    label: "Chronopost en point relais",
    detail: "Dans un relais Pickup près de chez vous, 2 à 4 jours.",
    // Shop2Shop et non Chrono Relais : même réseau de relais pour la
    // cliente, mais la boutique dépose le colis en relais au lieu d'un
    // enlèvement — 4,15 € TTC contre 10,97 € pour 350 g (octobre 2026).
    // L'espace est facultatif : Sendcloud écrit « Shop2Shop19-20kg ».
    pattern: /^Chrono Shop2Shop ?\d/,
    optionCode: "chronopost:shop2shop",
  },
];

/**
 * Option gratuite de Sendcloud pour les tests : une vraie étiquette, non
 * affranchie, jamais facturée ni prise en charge par un transporteur.
 */
export const TEST_OPTION_CODE = "sendcloud:letter";

/** TVA appliquée au port : Sendcloud facture hors taxes. */
export const SHIPPING_VAT_RATE = 0.2;

export type ShippingOption = {
  key: string;
  carrier: Carrier;
  kind: ServiceKind;
  label: string;
  detail: string;
  /** Identifiant de la tranche Sendcloud — c'est lui qui servira à l'étiquette. */
  methodId: number;
  /** Prix TTC payé par la cliente, en centimes. */
  priceCents: number;
};

/**
 * Les options disponibles pour un colis de `weightKg` envoyé vers `country`,
 * de la moins chère à la plus chère dans chaque mode (domicile, relais).
 */
export function quoteServices(
  methods: SendcloudMethod[],
  country: string,
  weightKg: number,
): ShippingOption[] {
  const options: ShippingOption[] = [];

  for (const service of SERVICES) {
    const match = methods.find((method) => {
      if (method.carrier !== service.carrier || !service.pattern.test(method.name)) {
        return false;
      }
      // Tranches de la forme 0.251–0.501 : borne basse incluse, haute exclue,
      // pour qu'un poids rond tombe dans une seule tranche.
      return (
        weightKg >= Number(method.min_weight) && weightKg < Number(method.max_weight)
      );
    });
    const price = match?.countries.find((entry) => entry.iso_2 === country)?.price;
    if (!match || price === undefined || price <= 0) continue;

    options.push({
      key: service.key,
      carrier: service.carrier,
      kind: service.kind,
      label: service.label,
      detail: service.detail,
      methodId: match.id,
      // Arrondi au centime le plus proche, une seule fois, sur le TTC.
      priceCents: Math.round(price * 100 * (1 + SHIPPING_VAT_RATE)),
    });
  }

  return options.sort((a, b) =>
    a.kind === b.kind ? a.priceCents - b.priceCents : a.kind === "domicile" ? -1 : 1,
  );
}
