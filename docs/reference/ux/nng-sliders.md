# Slider Design: Rules of Thumb

Source : https://www.nngroup.com/articles/gui-slider-controls/
Nielsen Norman Group — Aurora Harley, 13 septembre 2015. Récupéré le 2026-09-13.

## Résumé

« Selecting a precise value using a slider is a difficult task requiring good
motor skills, even if the slider is well designed. If picking an exact value is
important to the goal of the interface, choose an alternate UI element. »

## Imprecise Interactions

Les curseurs posent problème partout, et particulièrement sur mobile, où
l'utilisateur manipule souvent d'une main en faisant autre chose. La loi de
Steering s'applique : un chemin plus long et plus étroit demande plus de temps à
parcourir. Les utilisateurs visent mal et déplacent le curseur par accident en
relevant le doigt.

L'accessibilité tactile est un second problème : tremblements, motricité fine
réduite, main peu stable — le curseur devient une barrière.

## Is an Exact Value Necessary?

**Quand utiliser un curseur** : « Sliders work best when the specific value does
not matter to the user, but an approximate value is good enough. »

**Quand ne pas en utiliser** : dès que la valeur exacte compte (âge, poids,
taille, note précise). « The wider or the denser the range selectable through a
slider, the harder it is to select a precise value. »

## Think About the Thumb

Sur écran tactile, la position des libellés est décisive. Un libellé placé
**sous** le curseur est masqué par le pouce pendant la manipulation :

« Any labels describing the slider or its currently selected value must appear
beside or above both thumbs involved: the thumb of the user, and the thumb of
the slider. »

## Conclusion

N'utiliser un curseur que si une valeur approximative suffit. Garder les
libellés visibles au-dessus ou à côté du contrôle. Envisager des options
tapables ou un champ de saisie à la place.

## Ce que ça implique chez nous

Le curseur d'abonnement est un bon cas d'usage : le client ne cherche pas
« 740 crédits », il cherche un ordre de grandeur et un budget. La valeur exacte
n'a pas à être atteignable au pixel — d'où le pas de 20 crédits.

Deux points de vigilance :

- **Les libellés doivent rester au-dessus.** Le montant et « Crédits par mois »
  sont au-dessus du rail ; les repères de palier sont en dessous et seront
  masqués par le pouce sur mobile. C'est acceptable pour un décor informatif,
  ça ne le serait pas pour la valeur sélectionnée.
- **Le curseur ne doit jamais être le seul chemin.** Voir
  `govuk-question-pages.md:1021` (WCAG 2.5.1) : les repères et les deux bornes
  sont des boutons cliquables, c'est ce qui satisfait la règle.
