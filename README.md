# Open Ocean

Open Ocean is an interactive browser-based dashboard for exploring ocean destinations. A location-scoped view surfaces weather snapshots, sea turtle migration and nesting data, whale-watching forecasts, hurricane risk outlooks, and curated travel tips.

Data is currently local mock data; the `locations` array and forecast helpers in `src/App.tsx` are the swap-in points for a live marine, weather, or conservation API backend.

## Getting started

```bash
pnpm install
pnpm run dev      # dev server at http://localhost:5173
pnpm run build    # production build → dist/
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4

## Deploy

Static Vite build. On Vercel:

- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

Or from the CLI:

```bash
pnpm build
vercel --prod
```
