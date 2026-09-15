@AGENTS.md

# Droopys

Site e-commerce (Next.js 16, App Router, TypeScript, Tailwind v4).
Interface en français : libellés, `lang="fr"`, formats de prix et de date en `fr-FR`.

## Système de design

Le design vient d'une capture mesurée d'un site de référence. Les valeurs
relevées (couleurs, tailles, durées) font foi : **ne pas les arrondir, ne pas
en inventer de nouvelles**. Quand une valeur manque, l'écrire en commentaire
plutôt que de la deviner.

| Fichier                     | Contenu                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `src/styles/theme.css`      | Jetons dans `@theme` — couleurs, familles, espacements, rayons, tailles de texte. Tailwind en dérive les utilitaires. |
| `src/styles/type.css`       | Rôles typographiques (`.heading-h2`, `.text-paragraph`, `.link--nav`…).                                               |
| `src/styles/primitives.css` | Une classe par variante visuelle relevée. 20 variantes, aucune fusionnée.                                             |
| `src/styles/sections.css`   | Bandes de page et sous-surfaces, plus les seuls points de rupture du projet.                                          |
| `src/styles/motion.css`     | Durées, courbes et transitions relevées, plus le repli `prefers-reduced-motion`.                                      |

Règles :

- Nouvelle couleur, nouvel espacement, nouveau rayon → jeton dans `theme.css`, jamais une valeur en dur dans un composant.
- `--color-ink-inverse` (blanc) uniquement sur `--color-surface-inverse` / `--color-surface-inverse-alt`. Sur fond clair il donne 1:1, donc invisible.
- Le survol est la convention d'interaction du design ; ne pas ajouter d'effets au-delà de ceux déjà portés par `primitives.css`.
- Pas de thème sombre : aucune variante sombre n'a été relevée, on ne suit pas `prefers-color-scheme`.
- **Une seule police : Poppins**, chargée par `next/font/google` dans `app/layout.tsx` (graisses 300/400/500/600). Les polices du design de référence (antarctica, Atacama) sont abandonnées.
- Les rôles typographiques ne se distinguent donc plus par la famille mais par la **graisse** : 300 = léger (paragraphes, accents de titre), 400 = courant, 500 = boutons et liens, 600 = titres et noms de marque. Les jetons `--font-light/medium/semibold/serif` pointent tous vers Poppins et ne servent qu'à garder les rôles lisibles dans le CSS.

## Découpage des composants

```
src/
  app/            routes et layouts uniquement — aucune mise en forme longue
  components/
    layout/       ossature présente sur toutes les pages (header, footer, barre d'annonce)
    sections/     blocs d'une page (hero, rail produits, éditorial, newsletter)
    product/      tout ce qui affiche un produit (carte, prix, favori)
    ui/           briques sans logique métier (icônes, pastille, cadre d'image)
  lib/            fonctions pures (formatage, données de démonstration)
  types/          modèles partagés
```

- Un composant = un fichier, export nommé, nom du fichier en `kebab-case`.
- Une page assemble des sections, elle ne les met pas en forme.
- Serveur par défaut. `"use client"` seulement pour un composant qui a un état ou un écouteur d'événement, et le plus bas possible dans l'arbre.
- Les données descendent en `props` typées depuis `@/types` ; un composant ne va pas chercher ses données lui-même.
- Imports internes toujours en `@/…`, jamais en `../../`.

## Conventions de code

- Prix en **centimes** (`priceCents`), formatés par `formatPrice` de `@/lib/format`. Jamais de flottant sur la monnaie.
- Pas de lien ni de bouton imbriqué dans un autre : le favori d'une carte produit est un frère du lien, pas un enfant.
- Toute icône seule porte un `aria-label` ; tout champ porte un `<label>` (visuellement masqué si besoin).
- Images via `next/image` dès qu'il y a de vraies photos ; garder `ImagePlaceholder` comme cadre pour éviter les sauts de mise en page.
- Commentaires en français, et ils expliquent le **pourquoi** — pas la paraphrase du code.

## Photos

Les prompts qui ont produit les visuels du site sont dans
[docs/prompts-photo.md](docs/prompts-photo.md), avec le paragraphe de décor à
recopier tel quel : c'est lui, et non la pose, qui fait tenir toute la grille
comme une seule séance photo. Toute nouvelle photo part de ce fichier.

## Vérifier

```bash
npm run dev     # développement
npm run build   # doit passer avant toute annonce de « c'est fini »
npx eslint src  # lint
```
