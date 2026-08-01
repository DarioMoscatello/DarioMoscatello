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

**Everything you'll want to change lives in `data/site.ts`** — bio, jobs, research,
education, awards, languages, links. The pages just read from it, so you never have to
touch JSX to update the CV.

Two things to fix before going live:

1. `profile.linkedin` in `data/site.ts` — paste your real LinkedIn URL.
2. `metadataBase` in `app/layout.tsx` — set your real domain.

## Structure

```
app/
  layout.tsx        shell, fonts, metadata
  page.tsx          01 About
  experience/       02 Experience
  research/         03 Research
  education/        04 Education
  awards/           05 Awards
  contact/          06 Contact
  globals.css       the whole design system
  icon.svg          favicon
components/
  SiteNav.tsx       fixed left panel + mobile drawer
  PageHead.tsx      page title block + "next page" link
data/
  site.ts           all copy
```

## Design notes

- Palette: ink `#0E0F10`, paper `#EFEDE8`, ash `#8B8A84`, hairline `#232427`,
  brass `#B8A06A`. The brass is the only accent — it's the nameplate on a Milanese
  door, which is also the idea behind the left navigation panel (a *citofono*:
  engraved plate on top, numbered buttons below, the LED lights on the page you're on).
- Type: **Archivo** for display, **Newsreader** for body copy, **IBM Plex Mono** for
  labels, dates and navigation. Loaded from Google Fonts in `app/layout.tsx`.
- Motion: one page-load stagger and a hairline rule that draws itself. Disabled
  entirely under `prefers-reduced-motion`.

## Adding a page

1. Add an entry to `nav` in `data/site.ts` (index `07`, label, href).
2. Create `app/<href>/page.tsx`, copy the shape of `app/awards/page.tsx`.
