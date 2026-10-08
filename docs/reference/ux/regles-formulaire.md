# Règles de formulaire

Distillé des documents de ce dossier : GOV.UK Design System (`govuk-*.md`),
Nielsen Norman Group (`nng-*.md`), W3C ARIA Authoring Practices.

## Le menu déroulant est un dernier recours

> « The select component should only be used as a last resort in public-facing
> services because research shows that some users find selects very difficult
> to use. » — GOV.UK, `govuk-select.md:647`

Avant un `<select>`, poser une question qui réduit le nombre d'options, puis
utiliser des boutons radio. Un déroulant cache les options : l'utilisateur ne
sait pas ce qu'il rate tant qu'il n'a pas ouvert la liste.

**Appliqué chez nous** : rayon, taille, plage horaire et durée sont des groupes
de radios en pastilles. Aucun `<select>` nulle part.

**Exception raisonnée : le secteur d'activité.** Dix options en pastilles
prenaient six lignes en haut de l'étape et repoussaient tout le reste hors de
l'écran. Le champ est donc un **combobox** (`features/onboarding/choice-field.tsx`),
motif W3C — ce qui n'est pas un `<select>`, et pour la raison précise que GOV.UK
lui reproche : la liste s'ouvre **entière** au clic, elle ne cache rien, et elle
se filtre à la frappe. Le clavier et les lecteurs d'écran passent par
`role="listbox"` et `aria-activedescendant`.

La saisie libre y est refusée, contrairement aux champs à jetons : la valeur
alimente les recherches Google Places, et un secteur inventé ne correspondrait à
rien. C'est à ça que sert l'option « Autre ».

Le seuil à retenir : en dessous d'une dizaine d'options, les pastilles restent
meilleures — tout est visible sans un clic.

## Ne jamais forcer à écrire ce qu'on peut proposer

Une page blanche bloque. Chaque champ libre porte des propositions cliquables
qui remplissent le champ — le client corrige au lieu de rédiger.

Les propositions ne sont pas des exemples décoratifs : elles doivent être des
réponses réellement valables, prêtes à être validées telles quelles.

## Le texte d'aide sert à répondre, pas à décorer

> « Use hint text to show information that helps the majority of users answer
> the question. » — GOV.UK, `govuk-question-pages.md:612`

Une aide qui répète le libellé est du bruit. Une aide utile dit où trouver
l'information, ou ce qui distingue une bonne réponse d'une mauvaise.

## Ne demander une information qu'une fois

> « Make sure to only ask for a piece of information once within a single
> journey. » — GOV.UK, `govuk-question-pages.md:329`

## Bloquer plutôt que réprimander

Le bouton de progression reste inactif tant que l'étape est incomplète. Le
client voit ce qui manque avant de cliquer, au lieu de recevoir une erreur
après coup.

## Les états viennent du navigateur

Case à cocher ou bouton radio masqué sous une pastille stylée, jamais un `div`
avec un `onClick`. Le clavier, le focus et les lecteurs d'écran fonctionnent
alors sans code supplémentaire (W3C ARIA APG).
