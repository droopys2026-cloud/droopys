# Couleurs et prix par déclinaison — design

Demande de la cliente : certaines tailles d'un même article n'ont pas le même
prix, et un même article existe en plusieurs couleurs — elle veut une seule
fiche au lieu d'une fiche par couleur.

## Décisions prises

- Une déclinaison = couleur × taille, avec son stock et un prix **facultatif**
  (vide = prix du produit).
- Chaque couleur a ses photos ; une photo sans couleur est commune.
- Une couleur = un nom + une teinte (`#rrggbb`) choisie à l'admin.
- Listes : une carte par produit, pastilles des couleurs dessous, « dès … »
  si les prix varient.
- La couleur s'affiche partout où la taille s'affiche : panier, tunnel,
  Stripe, e-mail, espace client, admin, rétractation.
- Produit sans couleur : comportement actuel, aucune reprise de données.

## Données

- Nouvelle table `product_colors` : `id`, `product_id` (cascade), `name`,
  `slug` (unique par produit, pour `?couleur=`), `hex`, `position`.
- `product_images.color_id` : nullable, `on delete cascade` (la couleur et ses
  photos partent ensemble ; l'admin réécrit de toute façon tout).
- `product_variants.color_id` : nullable, cascade ; `price_cents` nullable.
  L'unicité devient `(product_id, color_id, size)` avec `nulls not distinct`,
  sinon deux lignes « sans couleur / 8 ans » passeraient.
- `order_lines.color` : texte nullable, figé comme `size` et le prix.

Prix effectif d'une déclinaison : `variant.priceCents ?? product.priceCents`,
calculé par une seule fonction (`@/lib/products/price`). Le prix barré du
produit ne s'applique qu'aux déclinaisons sans prix propre.

## Admin

- Bloc « Couleurs » (facultatif) : nom + sélecteur de teinte, retirer,
  monter/descendre.
- Tailles choisies une fois dans le barème, communes à toutes les couleurs.
- Stock : un tableau Taille / Stock / Prix, un par couleur (un seul sans
  couleur).
- Photos : chaque photo porte un menu « Couleur : toutes / … ».
- Envoi : `colors` (`{key, name, hex}`), `sizes` (libellés ordonnés),
  `stock` (`{colorKey, size, quantity, price}`), `imageColors` (clé de couleur
  ou `null`, aligné sur la galerie). `key` = id existant ou identifiant
  provisoire ; le serveur le traduit en id réel.
- Refus : couleur sans photo, nom de couleur en double, teinte invalide,
  prix ≤ 0, case de stock manquante ou hors couleurs/tailles déclarées.
- Enregistrement en une transaction : suppression puis réinsertion des
  couleurs, photos et déclinaisons.

## Boutique

- `Product.colors?: { id, slug, name, hex, images }[]` (images = celles de la
  couleur puis les communes) ; `Product.sizes[]` gagne `colorId?` et
  `priceCents` (effectif). `imageUrl`/`hoverImageUrl`/`images` = première
  couleur.
- Fiche : un fournisseur client (`ProductColorProvider`) tient la couleur
  choisie ; galerie, prix et sélecteur le lisent. Pastilles au-dessus des
  tailles, « Couleur : Rose poudré ». La couleur initiale vient de
  `?couleur=` lu côté client (la page reste statique) et y est réécrite
  par `history.replaceState`.
- Prix de la fiche : celui de la déclinaison choisie, sinon « dès … » si les
  prix de la couleur varient.
- Carte : pastilles (au plus 5, puis « +n »), « dès … » si les prix varient,
  prix barré seulement si aucun prix propre.
- Recherche : « dès … » via le même calcul. Le menu (mises en avant) garde le
  prix du produit — hors périmètre.

## Panier et commande

- `CartLine` gagne `color?: string` et `unitPriceCents` ; tous les totaux
  passent par `unitPriceCents`.
- Tunnel : montant Stripe = prix effectif ; description « Rose · Taille 8 ».
- Webhook : `unitPriceCents` = prix effectif, `color` = nom de la couleur.
- Libellé de ligne commun « Rose poudré · 8 ans » (`@/lib/products/variant-label`)
  repris par l'e-mail, l'espace client, l'admin, la rétractation.

## Tests

- Vitest : prix effectif et fourchette, libellé de déclinaison, validation
  `productIssues` (couleurs, prix, cohérence du stock), e-mail et
  rétractation avec couleur.
- `npm run build`, `npx eslint src`, capture navigateur de la fiche et de
  l'admin.

## Hors périmètre

Filtre par couleur, conservation des identifiants de déclinaison d'un
enregistrement à l'autre (déjà le cas aujourd'hui pour les tailles), prix
« dès » dans le menu, mannequins des photos IA (traité à part).
