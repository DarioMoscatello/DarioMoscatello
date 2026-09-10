# dariomoscatello.com

Personal site built with Next.js 15 (App Router) and TypeScript, with no CSS framework.
The visual system uses a black editorial canvas, oversized typography and an
interactive glass object.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy it

Push the folder to a GitHub repo, then import it on [vercel.com/new](https://vercel.com/new).
No environment variables or build settings need changing. Vercel detects Next.js on its own.

## Edit the content

**Everything you'll want to change lives in `data/site.ts`**: bio, education, work,
projects, awards, links. The pages just read from it, so you never have to touch JSX
to update the CV.

Two things to fix before going live:

1. In `data/site.ts`, paste your real LinkedIn URL into `profile.linkedin`.
2. In `app/layout.tsx`, set your real domain in `metadataBase`.

## Structure

```
app/
  layout.tsx        shell, fonts, metadata
  page.tsx          "I am": about, interests, email
  education/        Harvard, Duke, Bocconi, Jean Monnet
  work/             Copernicus, MrXShop
  projects/         BExams, Hedels
  readings/         the book shelf
  more/             languages and the FIDE chess title
  globals.css       the whole design system
  icon.svg          favicon
  media/            project logos and screenshots (in /public)
  books/            book covers (in /public)
components/
  SiteNav.tsx       fixed left column + mobile drawer
  PageHead.tsx      page title block + "next page" link
  Plate.tsx         framed image that opens full screen on click
data/
  site.ts           all copy
```

## Design notes

- Black editorial canvas with a custom half-dark, half-light sun mark.
- A CSS 3D glass object follows the cursor and cycles through three themes on click.
- The sun mark switches between persistent light and dark themes.
- A soft cursor lens reveals the opposite theme and inverts the text beneath it.
- Space Grotesk is used for display, Manrope for body copy and IBM Plex Mono for navigation.
- Institutional lockups are compact and sit above the relevant education/work item.
- Motion is disabled for coarse pointers and reduced under `prefers-reduced-motion`.

## Adding a book

1. Drop the cover in `public/books/` (a 2:3 jpg, around 760px wide is plenty).
2. Add an entry to `books` in `data/site.ts` with the title, author, cover path
   and the cover's real pixel dimensions.

An entry without a `cover` still works. It renders as a typographic spine, so you
can list a book before you find a good image of it.

## Adding a page

1. Add an entry to `nav` in `data/site.ts` (label, href).
2. Create `app/<href>/page.tsx`, copy the shape of `app/work/page.tsx`.
