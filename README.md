# Dario Moscatello — Interactive Portfolio

Single-screen interactive portfolio built with Next.js.

## Run locally

```bash
npm install
npm run dev
```

## Production check

```bash
npm run build
```

## Important when replacing an older version

Replace the old project contents instead of merging folders. The current interface is intentionally a single interactive experience under `app/page.tsx`; old route files such as `app/education/page.tsx`, `app/work/page.tsx`, `app/projects/page.tsx`, `app/readings/page.tsx`, and `app/more/page.tsx` are no longer part of the frontend.

`Entry.brand` remains optional in `data/site.ts` only for backwards compatibility, so a stale earlier component referencing `item.brand` will not fail TypeScript compilation while the old files are being removed.
