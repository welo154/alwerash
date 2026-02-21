# Alwerash

Subscription-based education platform (MENA, design/creative). Week 1 foundation.

## Run locally

```bash
cd e:\alwerash
npm install
npx prisma generate
cp .env.example .env   # then fill .env (see below)
npm run dev
```

Open **http://localhost:3000**.

## Preview the login page

1. Start the app: `npm run dev`
2. In the browser go to: **http://localhost:3000/login**
3. Use an existing user (after register or seed) or register first at **http://localhost:3000/register**.

## Checks (run from project root)

| Command | What it does |
|--------|----------------|
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` | Production build |
| `npx prisma db seed` | Seed admin user (set `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env`) |

## Env

Copy `.env.example` to `.env` and set at least:

- `DATABASE_URL`, `DIRECT_URL` (Supabase)
- `AUTH_SECRET` (e.g. `openssl rand -base64 32` or Node one-liner from .env.example)
- `AUTH_URL` (e.g. `http://localhost:3000`)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (for seed)
