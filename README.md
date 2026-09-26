# Daqn Plus Salon

Bilingual (English / Arabic) website for Daqn Plus men's grooming salon in Bisha, Saudi Arabia. Visitors book by WhatsApp or phone.

## Stack

React 19, Vite, Tailwind CSS 4, Motion. The page is prerendered at build time (`src/entry-server.tsx` + `scripts/prerender.mjs`), so `dist/index.html` contains the full page content; the browser then hydrates it.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in dist/
npm run lint     # type-check
```

## Deployment

Static site. Framework: Vite · Build command: `npm run build` · Output directory: `dist`. No environment variables are required.

Content (services, reviews, hours, phone number) is in `src/App.tsx`.
