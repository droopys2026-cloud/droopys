@AGENTS.md

# Droopys

Site e-commerce (Next.js 16, App Router, TypeScript, Tailwind v4).
Interface en français : libellés, `lang="fr"`, formats de prix et de date en `fr-FR`.

**La marque s'écrit DROOPY'S** (logo, majuscules) et **Droopy's** dans les phrases — avec l'apostrophe, comme sur l'enseigne. « droopys » sans apostrophe ne subsiste que dans les noms techniques (cookies, dossiers, identifiants).

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
    account/      connexion, inscription et espace client
    checkout/     tunnel de commande (étapes, récapitulatif, paiement Stripe)
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

## Documentation locale

Consulter `docs/reference/` **avant** d'écrire du code utilisant une de ces
librairies — ne jamais inventer une API de mémoire. Ces fichiers sont
volumineux : les greper, pas les lire.

| Fichier | Contenu |
|---|---|
| `nextjs.md` | doc Next.js complète |
| `drizzle.md` | doc Drizzle complète |
| `stripe.md`, `zod.md`, `react.md`, `shadcn.md` | index de doc |
| `better-auth*.md` | index + `drizzle`, `nextjs` |
| `resend.md`, `sentry.md` | e-mails transactionnels, monitoring |
| `vitest.md`, `playwright/`, `testing-library/`, `msw/` | tests unitaires, e2e, composants, simulation HTTP |
| `vercel.md`, `vercel-cron.md` | déploiement et cron plateforme |
| `ecommerce/` | logique d'un site marchand (client, panier, commande, paiement, retours, stock) — modèle de domaine Medusa, `README.md` pour choisir |

**Next.js — priorité à la doc embarquée.** Cette version (16.3.1) diffère de mes
connaissances ; `AGENTS.md`, régénéré par `next dev`, le signale. La doc faisant
foi est celle livrée avec le paquet, dans `node_modules/next/dist/docs/`.
`docs/reference/nextjs.md` reste utile pour une vue d'ensemble, mais en cas de
désaccord c'est `node_modules` qui a raison.

### Pratiques d'ingénierie — `docs/reference/practices/`

Références externes reconnues, à consulter en cas de doute sur *comment* écrire,
pas *quoi* écrire. En cas de conflit, `CLAUDE.md` l'emporte.

| Fichier | Source | À consulter pour |
|---|---|---|
| `ts-style-guide/` | mkosir | **le plus utile** : un fichier par sujet — `types`, `discriminated-unions`, `functions`, `naming`, `react`, `tests`, `source-organization`. `INDEX.md` pour choisir. |
| `refactor-like-a-superhero/` | Bespoyasov, 22 chapitres | **le plus complet sur le code au quotidien**, exemples en TypeScript : noms, duplication, abstraction, effets de bord, erreurs, typage statique. `22-cheatsheet.md` en résumé. |
| `bulletproof-react-*.md` | alan2207 (★35k) | découpage React/Next à grande échelle : `project-structure`, `state-management`, `api-layer`, `error-handling`, `testing`, `security`, `performance` |
| `clean-code-typescript.md` | labs42io | nommage, fonctions, SOLID appliqué à TS |
| `node-best-practices.md` | goldbergyoni | structure de projet, gestion d'erreurs, prod, perf |
| `google-code-review-*.md` | google/eng-practices | ce qu'on regarde en revue, et pourquoi les petits changements gagnent |
| `owasp-nodejs-security.md`, `owasp-rest-security.md`, `owasp-logging.md` | OWASP | **obligatoire** avant de toucher à l'auth, aux webhooks, au paiement ou aux logs — on manipule des données personnelles et de l'argent |
| `grug-brained-developer.md` | grugbrain.dev | la référence sur la complexité : pourquoi le développeur expérimenté écrit du code ennuyeux |
| `12factor/` | 12factor.net | config par variables d'environnement, processus sans état, parité dev/prod |
| `system-design-primer.md` | donnemartin | cache, files, montée en charge |
| `professional-programming.md`, `free-books-by-subject.md` | index | pour chercher, pas pour lire |

`docs/reference/ux/` : formulaires (GOV.UK, NN/g), motifs WAI-ARIA — à lire avant
tout formulaire, en particulier le tunnel de paiement.
`docs/reference/copywriting/` : règles de titre et de page de vente.

## Posture d'ingénierie

Travailler comme un ingénieur qui devra maintenir ce code dans deux ans, pas
comme un prestataire payé à la fonctionnalité livrée.

**Comprendre avant d'écrire.** Lire le code existant et la doc locale avant de
proposer. Une API inventée de mémoire coûte plus cher que cinq minutes de `grep`
dans `docs/reference/`.

**Le plus simple qui marche.** Pas d'abstraction pour un seul cas d'usage. On
abstrait à la troisième répétition, pas à la première intuition.

**Rendre les états invalides impossibles.** Unions discriminées plutôt que
booléens optionnels. Si le compilateur peut interdire un bug, il doit l'interdire.

**Échouer bruyamment, tôt, à la frontière.** Toute donnée externe — formulaire,
webhook, paramètre d'URL — passe par un schéma Zod avant d'entrer dans le
système. Jamais de `catch` silencieux, jamais de valeur par défaut qui masque
une erreur.

**Nommer d'après le domaine.** `OrderStatus`, pas `ResultData`. Le vocabulaire du
code est celui dans lequel on parle du produit.

**Petits changements cohérents.** Une intention par commit. Un gros changement se
découpe.

**Pas de `any`, pas de `as`** pour faire taire le compilateur — si le type ne
colle pas, c'est le modèle qui est faux.

**Un fichier qui dépasse ~300 lignes fait probablement trop de choses.** Le découper.

**Dire quand quelque chose ne va pas.** Une contrainte contournée en silence
devient une dette invisible. Signaler, proposer l'alternative, exécuter la
décision prise.

**Vérifier avant d'affirmer.** « Ça marche » ne se dit qu'après avoir vu la
sortie de la commande, pas sur la foi d'une relecture.

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

## À faire — connecteurs des comptes clients

Le code des comptes clients est en place (spec :
[docs/superpowers/specs/2026-10-08-comptes-clients-design.md](docs/superpowers/specs/2026-10-08-comptes-clients-design.md)),
mais ces réglages manquent encore. Tant qu'ils ne sont pas faits, la connexion
Google et les e-mails (confirmation d'inscription, mot de passe oublié) ne
marchent pas.

- [ ] Supabase → Auth → SMTP : brancher Resend (`smtp.resend.com`, port 465, clé API Resend).
- [ ] Supabase → Auth → Templates : e-mails de confirmation et de réinitialisation en français.
- [ ] Supabase → Auth → Providers → Google : identifiants OAuth de la console Google.
- [ ] Supabase → Auth → URL Configuration : autoriser `/compte/confirmation` (local et production).
- [ ] Mentions de confidentialité : ajouter Google comme fournisseur d'identité.
- [ ] Tester ensuite au navigateur : inscription → e-mail → confirmation, mot de passe oublié, Google.
- [x] Resend : domaine `droopys-marseille.com` vérifié, `RESEND_API_KEY` et `EMAIL_FROM` (`commandes@droopys-marseille.com`) dans `.env.local`. **Reste** : les copier dans les variables d'environnement Vercel, et ajouter l'enregistrement DMARC (`_dmarc` TXT `v=DMARC1; p=none;`).

Nouvel admin : `npm run grant-admin -- <email>` (être connecté ne suffit plus pour entrer dans l'admin).

## À faire — Sendcloud (expédition)

Branché : tarifs réels au tunnel (poids estimé par rayon, Admin → Réglages),
points relais (mini-carte), étiquettes créées et imprimées depuis la fiche
commande de l'admin, suivi enregistré, avis d'expédition à la cliente.

Avant la mise en production :

- [ ] Sendcloud → Réglages → Mes adresses : corriger l'adresse d'expédition (rue saisie « 139 avenue de la Viste 139 », contact « fathma fathma ») — elle s'imprime sur chaque étiquette.
- [ ] Sendcloud → Facturation : enregistrer une carte, les étiquettes y sont débitées.
- [ ] Régénérer la clé secrète Sendcloud (elle est passée par un chat) et mettre les deux clés chez l'hébergeur.
- [ ] `SENDCLOUD_TEST_LABELS=0` **en production seulement** — à 1, les étiquettes sont des lettres de test gratuites.
- [ ] Webhook Sendcloud (suivi « livré ») : à activer une fois le site en ligne, `https://<domaine>/api/sendcloud/webhook` (route à écrire).
