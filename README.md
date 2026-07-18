# GreenQuote

Lean Next.js + Postgres app for the Cloover Full-Stack Coding Challenge: solar financing pre-qualification (quotes, offers, roles).

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

## Config (12-factor)

Config comes from environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Docker Compose Postgres |
| `SESSION_SECRET` | HMAC secret for the httpOnly session cookie |

## Database

- Schema: `database/schema.sql` (`users`, `quotes`)
- Seed: `database/seed.ts` (reapplies schema, inserts admin/user + sample quotes)
- No separate migration runner — seed is the local reset path

## Design decisions

- **Cookie sessions** — signed httpOnly cookie (`gq_session`); ownership and admin checks enforced in services/API, not only in the UI
- **Pricing on the server** — `src/lib/pricing.ts` computes system price, risk band A/B/C, and 5/10/15-year offers; clients never invent offers
- **Same-page quote create** — `/quotes/new` posts then shows `QuotesDetail`; persistent detail also at `/quotes/[id]`
- **Lists** — `/quotes` shows the current user’s quotes; `/admin/quotes` is admin-only and lists all quotes (server-side role check)
- **Observability** — JSON structured logs for API request/response/error (`src/lib/logger.ts`); browser axios client uses the same shape via `apiLogger`

## Frontend API client

Browser-only Axios client at `src/lib/api` (`withCredentials` for session cookies):

- Structured request/response/error logging
- Retries network errors, `5xx`, and `429` up to 3 attempts with exponential backoff (300ms → 600ms → 1200ms)
- Does not retry other `4xx`

```ts
import { apiClient } from "@/lib/api";

const { data } = await apiClient.get("/health");
```

## API reference

Interactive OpenAPI docs (Swagger UI): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
Spec file: [`public/openapi.yaml`](./public/openapi.yaml)

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/health` | no | `{ status, db }` — `503` if DB unreachable |
| `POST` | `/api/auth/register` | no | `{ fullName, email, password }` → creates `user`, sets session (`201`; `409` if email taken) |
| `POST` | `/api/auth/login` | no | `{ email, password }` → sets session cookie |
| `POST` | `/api/auth/logout` | no | clears session |
| `GET` | `/api/auth/session` | yes | current session user |
| `GET` | `/api/quotes` | yes | list: own quotes for users; all quotes for admins |
| `POST` | `/api/quotes` | yes | validates, prices, persists; returns normalized quote (`201`) |
| `GET` | `/api/quotes/:id` | yes | owner or admin only |

Currency for pricing: EUR-equivalent units (`systemPrice = systemSizeKw * 1200`).

### Main UI routes

| Path | Who | Purpose |
| --- | --- | --- |
| `/` | public | Sign in |
| `/register` | public | Register |
| `/quotes` | signed-in | My quotes table |
| `/quotes/new` | signed-in | New quote form + results |
| `/quotes/[id]` | owner/admin | Quote detail |
| `/admin/quotes` | admin | All quotes (no filters yet) |
| `/api-docs` | public | OpenAPI (Swagger UI) |

## What could be improved

- **Admin quote filters** — filter `/admin/quotes` by user (dropdown and/or search by name/email), enforced server-side
- Formal DB migrations instead of reapplying `schema.sql` on seed
- Richer server middleware for auth (centralized role guards)
- Pagination for large quote lists
- E2E tests for login → quote → list flows
