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

- Vercel: `vercel.json` already tells Vercel there is no framework, nothing to
  install and nothing to build. The repo must not contain an old `package.json`
  or `next.config.*`, otherwise Vercel tries to build a Next.js app.
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

## Book cards

Every book card is built from its cover photo: 700 x 1000, the cover full bleed
inside the rounded card shape, with the flag of the language in the top-right
corner at the same size and position as the flag on the Zero to One card. The
source photos sit in `Readings/_covers` and are never loaded by the site. To add
a book, drop its cover in that folder, add a line to `BOOKS` in
`tools/make_book_cards.py`, run it, then add the book to `content.js`:

```
pip install pillow
python3 tools/make_book_cards.py
```

## Weight of the cards

The card artwork arrived as PNGs of two to three megabytes each, which is why
cards sometimes appeared a moment late. `tools/slim_cards.py` rewrites the
images embedded in the card SVGs as WebP at 840 pixels wide, which is all the
resolution a card that is never wider than 280 pixels can show. That took the
set from 22 MB to under 2 MB with no visible difference. Run it after adding any
new card with a photo in it:

```
python3 tools/slim_cards.py            # report what it would save
python3 tools/slim_cards.py --write    # rewrite the files
```

The site also preloads the artwork of a section before dealing it, and fetches
the other sections in the background once the first screen is up, so a card is
never dealt as an empty rectangle.

## Notes

- The line under the arrow takes the dominant colour of the card it points at,
  worked out from the artwork itself in `assets/js/card-image.js`: the border of
  the card when it has one, otherwise the strongest colour inside it. Cards that
  are only black and white fall back to `--dial` in `assets/css/main.css`.
- The dial is deliberately plain: a flat disc, two dashed hairline circles, the
  turning PORTFOLIO ring, the fixed ME marker and the draw button. No gradients,
  no shadow, no rim.
- The About head card is deliberately left white, waiting for artwork.
- The Rockefeller cover is 334 x 500, still under the 700 or so a card can show,
  so it stays a touch soft. Every other cover is fine.
- `data/site.ts` in the repo is a leftover of the old Next.js version and can be
  deleted.
- `Projects/BExams_card_site_ready.svg` (2.2 MB) and
  `Education/Education_card_site_ready.svg` (1.5 MB) contain large embedded
  PNGs. Exporting those images as WebP inside the SVG would make the first load
  on phones noticeably faster.
- Fonts are licensed under the SIL Open Font License (see `assets/fonts`).
