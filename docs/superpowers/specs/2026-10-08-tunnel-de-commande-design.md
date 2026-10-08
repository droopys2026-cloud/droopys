# Tunnel de commande — design

Date : 2026-10-08. Validé en conversation.

## Objectif

Remplacer la redirection vers la page Stripe hébergée par un tunnel en trois
étapes sur `/commande`, carte saisie dans la page (Stripe Payment Element).

## Parcours

Fiche produit → panier → `/commande` (une page, trois étapes, récapitulatif du
panier collant à droite, sous le formulaire sur mobile) :

1. **Coordonnées** — e-mail, prénom, nom, téléphone. Préremplies si connecté ;
   lien « J'ai un compte » sinon.
2. **Livraison** — radios : *domicile* (adresse saisie, ou choisie dans le
   carnet si connecté ; tarif des Réglages, offert au-delà du seuil) ou
   *retrait à Grand Littoral* (gratuit).
3. **Paiement** — rappel coordonnées + livraison avec « Modifier », Payment
   Element (moyens activés au tableau de bord Stripe), case CGV, bouton
   « Payer X € ».

Barre d'étapes cliquable en arrière ; « Continuer » inactif tant que l'étape
est incomplète ; saisies conservées en `sessionStorage` (confort, pas vérité).

## Stripe

- Checkout Session `ui_mode: "elements"` créée à l'entrée de l'étape 3 par une
  Server Action : revalidation Zod, prix et stock relus en base, port calculé
  côté serveur. Aucun montant ne vient du navigateur.
- `return_url` → `/commande/merci?session_id={CHECKOUT_SESSION_ID}`.
- Livraison, téléphone et adresse voyagent dans `metadata` de la session.
- Le webhook reste le seul à créer la commande : `checkout.session.completed`
  **et** `checkout.session.async_payment_succeeded` (Klarna, virements), filtrés
  sur `payment_status === "paid"`.
- Jamais de `payment_method_types` : moyens dynamiques.

## Données

`orders` gagne `delivery_method` (`domicile` | `retrait`) et `customer_phone`.

## Évolutivité

Le mode de livraison est une union discriminée : un mode `relais` (Sendcloud)
s'ajoute comme une troisième branche sans toucher aux deux autres.

## Vérification

Vitest sur les fonctions pures (calcul du port, encodage des métadonnées,
schéma des étapes) ; parcours complet au navigateur avec une carte de test
Stripe ; `npm run check` et `npm run build`.
