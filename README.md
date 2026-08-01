# dariomoscatello.com

Personal site — Next.js 15 (App Router) + TypeScript, no CSS framework.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy it

Push the folder to a GitHub repo, then import it on [vercel.com/new](https://vercel.com/new).
No environment variables, no build settings to change — Vercel detects Next.js on its own.

## Edit the content

**Everything you'll want to change lives in `data/site.ts`** — bio, education, work,
projects, awards, links. The pages just read from it, so you never have to touch JSX
to update the CV.

Two things to fix before going live:

1. `profile.linkedin` in `data/site.ts` — paste your real LinkedIn URL.
2. `metadataBase` in `app/layout.tsx` — set your real domain.

## Structure

```
app/
  layout.tsx        shell, fonts, metadata
  page.tsx          "I am" — about, interests, email
  education/        Harvard, Duke, Bocconi, Jean Monnet
  work/             Copernicus, NOBE.ee, MrXShop
  projects/         the two applications built in 2025
  awards/           maths olympiad, FIDE, 100/100
  globals.css       the whole design system
  icon.svg          favicon
components/
  SiteNav.tsx       fixed left column + mobile drawer
  PageHead.tsx      page title block + "next page" link
data/
  site.ts           all copy
```

## Design notes

- Two inks and nothing else: paper `#F7F4EC`, ink `#14140F`, grey `#8A867C` for
  secondary text, `#E2DCCE` for hairlines. No accent colour anywhere.
- The left column shares the page's background and is separated by a single
  hairline that runs the full height, so it reads as part of the sheet rather than
  a panel sitting on top of it.
- The current page is marked with an em dash in the menu — no numbering.
- Type: **Newsreader** for display and body, **IBM Plex Mono** for the menu, dates
  and labels. Loaded from Google Fonts in `app/layout.tsx`.
- A faint SVG grain sits on the background, which is what keeps the cream from
  looking like flat #FFF-adjacent beige.
- Motion: one page-load stagger and a hairline that draws itself. Disabled entirely
  under `prefers-reduced-motion`.

## Adding a page

1. Add an entry to `nav` in `data/site.ts` (label, href).
2. Create `app/<href>/page.tsx`, copy the shape of `app/work/page.tsx`.
