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
- ESLint, Jest, GitHub Actions CI

## What’s next

- Auth (register / login / sessions)
- Quote APIs + pricing model
- Quote form, results, and admin views
