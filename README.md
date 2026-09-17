# Dario Moscatello, portfolio

A static site: plain HTML, CSS and JavaScript modules, with no build step and no
dependencies. The card folders (`Education/`, `Work/`, `Projects/`, `Readings/`,
`More/`) stay exactly where they are; the site reads the SVGs from there.

```
dario-moscatello/
  index.html
  assets/
    css/main.css
    js/content.js       <- all text, card order and options
    js/main.js          <- sections, navigation, links in the URL
    js/wheel.js         <- card wheel: turning, drag, shake, random draw
    js/panel.js         <- text shown when a card is pressed
    js/title-twist.js   <- the twisting DARIODARIO / MOSCATELLO title
    js/motion.js        <- easing helpers
    fonts/              <- Unbounded, Geist, Geist Mono (self-hosted)
    favicon.svg
  Education/ Work/ Projects/ Readings/ More/   (your cards, unchanged)
```

## Run it locally

Browsers do not load JavaScript modules from a double-clicked file, so start a
small local server from inside `dario-moscatello/`:

```
python3 -m http.server 8000
```

or `npx serve .`, then open http://localhost:8000.

## Put it online

Any static host works, and there is nothing to build.

- Vercel: import the folder or repo, framework preset "Other", no build command.
- Netlify: drag the `dario-moscatello` folder onto app.netlify.com/drop.
- GitHub Pages: push the folder and enable Pages on the branch.

## Change text or card order

Everything is in `assets/js/content.js`. Each section is a list of cards: the
first one (`head: true`) sits under the arrow when the section opens, the rest
follow in the order written. The head card shows an index of the section, and
each name in the index turns the wheel to that card.

A card without `image` is drawn as an empty white card, so when a new card is
ready you only add its path, for example
`image: 'Readings/The_Black_Swan_card.svg'`.

Options at the top of the same file:

- `fillMode: 'fewer'` shows only the real cards. `'duplicate'` repeats the
  non-head cards until the wheel holds `minCards`.
- `autoRotate: true` turns the wheel by itself every `autoRotateEvery` seconds
  until the first interaction.
- `defaultSection` is the section shown when the URL has no `#section`.

Links work per card too: `…/#education/harvard` opens that card directly.

## Interactions

- Press a card: the wheel turns it under the arrow and its text appears.
- Drag or swipe sideways on the wheel, or use the left and right arrow keys
  when the wheel has focus.
- Draw a card: the wheel spins fast, slows down by itself and lands on a random
  card, never the head card of the section.
- With "reduce motion" turned on in the system settings, the title stays still
  and the wheel moves without spinning or shaking.

## Tuning the motion

- Title speed and amount of twist: `speed` and `twist` at the top of
  `assets/js/title-twist.js`.
- Distance between cards: `SPACING` in `assets/js/wheel.js`.
- Strength of the shake: the `kick` function in `assets/js/wheel.js`.

## Notes

- The German card says B1, while the content file says B2. The text panel
  follows the content file; change one of the two so they match.
- Hedels has no description yet (the content file had "..."), so its panel
  shows role, year and link only.
- `Projects/BExams_card_site_ready.svg` (2.2 MB) and
  `Education/Education_card_site_ready.svg` (1.5 MB) contain large embedded
  PNGs. Exporting those images as WebP inside the SVG would make the first load
  on phones noticeably faster.
- Fonts are licensed under the SIL Open Font License (see `assets/fonts`).
