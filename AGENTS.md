# AGENTS.md — Iman Homes

Instructions for any AI agent (or human) picking up this repo. Read
this first, then the doc that matches what you're about to do:

| Doc | Read it when you're about to... |
|---|---|
| [PRD.md](PRD.md) | understand what the product is and who it's for |
| [ARCHITECTURE.md](ARCHITECTURE.md) | touch data flow, Supabase, routing, or the admin panel |
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | write or change UI |
| [RULES.md](RULES.md) | commit, deploy, or do anything data-related |
| [TASKS.md](TASKS.md) | see what's done and what's open |
| [MEMORY.md](MEMORY.md) | understand why something is the way it is before changing it |

## Setup

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev            # http://localhost:5173
```

`.env` is gitignored and holds live Supabase project credentials — never
commit it, never print its contents.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build — must be clean before every commit
npm test           # vitest run (alias: npx vitest run)
npx vitest run <path/to/file.test.tsx>   # run one test file
npm run preview   # serve the production build locally
```

## Deploy

```bash
git add <specific files>      # never -A
git commit -m "..."           # ends with the Co-Authored-By trailer — see RULES.md
git push origin master
netlify deploy --prod --dir=dist
```

Site: https://imanhomes.com (Netlify: https://rent-dhaka.netlify.app) · GitHub:
https://github.com/NiazData/Rent-Dhaka

## Database changes

Write new migrations under `supabase/migrations/NNNN_description.sql`
(see the two existing files for the pattern: `create table`/`alter
table ... enable row level security`/`create policy`, all written to be
safely re-runnable). You cannot execute these yourself — hand the file
to the project owner to run in the Supabase SQL Editor, then verify
with a REST call against `VITE_SUPABASE_URL` using the anon key.

## Before calling anything done

1. `npm test` — full suite green.
2. `npm run build` — clean, no TypeScript errors.
3. If the change has visible UI/content impact, show it on
   `localhost:5173` and get explicit confirmation before pushing
   (exception: a live production bug fix — see RULES.md).
