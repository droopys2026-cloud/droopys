# Prompts photo Droopys

Toutes les photos du site viennent du même « studio » imaginaire. Ce qui fait
tenir la grille comme une seule séance, ce n'est pas la pose : c'est le
**paragraphe de décor et de lumière**, recopié mot pour mot d'un prompt à
l'autre. Ne le reformule pas, même pour l'améliorer.

## Règles communes

- Format : `--ar 2:3` en vertical (hero, cartes produit), `--ar 3:2` en paysage
  (visuels des menus). Ce sont les seuls formats que les cadres du site
  attendent — voir `ratio` dans `@/components/ui/frame-image`.
- Deux vues par sujet : un **gros plan** (affiché au repos) et un **plan
  complet** (révélé au survol). Nommage : `sujet2.webp` pour le gros plan,
  `sujet.webp` ou `sujet1.webp` pour le plan complet.
- Dépôt : `public/imgdress/`, sans accent dans le nom de fichier (un nom
  accentué doit être encodé dans l'URL et se comporte mal selon les serveurs).
- À ne jamais demander : `harsh flash, dark grading, busy background, props,
toys, text overlay, other brand logos, sunglasses, makeup`.
- Mannequins de toutes origines — européenne, noire, métisse, maghrébine —,
  demandé par la boutique. Les exemples ci-dessous sont écrits pour un enfant
  européen : remplacer l'origine, la peau et les cheveux par ceux de
  `MODEL_LOOKS` dans `@/lib/photo-prompts` (par exemple « a Black girl, …,
  deep brown skin and natural black hair in neat braids »). Le générateur de
  l'admin le fait de lui-même avec le menu « Origine ».

## Paragraphe de décor (à recopier tel quel)

```
Plain pale off-white concrete wall, faintly textured and slightly uneven, with a matching pale concrete floor, filling the whole background. Even soft daylight, flat and shadowless, no flash, no visible shadow cast on the wall. Muted neutral palette: warm white, stone grey, beige, deep black. Nothing else in frame. Shot on 85mm, shallow depth of field, fine natural film grain, true-to-life skin tones and visible fabric texture.
```

Variante bébé (fond rose très clair) :

```
Plain very pale blush pink wall, almost white, faintly textured, with a matching pale pink floor, filling the whole background. Even soft daylight, flat and shadowless, no flash, no visible shadow cast on the wall. Muted palette: pale blush pink, warm white, soft pink, blush cream. Nothing else in frame. Shot on 85mm, shallow depth of field, fine natural film grain, true-to-life skin tones and visible fabric texture.
```

## Garçon — C.P. Company (`petitgas.webp` / `petitgas2.webp`)

Plan complet :

```
Full-body editorial fashion photograph of a white European child model, around 10 years old, light skin and light brown hair, wearing the C.P. Company jacket from the reference image — reproduce the jacket exactly: same colour, fabric, goggle hood, lens detail, badge placement and proportions. Styled with straight-leg dark denim, a plain white tee and clean white low-top sneakers.

Standing relaxed against the wall, weight on one leg, hands loose or one in pocket, calm natural expression looking slightly off-camera. Confident, effortless, age-appropriate — a child at ease, not posing like an adult.

[paragraphe de décor]

Luxury e-commerce editorial style — quiet, refined, premium. Vertical framing, full body in frame with headroom and space at the bottom for caption text. --ar 2:3
```

Gros plan :

```
Close-up editorial fashion photograph of the same white European child model, around 10 years old, wearing the C.P. Company jacket from the reference image — head and shoulders only, hood up, framed tight so the goggle hood fills the frame: reproduce the hood exactly, same colour, fabric, twin lenses, stitching and proportions, lens detail sharp and legible.

Head slightly turned, chin level, calm natural expression looking just past the camera. Age-appropriate and unforced.

[paragraphe de décor]

Vertical framing, generous space above the head. --ar 2:3
```

## Bébé — Chloé (`bebe.webp` / `bebe2.webp`)

Plan complet :

```
Full-body editorial fashion photograph of a white European baby girl, around 18 months old, light skin, fine light brown hair, wearing the Chloé dress from the reference image — reproduce the dress exactly: same pale blush cream colour, soft brushed jersey, long puffed sleeves gathered at the shoulder, ribbed crew neckline, seamed empire waist with gathered flared skirt, and the pink "Chloé" logo across the chest at the same size and position. Bare legs, small white soft-soled shoes.

Standing on her own, feet slightly apart, arms relaxed, genuinely smiling at the camera with a natural open baby smile — happy, unposed, candid.

[paragraphe de décor]

Vertical framing, full body in frame with headroom and space at the bottom for caption text. --ar 2:3
```

Gros plan (assise, fond rose très clair) :

```
Close-up editorial fashion photograph of the same white European baby girl, around 18 months old, wearing the Chloé dress from the reference image — head, shoulders and chest only. Sitting on the floor the way a baby sits — legs folded loosely in front of her, skirt spread around her, one hand resting on the ground for balance. Looking up at the camera, laughing openly, cheeks full, eyes crinkled — a real unposed baby smile. Framed close: from just above her head down to the hem of the skirt, so her face and the pink Chloé logo are both large and fully legible.

[paragraphe de décor — variante bébé]

Vertical framing, generous space above the head. --ar 2:3
```

## Fille — Lanvin (`fille1.webp` / `fille2.webp`)

Plan complet :

```
Full-body editorial fashion photograph of a white European girl, around 13 years old, light skin, long straight dark brown hair, wearing the Lanvin denim dress from the reference image — reproduce the dress exactly: same dark indigo washed denim, sleeveless collared shirt-dress cut, full front button placket with silver engraved Lanvin buttons, flapped chest pockets, seamed waist with belt tabs and side pockets, short A-line skirt with a raw frayed hem. Holding the matching Lanvin denim tote from the reference image in one hand — same dark denim body, tan leather handles and trim, woven chevron side panels, and the crystal-embellished "LANVIN" lettering across the front, exact size, typography and placement. Grey and navy patterned low-top sneakers.

Standing relaxed facing the camera, weight on one leg, the tote held low at her side, free arm loose, calm natural expression, a faint easy smile.

[paragraphe de décor]

Vertical framing, full body in frame with headroom and space at the bottom for caption text. --ar 2:3
```

Gros plan :

```
Close-up editorial fashion photograph of the same white European girl, around 13 years old, wearing the Lanvin denim dress from the reference image — framed from mid-thigh to just above her head, turned three-quarters, holding the Lanvin denim tote up against her hip so the crystal "LANVIN" lettering, the tan leather handles and the woven chevron side panel are large and fully legible.

Looking at the camera, chin level, calm and quietly confident, a faint natural smile.

[paragraphe de décor]

Vertical framing, generous space above the head. --ar 2:3
```

## Chaussures — Lanvin Curb (`chaussures.webp` / `chaussures2.webp`)

Même studio que les silhouettes : un produit photographié ailleurs se voit
immédiatement dans une grille.

Vue portée (plan complet) :

```
Full-body editorial fashion photograph of a white European boy, around 10 years old, wearing the Lanvin Curb sneakers from the reference image — reproduce the shoes exactly: cream and sand suede panels, oversized herringbone-woven laces in beige and off-white tied in a loose bow, tonal perforated toe panel, chunky ridged rubber midsole in off-white, ribbed pull tab at the heel. Styled with straight-leg dark denim cropped just above the ankle and a plain cream sweatshirt, so the shoes read as the subject of the photograph.

Standing relaxed, weight on one leg, feet slightly apart and clearly visible, arms loose, calm natural expression looking slightly off-camera.

[paragraphe de décor]

Vertical framing, full body in frame with the shoes fully visible and space at the bottom for caption text. --ar 2:3
```

Vue produit (gros plan, sans modèle) :

```
Close-up product photograph of a pair of Lanvin Curb sneakers from the reference image, placed side by side on the floor, shot slightly from above at a three-quarter angle — reproduce the shoes exactly: cream and sand suede panels, oversized herringbone-woven laces in beige and off-white tied in a loose bow, tonal perforated toe panel, chunky ridged rubber midsole in off-white, ribbed heel pull tab, visible stitching and suede nap.

The pair fills the frame, laces arranged naturally, nothing else in shot — no box, no props, no hands.

[paragraphe de décor]

Vertical framing, generous even margin around the pair. --ar 2:3
```

## Les trois ensemble — visuel de campagne (`trio.webp`)

Seule photo du site qui s'autorise un décor : c'est un visuel de campagne, pas
une fiche produit. Le fond reste clair et neutre, la lumière douce — sinon la
photo ne tient plus avec le reste de la grille.

```
Editorial fashion campaign photograph of three white European teenagers, around 15 to 16 years old, standing together in a loose group — a boy with short dark hair on the left, a girl with long wavy chestnut hair in the centre, a boy with light brown curls on the right. Each wears a different look: the first a navy Moncler quilted jacket over a grey hoodie and black straight-leg jeans with white sneakers; the second a beige Burberry trench coat over a cream knit and dark denim with tall leather boots; the third a black Stone Island overshirt over a white tee, olive cargo trousers and suede sneakers. Reproduce each garment's cut, colour and brand detailing faithfully.

Standing in front of a pale stone Haussmann-style building facade on a quiet Paris street — tall windows, wrought-iron balconies, a plain stone doorway — softly out of focus behind them. Empty street, no cars, no passers-by, no signage, no readable text.

Caught mid-movement, walking towards the camera side by side and laughing together — one turning to look at the others mid-laugh, one with an arm swinging, hair and coat hems in motion, a foot lifted mid-step. Joyful, energetic, genuinely candid — friends caught between two frames, never posed. Slight natural motion blur on hands and fabric, faces sharp.

Soft diffused overcast daylight, flat and shadowless, no flash. Muted neutral palette: pale stone, warm white, grey, navy, beige, black. Shot on 85mm, shallow depth of field with the three faces sharp and the facade softly blurred, fine natural film grain, true-to-life skin tones and visible fabric texture.

Luxury e-commerce editorial style — quiet, refined, premium. Horizontal framing, all three full-length in frame with headroom above and pavement visible below, generous space on both sides. --ar 3:2
```
