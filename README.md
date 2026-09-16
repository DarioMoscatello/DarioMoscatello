# Dario Moscatello — interactive portfolio

A single-screen Next.js 15 portfolio rebuilt around a glass START / ESC key, an orbital navigation and a code-editor style content panel.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Interaction

- Home: click the glass **START** key, click **CLICK TO ENTER**, or press any keyboard key.
- Inside: use the five orbiting section points for Education, Work, Projects, Readings and More.
- **ABOUT** stays available on the right edge of the orbit and in the editor tab.
- Click the glass **ESC** key itself to return to the initial screen. Keyboard Escape intentionally does not close the portfolio.
- The layout has a dedicated mobile arrangement for narrow screens.

## Content

All personal information still lives in `data/site.ts`. The new interface reads from that file and does not use the previous frontend styling.

Main UI files:

- `components/PortfolioExperience.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/layout.tsx`

## Deploy

The project is compatible with Vercel's standard Next.js deployment. No custom server or environment variables are required.
