# Busla (بوصلة): University & Career Discovery Day

Landing site for **Busla**, a one-day university and career discovery event at Seven Pillars School, New Administrative Capital, Cairo.

- **Next.js 15 (App Router)**, Tailwind CSS v4, Motion (Framer Motion) and Lenis smooth scroll
- **Supabase** stores registrations, contact messages and (optionally) mentor chats
- **Compass**, an AI mentor chat built on Claude, suggests majors and Busla activities. It falls back to a built-in rule-based guide when no API key is set.
- **/admin** organizer dashboard (password protected) with CSV export

## Sections

Hero with an interactive compass (the needle follows your cursor) and a live countdown · major marquee · About and animated stats · audience cards · pinned horizontal-scroll activity zones · AI mentor intro · schedule filtered by track · speakers · partner call-out · registration with an instant ticket code and calendar download · FAQ · venue map and directions · contact form · footer.

## Edit content

Event copy lives in `src/lib/event.ts`: date, venue, activities, schedule, speakers, FAQ and form options. The mentor's knowledge comes from the same file, so it stays in sync. The list of majors is in `src/lib/mentor.ts`.

## Local setup

```bash
cd busla
npm install
cp .env.example .env.local   # then fill it in
npm run dev
```

### Supabase

1. Create a project at supabase.com.
2. Open **SQL Editor** and run `supabase/migrations/0001_busla_init.sql`. If you use the Supabase CLI, run `supabase db push` instead.
3. Copy **Project URL** and the **service_role** key into `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

All tables have RLS enabled with no public policies. The browser never talks to Supabase directly; the API routes use the service role key on the server.

### AI mentor

Set `ANTHROPIC_API_KEY` to turn on the Claude-powered mentor. It uses `claude-opus-5-5` by default; set `BUSLA_MENTOR_MODEL` to override. Leave the key empty and the mentor still answers with the rule-based recommender.

`BUSLA_LOG_CHATS=true` saves conversations to `mentor_messages`. It's off by default because most users are minors, so only turn it on if your privacy notice covers it.

## Deploy on Vercel

1. Import the repo in Vercel and set **Root Directory** to `busla`.
2. Add the environment variables from `.env.example`.
3. Deploy. `NEXT_PUBLIC_SITE_URL` should be your production URL.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (type-checks and lints) |
| `npm run typecheck` | TypeScript only |
