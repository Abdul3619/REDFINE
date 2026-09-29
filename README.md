# RedFine

I built this bilingual (English / Arabic) website for RedFine, a demo men's grooming atelier. Visitors can browse services with prices and durations, compare membership plans and request an appointment online.

RedFine is a fictional brand for portfolio purposes: prices, memberships and reviews are illustrative and labelled as such on the page.

## Stack

React 19, Vite, Tailwind CSS 4, Motion, Supabase. The page is prerendered at build time (`src/entry-server.tsx` + `scripts/prerender.mjs`), so `dist/index.html` contains the full page content; the browser then hydrates it.

## Booking requests

The booking form saves requests to the `redfine_bookings` table in Supabase (see `supabase/migrations/20260929120000_redfine_bookings.sql`). The site's public key can only call `submit_redfine_booking()`, which validates the input and applies a rate limit; it cannot read bookings. View requests in the Supabase table editor.

The form keeps a draft in the visitor's browser (localStorage) until it is sent, and shows the confirmation straight away while the request is sent in the background. If sending fails, the form comes back with the visitor's details and an error.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in dist/
npm run lint     # type-check
```

## Deployment

Static site. Framework: Vite · Build command: `npm run build` · Output directory: `dist`.

Optional environment variables (the defaults point at the portfolio's Supabase project): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

## Content

- Text in both languages, services, prices and memberships: `src/data/content.ts`
- WhatsApp number (empty = share mode) and image helpers: `src/data/site.ts`
