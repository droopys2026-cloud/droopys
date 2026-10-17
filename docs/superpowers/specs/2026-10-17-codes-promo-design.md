# Codes promo — design

Demande de la boutique : créer des codes promo dans l'admin, valables sur tout
le site ou sur des produits choisis (avec photo, nom, prix), et annoncer un
code « tout le site » dans la bande noire à la place du message Klarna.

## Décisions prises

- Remise en **pourcentage ou montant fixe**, au choix par code.
- Limites facultatives : **date de fin**, **nombre max d'utilisations**,
  **montant minimum**, **une fois par cliente** — reconnue à son compte, son
  e-mail, son téléphone ou son adresse de livraison à domicile
  (`@/lib/promo/identity`, un seul point commun suffit ; les adresses de
  point relais et de retrait ne comptent pas, elles sont partagées).
- **Pas de remise sur les articles soldés** (déclinaison avec prix barré
  effectif).
- Saisie du code **dans le panier** ; la remise suit jusqu'au paiement.
- Un seul code par commande. La livraison n'est jamais réduite ; la livraison
  offerte se calcule **après** remise.
- Un code « tout le site » peut être **annoncé dans la bande noire**, à la
  place du message des réglages, tant qu'il est valable.

## Pourquoi le site calcule, et Stripe applique

Les promotion codes de Stripe ne savent pas exprimer nos règles : `applies_to`
exige des produits Stripe (nos lignes sont en `price_data`), « pas sur les
soldés » dépend du prix barré du moment, et « une fois par cliente » suppose
un objet Customer que le tunnel ne crée pas.

Le site calcule donc la remise (`@/lib/promo/discount`, fonction pure testée)
puis la transmet à la Checkout Session sous forme de **coupon Stripe à usage
unique** : `amount_off` = remise calculée, `currency: eur`,
`max_redemptions: 1`, `name` = le code. Passé dans `discounts: [{ coupon }]`.
Stripe l'affiche sur le formulaire et le reçu (« BLACK20 −35,00 € ») et débite
exactement `sous-total − remise + port`. Un coupon s'applique aux articles,
jamais aux frais de port (`shipping_options`) — conforme à la règle.

Le total renvoyé au navigateur est `session.amount_total`, relu chez Stripe :
ce qui s'affiche est ce qui sera débité.

## Données

Table `promo_codes` :

| colonne | type | sens |
|---|---|---|
| `id` | uuid | |
| `code` | text, unique (en majuscules) | « BLACK20 » |
| `kind` | `percent` \| `amount` | type de remise |
| `value` | integer | pourcentage (1–100) ou centimes |
| `scope` | `site` \| `products` | portée |
| `ends_at` | timestamptz null | fin de validité |
| `max_uses` | integer null | plafond d'utilisations |
| `min_subtotal_cents` | integer null | minimum d'achat (articles éligibles + non éligibles, avant remise) |
| `once_per_customer` | boolean | une fois par cliente (compte, e-mail, téléphone ou adresse à domicile) |
| `uses` | integer default 0 | utilisations confirmées |
| `active` | boolean | interrupteur de l'admin |
| `announce` | boolean | annoncer dans la bande (scope `site` seulement) |
| `announcement` | text null | message de la bande ; vide = message généré |
| `created_at` | timestamptz | |

Table `promo_code_products` (`promo_code_id`, `product_id`, cascade des deux
côtés, clé primaire composée) pour la portée `products`.

`orders` : `promo_code text null`, `discount_cents integer not null default 0`.

RLS activée sur les deux nouvelles tables, comme les autres.

## Calcul (`@/lib/promo/discount`, pur)

Entrée : le code (règles), les lignes du panier (`productId`,
`unitPriceCents`, `quantity`, `onSale`), l'e-mail si connu, le nombre
d'utilisations passées par cet e-mail, l'heure.

Sortie : union discriminée
`{ ok: true, discountCents, eligibleCents } | { ok: false, reason }` avec
`reason` ∈ `inactif`, `expire`, `epuise`, `minimum` (avec le montant),
`deja-utilise`, `aucun-article`.

- Éligibles : lignes non soldées, et dans la liste si portée `products`.
- Pourcentage : `round(eligibleCents × value / 100)`.
- Montant : `min(value, eligibleCents)`.
- Remise 0 → `aucun-article`.

« Soldé » : déclinaison sans prix propre dont le produit a un prix barré
supérieur au prix — la même règle que l'affichage du prix barré.

## Parcours

1. **Panier** : champ « Code promo » + Appliquer. Action serveur
   `applyPromoCode` : normalise (trim, majuscules), valide via `discount`, pose
   un cookie `droopys_promo` (code seul, httpOnly). Le panier relit le code à
   chaque affichage et montre « Code BLACK20 −35,00 € » + Retirer, ou le motif
   du refus. « Une fois par cliente » ne peut être vérifié qu'à l'e-mail : au
   panier on vérifie le compte connecté s'il y en a un, sinon au tunnel.
2. **Tunnel** : le récapitulatif montre la remise ; la livraison offerte se
   calcule sur `articles − remise`.
3. **Paiement** (`createPaymentSession`) : revalidation complète avec l'e-mail
   saisi. Refus → message d'erreur, pas de session. Accord → coupon à usage
   unique + `discounts`, et `metadata.promo` = code, `metadata.remise` =
   centimes.
4. **Webhook** : lit `metadata.promo` et `session.total_details.amount_discount`
   (fait foi), écrit `orders.promo_code` / `discount_cents`, incrémente
   `promo_codes.uses` dans la même transaction. Vide le cookie promo avec le
   panier.

Limite connue : deux paiements simultanés sur le dernier usage d'un code
passent tous deux (compteur incrémenté au paiement, non réservé). Rare, et
sans perte d'argent au-delà d'une remise ; noté plutôt que compliqué.

## Totaux des commandes

Un seul calcul, `orderTotalCents`, devient `articles − remise + port` et
remplace les sommes recopiées (remboursement, admin, espace client, e-mail).
Le remboursement maximum en découle : on ne rembourse jamais plus que payé.
La remise s'affiche dans l'e-mail, l'espace client et la fiche commande.

## Admin → Codes promo

- Entrée de menu « Codes promo ».
- Liste : code, remise, portée (« Tout le site » / « 3 produits »), utilisations
  (`uses` / `max_uses`), état (Actif, Expiré, Épuisé, Désactivé), Activer /
  Désactiver, Supprimer.
- Création / modification : code, type + valeur, portée ; pour `products`, une
  liste à cocher des produits publiés avec photo, nom, marque, prix et
  recherche ; limites facultatives ; case « Annoncer dans la bande noire » +
  message (portée `site` seulement).
- Validation Zod à l'entrée : code `[A-Z0-9-]{3,30}`, pourcentage 1–100,
  montant > 0, au moins un produit si portée `products`, date future.

## Bande noire

`SiteAnnouncement` cherche d'abord un code `site`, `active`, `announce`, non
expiré, non épuisé (filtré à l'heure de la requête, pas en cache figé) ; s'il
en existe un, son message remplace celui des réglages, sans logo Klarna.
Message généré : « −20 % sur tout le site avec le code BLACK20 » /
« −10 € sur tout le site avec le code BLACK20 ».

## Tests

- Vitest : `discount` (pourcentage, montant plafonné, soldés exclus, portée
  produits, chaque motif de refus, arrondi), message de bande, `orderTotalCents`
  avec remise, schéma Zod de l'admin.
- Tunnel réel en local jusqu'à la page de paiement Stripe (mode test si
  disponible) : montant affiché = sous-total − remise + port.
- `npm run build`, `npx eslint src`, captures admin / panier / bande.

## Hors périmètre

Codes réservés à une cliente précise, cumul de plusieurs codes, remise sur la
livraison, génération de codes en masse.
