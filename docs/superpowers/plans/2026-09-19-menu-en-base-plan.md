# Menu en base — plan d'exécution

Conception : `docs/superpowers/specs/2026-09-19-menu-en-base-design.md`.

Source d'amorçage : le `MAIN_NAV` actuel. Il descend en base par le script de
peuplement, puis disparaît du code applicatif au lot 3 — comme
`placeholder-data.ts` est devenu `scripts/demo-catalogue.ts`.

## Lot 1 — Sous-rayons

1. `db/schema/catalog.ts` : table `subcategories`, relations,
   `products.subcategory` (texte) → `products.subcategory_id`.
2. `npm run db:generate` puis `db:migrate`.
3. `types/product.ts` : `subcategory?: { slug, title }` — la fiche produit peut
   enfin lier son sous-rayon au lieu d'en afficher le nom mort.
4. `lib/queries/catalog.ts` : `listSubcategories`, `getSubcategory`,
   `listProductsForSubcategory`.
5. Route `(rayons)/[categorie]/[sous]/page.tsx`.
6. `scripts/seed.mts` : sous-rayons déduits des liens `/{rayon}/{sous}` du menu.
7. Admin `/admin/rayons` : liste des rayons, fiche de rayon avec ses sous-rayons.
8. Fiche produit admin : le champ sous-rayon devient un `<select>`.

## Lot 2 — Sélections éditoriales

Les cinq rubriques transverses se sont révélées être déjà des rayons en base
(voir la correction dans la conception). Le lot se réduit donc à ce qui
manquait vraiment : un article présent dans plusieurs sous-rayons.

1. Table `product_placements`, migration.
2. `listProductsForSubcategory` et `listProductsForCategory` réunissent
   classement et placements, sans doublon.
3. Admin : la fiche d'un sous-rayon gagne un choix d'articles.

## Lot 3 — Menu en base

1. Tables `nav_sections`, `nav_columns`, `nav_links`, `nav_features`.
2. `MAIN_NAV` déplacé en `scripts/demo-navigation.ts` ; `lib/navigation.ts` ne
   garde que les types et `getMainNav()`.
3. `MainNav`, `MobileNav`, `CategoryLinks` reçoivent l'arbre en props.
4. Visuels en `next/image` quand la cible a une photo.

## Lot 4 — Admin du menu

1. `/admin/menu` : rubriques, colonnes, liens, visuels, ordre.
2. Entrée dans la barre latérale.

## Vérification par lot

`npm run build`, `npx eslint src`, puis capture headless du menu ouvert.
