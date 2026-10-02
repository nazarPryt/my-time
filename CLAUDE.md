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

API environment variables — get a working local `.env` in one step (see
`docs/secrets-sops-age-setup.md`; requires your age key to be a recipient
in `.sops.yaml`):
```bash
bun --filter api secrets:decrypt:dev > apps/api/.env
```
Falling back to `apps/api/.env.example` and filling values by hand is only
needed if you don't have SOPS/age set up yet:
- `DATABASE_URL`, `JWT_SECRET`, `API_URL`, `FRONTEND_WEB_URL`, `DB_DATA_PATH`
- `LOG_LEVEL` (optional, defaults to `info`)

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

### Logging

The API uses **`pino`** (`apps/api/src/shared/logger.ts`) for all logging — never `console.log`/`console.error` outside `shared/api-config.ts` (which runs before the logger can be constructed). Logs are structured JSON in production, pretty-printed in development (`NODE_ENV`-driven). `httpLoggerPlugin` (`apps/api/src/shared/http-logger.ts`), mounted first in `app.ts`, logs one line per request (method, path, status, duration, request id) and logs uncaught errors; log business events (e.g. user registered) from the service layer, not routes. On the VPS, `docker-compose.prod.yml` ships every container's logs into **Loki** via **Promtail**, viewable/searchable in **Grafana** (`http://<host>:3001`) — all self-hosted and free. Configs live in `observability/`.

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

**Architecture: Feature-Sliced Design (FSD).** `src/` is organised into layers, and
**imports may only point down the stack** — never upward, never sideways between
slices of the same layer. Boundaries are enforced by Biome (`noRestrictedImports`
overrides in `biome.jsonc`), so violations fail `lint`/CI.

```
app       src/app/     routing, providers, layout wiring (e.g. app/ui/dashboard-shell.tsx)
  ↓
pages     src/pages/   one screen each; composes features + shared
  ↓
features  src/features/ one capability each: ui/ → model/ → api/ (+ lib/), one index.ts barrel
  ↓
shared    src/shared/  design system (shared/ui), api client, utils, config — depends on nothing
```

Rules: import a slice only through its `index.ts` barrel (`@/features/<name>`), never
its internal `ui/model/api` files. Reach your own slice's files with relative imports.
To share code between two slices, move it *down* a layer, don't import sideways.

- **Routing:** File-based via TanStack Router. Route files live in `src/app/routes/`;
  `src/app/routeTree.gen.ts` is **auto-generated** (do not edit; configured in
  `vite.config.ts` via `routesDirectory`/`generatedRouteTree`). A route file is thin:
  it renders a page — `createFileRoute(...)({ component: XPage })`.
- **Dashboard layout:** `src/app/ui/dashboard-shell.tsx` (`DashboardShell`) holds the
  sidebar + mobile nav; the layout route `src/app/routes/dashboard.tsx` renders
  `<DashboardShell><Outlet/></DashboardShell>`. Add nav items to `NAV_ITEMS` in the shell.
- **API client:** `src/shared/lib/api.ts` — Eden Treaty typed client (`treaty<App>`). The `App` type is imported from `@my-time/api` (the api package's public export). This gives end-to-end type safety with zero code generation.
- **Auth guard:** `dashboard.tsx` `beforeLoad` calls `fetchMe()` (`@/features/auth/shared/api`) and redirects to login on failure. Tokens stored via `src/shared/lib/token-storage.ts`.
- **UI components:** Shadcn-style components in `src/shared/ui/` (Button, Input, Card, etc.). Use these before reaching for raw HTML.
- **Styling:** Tailwind v4 with CSS variables. Use design tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) to stay consistent with the design system.
- **Path alias:** `@/` → `src/`.

### How to add a new feature end-to-end

1. **Schema:** Add Zod schema(s) to `contracts/src/features/<feature>/`.
2. **API route:** Create `apps/api/src/features/<feature>/routes.ts` as an Elysia plugin, wire it into `apps/api/src/app.ts`.
3. **DB (if needed):** Add Drizzle table to `apps/api/src/db/schema/`, run `db:generate` + `db:migrate`.
4. **Web feature:** Create `apps/web/src/features/<feature>/` with `ui/`, `model/`, `api/` segments and an `index.ts` barrel (copy an existing slice like `time-tracker`).
5. **Web page:** Create `apps/web/src/pages/<feature>/ui/<Feature>Page.tsx` + `index.ts`, composing the feature's barrel. Add a thin route in `apps/web/src/app/routes/dashboard/<feature>.tsx` that renders the page, and a nav item to `NAV_ITEMS` in `src/app/ui/dashboard-shell.tsx`. The route tree regenerates on next `dev` run.
6. **API calls:** Use `api.<resource>.<method>()` from the Eden Treaty client (`@/shared/lib/api`) inside the feature's `api/` segment — types flow automatically from the `App` type.