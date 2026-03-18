# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the monorepo root using `bun`.

```bash
# Dev servers
bun run web:dev          # Vite dev server (http://localhost:5173)
bun run api:dev          # Bun/Elysia API with --watch (http://localhost:3000)
bun run extension:dev    # Browser extension (WXT)

# Linting / formatting (Biome)
bun run lint             # Check only
bun run check            # Check + auto-fix + format

# API database
bun --filter api db:generate   # Generate Drizzle migration files
bun --filter api db:migrate    # Run pending migrations
bun --filter api db:studio     # Open Drizzle Studio UI

# Testing
bun run test:api         # Run API tests (requires running test DB)
bun run test:db:up       # Start test Postgres via Docker
bun run test:db:down     # Stop test Postgres
bun run test:ci          # Full CI sequence: up → test → down

# Web e2e
bun --filter web test:e2e       # Playwright headless
bun --filter web test:e2e:ui    # Playwright with UI

# Docker (uses apps/api/.env)
bun run docker:db        # Start only the Postgres container
bun run docker:up        # Start full stack (api + db)
bun run docker:down      # Stop full stack
```

API environment variables (copy `apps/api/.env.example` → `apps/api/.env`):
- `DATABASE_URL`, `JWT_SECRET`, `API_URL`, `FRONTEND_WEB_URL`, `DB_DATA_PATH`

## Architecture

### Monorepo layout

```
my-time/
├── apps/
│   ├── api/        — Bun + Elysia REST API
│   ├── web/        — React + Vite SPA
│   └── extension/  — Browser extension (WXT + React)
└── contracts/      — Shared Zod schemas (source of truth for API shapes)
```

Package manager: **bun** with workspaces. Linter/formatter: **Biome** (no ESLint, no Prettier).

### Date & time

Always use **`date-fns`** (installed in both `apps/api` and `apps/web`) for any date/time formatting, parsing, comparison, or manipulation. Never use raw `Date` methods like `toLocaleDateString` or `toLocaleTimeString`.

### contracts package — the API contract layer

`contracts/` is a shared package imported by both `api` and `web`. It exports Zod schemas and TypeScript types for every API request/response shape. **Never duplicate schema definitions** — always define them in `contracts/src/features/<feature>/` and import from there.

### api — Elysia + Drizzle

- **Entry:** `src/index.ts` → connects DB, starts server.
- **App:** `src/app.ts` — mounts all plugins under `/api/v1`, exports `App` type and `type { App }` via `src/public.ts`.
- **Feature structure:** `src/features/<feature>/routes.ts` (Elysia plugin), `service.ts`, `repository.ts`, `schemas.ts`.
- **Schemas in routes** use Elysia's `t` (TypeBox) for runtime validation; business schemas live in `contracts/`.
- **DB:** Drizzle ORM with Postgres (`src/db/`). Schema files in `src/db/schema/`. Always generate + run migrations after schema changes.
- **Auth:** JWT access tokens (15 min) + refresh tokens (7 days) stored in `refresh_tokens` table. `/auth/me` validates the Bearer token on every dashboard load.
- **Path aliases** (tsconfig): `@db`, `@features/*`, `@shared/*`, `@/*` → `src/*`.

### web — React + TanStack Router + Tailwind v4

- **Routing:** File-based via TanStack Router. `src/routeTree.gen.ts` is **auto-generated** — do not edit manually; it regenerates on `dev` startup. Route files live in `src/routes/`.
- **Dashboard layout:** `src/routes/dashboard.tsx` — sidebar + `<Outlet>`. Add new nav items to `NAV_ITEMS` and create the route file in `src/routes/dashboard/`.
- **API client:** `src/shared/lib/api.ts` — Eden Treaty typed client (`treaty<App>`). The `App` type is imported from `@my-time/api` (the api package's public export). This gives end-to-end type safety with zero code generation.
- **Auth guard:** `dashboard.tsx` `beforeLoad` calls `api.auth.me.get()` and redirects to login on failure. Tokens stored via `src/shared/lib/token-storage.ts`.
- **UI components:** Shadcn-style components in `src/components/ui/` (Button, Input, Card, etc.). Use these before reaching for raw HTML.
- **Styling:** Tailwind v4 with CSS variables. Use design tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) to stay consistent with the design system.
- **Path alias:** `@/` → `src/`.

### How to add a new feature end-to-end

1. **Schema:** Add Zod schema(s) to `contracts/src/features/<feature>/`.
2. **API route:** Create `apps/api/src/features/<feature>/routes.ts` as an Elysia plugin, wire it into `apps/api/src/app.ts`.
3. **DB (if needed):** Add Drizzle table to `apps/api/src/db/schema/`, run `db:generate` + `db:migrate`.
4. **Web page:** Create `apps/web/src/routes/dashboard/<feature>.tsx`. Add nav item in `apps/web/src/routes/dashboard.tsx`. The route tree regenerates automatically on next `dev` run.
5. **API calls:** Use `api.<resource>.<method>()` from the Eden Treaty client — types flow automatically from the `App` type.