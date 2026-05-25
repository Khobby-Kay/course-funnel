# Course Funnel Platform

A multi-course sales and learning platform built with Next.js. Sell programs with payment-gated checkout, per-course landing pages, admin course management, and a built-in LMS with protected video streaming.

## Features

- **Course catalog** — Homepage listing all published programs
- **Sales funnels** — Per-course landing pages with conversion-focused layout
- **Payments** — Paystack, Flutterwave, Moolre, and demo mode for local dev
- **Access control** — Students unlock `/dashboard` only after verified payment
- **Admin panel** — Create, edit, publish, and archive courses at `/admin`
- **Media uploads** — Images and lesson videos from the admin UI
- **LMS** — Module/lesson player with progress tracking and stream-only video

## Quick start

```bash
npm install
cp env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — default password `admin123` (set `ADMIN_PASSWORD` in `.env.local`).

## Environment

Copy `env.example` to `.env.local` and configure:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | App URL for payment callbacks |
| `PAYMENTS_DEMO_MODE` | `true` = simulate payments without API keys |
| `ADMIN_PASSWORD` | Admin panel login |
| `ACCESS_SECRET` | Signs student access cookies (required in production) |
| `PAYSTACK_*` / `FLUTTERWAVE_*` / `MOOLRE_*` | Payment providers |
| `NEXT_PUBLIC_SUPABASE_*` / `SUPABASE_SERVICE_ROLE_KEY` | Optional private video hosting |

## Project structure

```
src/app/              # Pages and API routes
src/components/       # UI (catalog, landing, LMS, admin)
src/lib/courses/      # Course data (JSON store + types)
src/lib/payments/     # Payment providers
src/lib/media/        # Upload storage helpers
data/courses/         # Course definitions (JSON)
public/course-media/  # Public images per course
data/course-media/    # Private lesson videos (gitignored)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Deployment

1. Set production env vars (`ACCESS_SECRET`, `ADMIN_PASSWORD`, payment keys, `NEXT_PUBLIC_APP_URL`).
2. Set `PAYMENTS_DEMO_MODE=false`.
3. Run `npm run build` && `npm run start`, or deploy to Vercel.

Course data in `data/courses/` persists on the server filesystem — use a volume or migrate to a database for scale.

## License

Private — all rights reserved.
