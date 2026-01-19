# Backend (placeholder)

Minimal Node backend provided in this folder.

## Endpoints
- POST /api/subscribe `{ email, seriesTitle }`
- POST /api/unsubscribe `{ email, seriesTitle }`
- POST /api/notify `{ subject?, body?, emails? }` (demo: logs only)
- GET /health

## Quickstart
1) `cd src/backend`
2) `npm install`
3) `npm run dev` (or `npm start`)
4) Calls are served on `http://localhost:3000` by default. Adjust `PORT` env var if needed.

## How it works
- Stores subscribers in `data/subscribers.json` (JSON file, simple demo; replace with DB or mailing provider for production).
- Validates email format lightly; dedupes on email.
- `notify` currently logs recipients; wire this to SMTP or an email API in production.

## Deployment idea
- Keep the static frontend on GitHub Pages.
- Deploy this backend to a host with Node (Fly.io/Render/Railway) and update the frontend fetch URLs accordingly (e.g., set an env/config base URL in the frontend build).
