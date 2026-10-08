# Slider Pattern

Source : https://www.w3.org/WAI/ARIA/apg/patterns/slider/
W3C — ARIA Authoring Practices Guide (APG). Récupéré le 2026-09-13.

> Ce fichier remplace l'entrée-index de `wai-aria-patterns.md:437`, qui ne
> donnait que le titre du motif.

## About This Pattern

« A slider is an input where the user selects a value from within a given
range. Sliders typically have a slider thumb that can be moved along a bar,
rail, or track to change the value of the slider. »

### Warning

Touch-based assistive technology users may experience difficulty with this
slider pattern. These technologies require gestures that synthesize key events
to increase or decrease slider values. This represents a new convention that
some assistive technologies may not fully support. Developers should thoroughly
test slider implementations using assistive technologies on touch-primary
devices before production deployment.

## Keyboard Interaction

- `Right Arrow` : Increase the slider value by one step
- `Up Arrow` : Increase the slider value by one step
- `Left Arrow` : Decrease the slider value by one step
- `Down Arrow` : Decrease the slider value by one step
- `Home` : Set slider to first allowed value in range
- `End` : Set slider to last allowed value in range
- `Page Up` (optionnel) : Increase slider value by amount larger than standard step
- `Page Down` (optionnel) : Decrease slider value by amount larger than standard step

Notes :

1. Focus lands on the slider thumb (the movable visual object).
2. Reversing direction for certain keys could sometimes provide more intuitive
   behavior.

## WAI-ARIA Roles, States, and Properties

- Focusable slider control requires the `slider` role.
- `aria-valuenow` set to a decimal representing the current value.
- `aria-valuemin` set to a decimal for the minimum allowed value.
- `aria-valuemax` set to a decimal for the maximum allowed value.
- **When `aria-valuenow` lacks user-friendliness, `aria-valuetext` provides an
  understandable string representation.**
- Visible labels referenced via `aria-labelledby` ; sinon `aria-label` fournit
  le libellé.
- Vertical orientation requires `aria-orientation` set to `vertical` ; la valeur
  par défaut est `horizontal`.

## Ce que ça implique chez nous

`<input type="range">` natif porte déjà `role=slider`, `aria-valuenow`,
`aria-valuemin` et `aria-valuemax`. Ce qu'il ne porte pas, c'est
**`aria-valuetext`** : un lecteur d'écran annonce « 1000 » sur le curseur
d'abonnement, pas « 1000 crédits, 460 € par mois ». C'est exactement le cas que
la règle vise — une valeur brute qui ne dit pas ce qu'elle achète.
