# Yurix — portfolio

Portfolio website and admin CMS for Yurix, 2D animator and illustrator.

Next.js (App Router) · TypeScript · CSS Modules · Neon Postgres · Drizzle ORM

## Getting started

Requires Node 24.

```bash
npm install
cp .env.example .env.local   # then fill in the Neon connection strings
npm run db:check             # verify the database connection
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run db:check` | Test both database connection strings |
| `npm run db:generate` | Generate migrations from `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Drizzle Studio |

## Docs

- [CLAUDE.md](CLAUDE.md) — project brief, rules, decisions log
- [docs/phases/](docs/phases/) — plan for each phase
- [design/design_handoff_yurix_site/README.md](design/design_handoff_yurix_site/README.md) — design handoff (source of truth)
