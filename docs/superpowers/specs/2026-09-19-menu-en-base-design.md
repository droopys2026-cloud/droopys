# Menus du header en base et éditables — conception

Date : 2026-09-19

## Problème

Le menu principal est une constante de 305 lignes (`src/lib/navigation.ts`).
Rien n'est modifiable sans déploiement, les visuels des panneaux sont des
cadres gris (`ImagePlaceholder`), et la quasi-totalité des liens de deuxième
niveau (`/fille/robes`, `/manteaux/doudounes`, `/outlet/-50`) renvoie un 404 :
il n'existe qu'une route `(rayons)/[categorie]` et trois rayons en base.

Rendre le menu « réel » suppose donc trois chantiers liés : un modèle de menu
en base, des destinations qui existent, et des écrans d'admin pour les tenir.

## Décisions

| Question | Décision |
|---|---|
| Source du menu | Tables dédiées, éditables — pas de dérivation du catalogue. |
| Liens de 2ᵉ niveau | Vraies routes qui listent des produits. |
| Sous-rayons | Table `subcategories` ; `products.subcategory` (texte libre) devient une clé étrangère. |
| Visuels du menu | Aucune image propre : le visuel reprend la photo de sa cible. |
| Rubriques transverses (Manteaux, Chaussures, Accessoires, Nouveautés, Outlet) | Sélections de produits choisies à la main — voir la correction ci-dessous. |

Note sur la dernière ligne : `contentPages` avait été envisagé, mais son
vocabulaire de blocs ne sait pas afficher de produits et ses groupes sont
`aide | a-propos | services | legal`. Une page « Doudounes » bâtie là-dessus
serait une page de boutique sans articles.

## Correction en cours de route

La conception tablait sur trois rayons en base. Le peuplement en a versé
**huit** : `src/lib/categories.ts` déclarait déjà Nouveautés, Manteaux,
Chaussures, Accessoires et Outlet comme des rayons à part entière. Les cinq
rubriques dites « transverses » avaient donc déjà leur table, leur route et
leur page.

Les tables `collections` et `collection_products` prévues pour elles ont été
abandonnées : elles auraient dupliqué `categories` et `subcategories`, et
imposé une résolution de route à deux temps pour rien.

Il restait un seul manque réel : un article n'a qu'un rayon et qu'un
sous-rayon, donc une doudoune garçon ne pouvait pas figurer aussi sous
/manteaux/doudounes, et ces pages restaient vides. C'est ce qu'apporte la
table `product_placements` — une sélection choisie à la main, ce qui était
l'intention, avec une table au lieu de deux.

## Modèle de données

### Catalogue

```
subcategories
  id, slug, category_id → categories, title, intro?, image_url?, position
  unique (category_id, slug)

products
  subcategory_id → subcategories (nullable, on delete set null)
  — remplace products.subcategory (text)
```

Migration : le texte existant est apparié par slug aux lignes créées ; toute
valeur sans correspondance est signalée, jamais perdue en silence.

### Sélections éditoriales

```
product_placements
  product_id → products, subcategory_id → subcategories, position
  clé primaire (product_id, subcategory_id)
```

Un rayon affiche alors ses pièces classées **et** celles placées dans l'un de
ses sous-rayons ; un sous-rayon, les siennes et celles qu'on y a placées.

### Menu

```
nav_sections   id, label, href, position
nav_columns    id, section_id, title, position, all_label?, all_href?
nav_links      id, column_id, label, href, position
nav_features   id, section_id, position,
               subcategory_id?, collection_id?
               check : exactement une des deux cibles
```

Quatre tables plutôt qu'un arbre auto-référent à colonne `kind` : un arbre
générique autorise un lien rattaché directement à une rubrique, sans colonne.
Ici cet état n'est pas représentable.

`nav_features` ne stocke ni titre, ni href, ni image : les trois sont lus sur
la cible. Un visuel ne peut donc pas diverger du sous-rayon qu'il annonce.

## Routes

- `/[rayon]` — la route existante, inchangée.
- `/[rayon]/[sous]` — nouvelle, résolue dans `subcategories`, sinon 404.

Les routes statiques existantes (`/marques`, `/panier`…) gardent la priorité.

## Site

`MAIN_NAV` devient `getMainNav()`, requête mise en cache. `MainNav`,
`MobileNav` et `CategoryLinks` reçoivent l'arbre en props depuis un parent
serveur et restent clients pour l'ouverture au survol. Un visuel s'affiche en
`next/image` quand sa cible a une photo, en `ImagePlaceholder` sinon.

## Admin

Trois entrées de plus dans `src/app/admin/(back-office)` :

- **Rayons** — catégories, leurs sous-rayons, la photo et la sélection
  d'articles de chacun.
- **Menu** — rubriques, colonnes, liens, visuels, ordre.

Le champ sous-rayon de la fiche produit passe de la saisie libre à un
`<select>` alimenté par le rayon choisi.

## Lots

Chaque lot laisse le site fonctionnel et se vérifie par `npm run build`,
`npx eslint src` et une capture du menu ouvert.

1. Sous-rayons : table, migration, route `/[rayon]/[sous]`, admin, select produit.
2. Placements : table, remontée dans les pages de rayon, choix des articles.
3. Menu en base : quatre tables, script de reprise de `MAIN_NAV`, lecture site.
4. Admin du menu et visuels.

Le menu cesse d'être en dur au lot 3.
