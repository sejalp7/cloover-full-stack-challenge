# GreenQuote

Lean Next.js + Postgres boilerplate for the Cloover Full-Stack Coding Challenge.

## Prerequisites

- Node.js 20+
- Docker / Docker Compose

Postgres is exposed on host port **5433** (avoids clashing with a local 5432 instance).

## Setup

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### Seed accounts (local only)

| Email | Password | Role |
| --- | --- | --- |
| `admin@test.com` | `admin123` | admin |
| `user@test.com` | `user123` | user |

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` / `start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run test` / `test:ci` | Jest (watch / CI) |
| `npm run db:up` / `db:down` | Start / stop Postgres |
| `npm run db:seed` | Apply schema + seed data |
| `npm run db:setup` | `db:up` then seed |

## What’s included

- Next.js App Router shell with SCSS
- Docker Postgres, `users` / `quotes` schema, seed script
- Quote pricing model + APIs (`/api/health`, `POST /api/quotes`, `GET /api/quotes/:id`)
- Cookie session login (`POST /api/auth/login`) for protected quote routes
- ESLint, Jest, GitHub Actions CI

## Frontend API client

Browser-only Axios client at `src/lib/api` (`withCredentials` for session cookies):

- Request/response logging to the console
- Retries network errors, `5xx`, and `429` up to 3 attempts with exponential backoff (300ms → 600ms → 1200ms)
- Does not retry other `4xx`

```ts
import { apiClient } from "@/lib/api";

const { data } = await apiClient.get("/health");
```


| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/health` | no | `{ status, db }` |
| `POST` | `/api/auth/login` | no | `{ email, password }` → sets session cookie |
| `POST` | `/api/quotes` | yes | validates, prices, persists, returns normalized quote |
| `GET` | `/api/quotes/:id` | yes | owner or admin only |

Currency for pricing: EUR-equivalent units (`systemPrice = systemSizeKw * 1200`).

## What’s next

- Registration UI + quote form / results / admin views
- `GET /api/quotes` list endpoint
