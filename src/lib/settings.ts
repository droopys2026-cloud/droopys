import { z } from "zod";

/**
 * Réglages de boutique.
 *
 * Ce sont les valeurs répétées partout : le seuil de livraison offerte
 * apparaît dans la barre d'annonce, sur la fiche produit, dans le panier et
 * dans le pied de page. Les saisir une fois évite qu'ils finissent par se
 * contredire d'une page à l'autre.
 *
 * Ce module est **pur** : ni base, ni `server-only`. Il décrit la forme des
 * réglages et leurs valeurs d'usine, rien de plus — c'est ce qui permet au
 * script de semis comme au formulaire de l'admin de l'importer.
 */

/** Montants en centimes, comme partout ailleurs : jamais de flottant. */
export const shopSettingsSchema = z.object({
  boutique: z.object({
    name: z.string().min(1),
    email: z.string().email().or(z.literal("")),
    phone: z.string(),
    address: z.string(),
  }),
  livraison: z.object({
    /**
     * Seuil de livraison offerte. `null` : aucune franchise — la cliente paie
     * le tarif réel du transporteur, quel que soit le montant.
     */
    freeFromCents: z.number().int().nonnegative().nullable(),
    /**
     * Poids estimé d'un article selon sa nature, en grammes — voir
     * `@/lib/shipping/weight`. Les tarifs Sendcloud dépendent du poids du
     * colis, et la boutique ne pèse pas ses pièces. `default` : les réglages
     * enregistrés avant ce champ restent lisibles.
     */
    weights: z
      .object({
        clothes: z.number().int().positive(),
        baby: z.number().int().positive(),
        shoes: z.number().int().positive(),
        coat: z.number().int().positive(),
        accessory: z.number().int().positive(),
      })
      .default({ clothes: 350, baby: 200, shoes: 900, coat: 1000, accessory: 200 }),
    /** Délai annoncé, en toutes lettres : « 48 h en France métropolitaine ». */
    delay: z.string(),
  }),
  paiement: z.object({
    /** Moyens affichés au pied de page et au paiement, dans cet ordre. */
    methods: z.array(z.string()),
  }),
  retours: z.object({
    days: z.number().int().nonnegative(),
    terms: z.string(),
  }),
  annonce: z.object({
    /** Bandeau noir en tête de page. Vide, il ne s'affiche pas. */
    message: z.string(),
  }),
  newsletter: z.object({
    title: z.string(),
    text: z.string(),
    placeholder: z.string(),
    buttonLabel: z.string(),
    /** Prestataire d'emailing. `null` : envoi non branché, bouton inactif. */
    provider: z.string().nullable(),
  }),
  reseaux: z.object({
    instagram: z.string(),
    facebook: z.string(),
    tiktok: z.string(),
    pinterest: z.string(),
  }),
});

export type ShopSettings = z.infer<typeof shopSettingsSchema>;

/** Clé unique de la ligne `settings` qui porte l'objet ci-dessus. */
export const SHOP_SETTINGS_KEY = "shop";

export const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  boutique: {
    name: "Droopy's",
    email: "",
    phone: "",
    address: "",
  },
  livraison: {
    freeFromCents: null,
    weights: { clothes: 350, baby: 200, shoes: 900, coat: 1000, accessory: 200 },
    delay: "48 h en France métropolitaine",
  },
  paiement: {
    methods: ["Carte bancaire", "PayPal", "Klarna — paiement en 3 fois"],
  },
  retours: {
    days: 30,
    terms:
      "Retour offert sous 30 jours, article non porté et étiquette d'origine attachée.",
  },
  annonce: {
    message: "Retours sous 30 jours",
  },
  newsletter: {
    title: "Restons en contact",
    text: "Nouveautés, ventes privées et sélections Droopy's, une fois par semaine.",
    placeholder: "Votre adresse e-mail",
    buttonLabel: "Je m'inscris",
    provider: null,
  },
  reseaux: { instagram: "", facebook: "", tiktok: "", pinterest: "" },
};

/** Lignes d'usine de la table `settings`, telles que les verse le semis. */
export const DEFAULT_SETTINGS: Record<string, unknown> = {
  [SHOP_SETTINGS_KEY]: DEFAULT_SHOP_SETTINGS,
};
