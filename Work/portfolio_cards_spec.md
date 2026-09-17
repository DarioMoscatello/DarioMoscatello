# Portfolio — Style & Card Specifications

## Site background

Use this as the main website background:

```css
background-color: #F2F2F0;
```

This is an off-white / warm light grey. It should remain the default background behind the cards.

---

## Global card format

Unless a specific card says otherwise, all cards follow the same structure:

- Size: **700 x 1000 px**
- Orientation: **vertical / portrait**
- Rounded corners
- No background outside the rounded card: **transparent SVG canvas outside the card shape**
- No extra text unless it is part of the logo itself
- Logos centered visually, with generous empty space around them
- Keep original logo proportions: **never stretch or squeeze horizontally or vertically**
- Prefer SVG/vector assets for logos
- Do not bake heavy shadows into the SVG; add shadows later with CSS if needed

Suggested website CSS:

```css
.portfolio-card {
  width: 340px;
  height: auto;
  display: block;
  border-radius: 28px;
}
```

---

## Harvard Business School

- Card background: **Harvard burgundy**
- Color: `#A41034`
- Logo: Harvard shield only
- Shield colors: **black + white**
- No `Harvard Business School` text
- Minimal composition, centered shield, lots of negative space

File used:

`HBS_card_site_ready.svg`

---

## Duke

- Card background: **Duke navy blue**
- Color: approximately `#001856`
- Logo: Duke crest
- Crest: **white**
- No additional text
- Centered and proportionally scaled

File used:

`Duke_card_site_ready.svg`

---

## Bocconi

- Card background: **pure white**
- Color: `#FFFFFF`
- Logo: Bocconi `B`
- Logo color: **Bocconi blue**
- Color: `#00478A`
- No text
- Large centered `B`, but with enough breathing room around it

File used:

`Bocconi_card_site_ready_white.svg`

---

## Education

- Card background: very dark charcoal / black
- Visual: monochrome close-up of an open book with fanned pages
- Thin geometric lines / arc as decorative elements
- Title: `EDUCATION`
- Title is uppercase
- Font direction: **Geist Mono style**, semi-bold / bold
- Wide tracking / letter spacing
- No decorative line above the title
- No extra copy such as `Ideas / discipline / perspective`
- No `People / Places / Knowledge`

Suggested text styling:

```css
.education-title {
  font-family: "Geist Mono", monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

Note: the book image is raster content embedded inside the SVG, while the card container remains SVG.

File used:

`Education_card_site_ready.svg`

---

## Copernicus

- Card background: **pure white**
- Color: `#FFFFFF`
- Logo: Copernicus blue circular symbol + `COPERNICUS`
- Remove the word `Servicing`
- Keep all circles perfectly round
- **Never squeeze the circles**
- If the logo feels too wide, scale the whole logo down uniformly instead
- Preserve the original logo proportions exactly

File used:

`Copernicus_card_site_ready_v3.svg`

---

## Mask / red face logo

- Card background: dark anthracite / charcoal
- Logo centered
- Keep the original palette:
  - red hood / outer shape
  - beige / skin tone
  - black facial details
  - white monogram / symbol
- No extra text
- Keep the original proportions of the logo

File used:

`Mask_logo_card_site_ready.svg`

---

## BExams

- Card background: **pure white**
- Color: `#FFFFFF`
- Logo palette:
  - dark navy blue for `B` and `Exams`
  - bright red circular stroke around the `B`
- Keep the complete BExams logo centered
- No added text or effects
- Preserve the original proportions

File used:

`BExams_card_site_ready.svg`

---

## HEDELS

- Card background: **pure white**
- Color: `#FFFFFF`
- Logo color: dark navy blue
- Use the full HEDELS logo with the geometric roof symbol
- No added text or effects
- Keep the original logo proportions

File used:

`HEDELS_card_site_ready.svg`

---

## Additional generic logo card

Two variants were prepared for the separate uploaded logo:

### Dark version

- Background: black / near-black
- Logo: white

File:

`Logo_card_black_site_ready.svg`

### Light version

- Background: white
- Logo: black

File:

`Logo_card_white_site_ready.svg`

The dark version was preferred because it adds more contrast to the overall card set.

---

## Overall visual system

The portfolio should feel:

- minimal
- editorial
- premium
- modern
- clean
- slightly futuristic

The main website uses `#F2F2F0`, while the cards alternate between strong institutional colors, white, and dark charcoal. This creates contrast without making the composition visually noisy.

When cards are placed together, preserve variation in color:

- Harvard: burgundy
- Duke: navy
- Bocconi: white
- Education: charcoal / black
- Copernicus: white
- Mask logo: charcoal
- BExams: white
- HEDELS: white

Do not deform logos to make them fit. Always reduce the full logo uniformly instead.
