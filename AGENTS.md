# AGENTS.md

This file provides shared guidance to coding agents working in this repository.

## Instruction files

- `AGENTS.md` files are the single source of truth for project instructions. Update them when guidance changes; keep each `CLAUDE.md` as an import of its adjacent `AGENTS.md`.
- Before editing files in an app or package, read any `AGENTS.md` files along the path from the repository root to those files. App-specific instructions take precedence over root guidance within their scope.

## Commands

All commands run from the monorepo root using `bun`.

```bash
# Dev servers
bun run web:dev          # Vite dev server (http://localhost:5173)
bun run api:dev          # Bun/Elysia API with --watch (http://localhost:3000)
bun run extension:dev    # Browser extension (WXT)
bun run quiz:dev         # English quiz micro frontend alone (http://localhost:5174/remotes/english-quiz/)
bun run gnome-time-tracker:build   # GNOME time-tracker extension (Ubuntu / GNOME 46)
bun run gnome-time-tracker:package # Installable GNOME extension zip
bun run gnome-time-tracker:install # Package + install into the user's GNOME extensions
bun run gnome-player:build         # GNOME "Player Controls" MPRIS extension
bun run gnome-player:install       # Package + install it into the user's GNOME extensions

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
bun run test:web:e2e:extension # Packaged Chrome extension (builds automatically)
bun run test:web:e2e:integration # Real API + desktop controller + disposable Postgres
bun --filter web typecheck:e2e # Browser and integration test types

# Docker (uses apps/api/.env)
bun run docker:db        # Start only the Postgres container
bun run docker:up        # Start full stack (api + db)
bun run docker:down      # Stop full stack
```

Environment variables — `bun run dev` runs `scripts/ensure-env.sh`, which
decrypts any missing `apps/api/.env` and `apps/web/.env` from their
`.env.development.enc` (see `docs/secrets-sops-age-setup.md`; requires your
age key to be a recipient in `.sops.yaml`). To do it by hand:
```bash
bun --filter api secrets:decrypt:dev > apps/api/.env
bun --filter web secrets:decrypt:dev > apps/web/.env
```
Falling back to `apps/api/.env.example` and filling values by hand is only
needed if you don't have SOPS/age set up yet:
- `DATABASE_URL`, `JWT_SECRET`, `API_URL`, `FRONTEND_WEB_URL`, `DB_DATA_PATH`
- `LOG_LEVEL` (optional, defaults to `info`)

## Before opening or updating a PR

Run `bun run ci:local` against the final changes before opening a PR or pushing
updates to it. This runs the checks in `.github/workflows/ci.yml`: frozen dependency
installation, repository lint, all CI typechecks, extension compilation/build,
API/web/shared/desktop/GNOME-player tests, browser E2E, packaged extension E2E, real cross-client
integration, and the web build. Keep the runner aligned when CI changes.

The runner checks committed `HEAD`, not the working tree: it refuses to start
while there are uncommitted or untracked changes, then creates a temporary
`git worktree` in the system temp directory (`my-time-ci-worktree`), runs
`bun install --frozen-lockfile` there and runs every step in it, so local `.env`
files, ignored build output and stale `node_modules` cannot make it pass. The
worktree is removed after a pass or an interrupt; after a failure it is kept for
its Playwright reports and removed by the next run. Bun's install cache and the
Playwright/Puppeteer browsers under `~/.cache` are shared, so the extra install
costs seconds, but builds start cold.

Preflight checks fail within about a second and list every problem with its fix:
clean tree, local `bun --version` equal to `BUN_VERSION` in `ci.yml`, a reachable
Docker daemon, free ports 3000, 3101, 3102, 5173, 5174, 5434 and 5435
(`CI=true` stops Playwright from reusing a running dev server), Chromium for
Playwright and Puppeteer, and `glib-compile-schemas`/`gsettings`. Use
`bun apps/web/node_modules/@playwright/test/cli.js install --with-deps chromium` to prepare
Playwright. The runner supplies the required test API URL and uses a disposable
API-test database (compose project `my-time-ci`, port 5435); cross-client
integration uses `my-time-e2e` on port 5434. Leftovers of both projects are
removed before a run, and Ctrl+C/SIGTERM stops the current step, removes the
databases and the worktree, and exits non-zero. After the production image build
it runs `docker image prune -f` (dangling images only); prune the build cache by
hand with `bun run docker:prune` (cache older than 7 days).

In a terminal it shows a live step list with durations and an ETA from the
previous run (`~/.cache/my-time-ci/timings.json`); each step's output goes to
`my-time-ci-logs` in the temp directory, and a failure prints the step's last
60 lines. `--plain` (or a non-TTY) streams the raw output instead.

Fix failures and rerun before creating or updating the PR. Do not substitute
partial checks or remote CI for this local gate. If a prerequisite prevents the
full run, report the exact blocker and leave PR creation/push pending until it
is resolved or the user explicitly authorizes an exception. Never claim unrun
checks passed. Re-run after code changes; documentation-only changes may reuse
results when they do not affect executable checks.

## Releasing

One product version lives in the root `package.json` (SemVer, tags `vX.Y.Z`).
The browser extension (`EXTENSION_VERSION`) and GNOME extension keep their own
versions for their update prompts.

- Feature branches are merged into `dev` locally by the maintainer
  (`git merge`, never squash; `--no-ff` keeps each feature grouped). Write
  commits as Conventional Commits (`feat: …`, `fix: …`); they drive the
  version bump and draft notes. Do not bump the version on feature branches.
  The only PR is the release PR `dev → main`.
- To release, on `dev` run `bun run release` (or `bun run release minor`,
  `--dry-run` to preview). It reads commits since `v<current version>`,
  picks the bump (`feat!`/`BREAKING CHANGE` → major, `feat` → minor,
  `fix`/`perf` → patch), updates `package.json`, and drafts an entry in
  `packages/contracts/src/features/releases/release-notes.data.ts`. Reword that entry
  for users, commit `chore(release): vX.Y.Z`, then open the PR `dev → main`.
  Agents follow the `release` skill (`.agents/skills/release/SKILL.md`) for
  the whole release, notes and the `dev → main` PR included.
- CI's `Release version` job (`bun run release:check`) fails a PR into main
  whose version isn't newer than main's or lacks a newest notes entry.
- After the merge passes CI on main, `.github/workflows/release.yml` creates
  the tag and GitHub Release, then fast-forwards `dev` to `main` so it gets
  the PR's merge commit. Pull `dev` locally afterwards. If `dev` gained
  commits meanwhile, the job only warns; merge `main` into `dev` by hand.
- The web app shows the version (Vite `__APP_VERSION__`) in the sidebar; a
  "What's new" dot appears until the user opens the notes, tracked per user in
  `users.last_seen_release_version` via `/releases/seen`.

## Code style

One style guide for the whole monorepo (api, web, extension, mobile, desktop,
packages, contracts, scripts). App-level `AGENTS.md` files may add rules but
must not contradict these.

### File and folder naming — kebab-case

- Every source file (`.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`) and every
  folder is **kebab-case**, whatever it exports. Identifiers inside keep normal
  TypeScript casing:
  - `dashboard-pending.tsx` → `export function DashboardPending`
  - `use-rest-timer.ts` → `export function useRestTimer`
  - `test-ids.ts` → `export const WORKOUT_TEST_IDS`
  - `helpers/build-day-range/build-day-range.ts` → `export function buildDayRange`
- Extra dot segments describe the file's role and are fine:
  `workout.locators.ts`, `build-day-range.test.ts`, `vite.config.ts`.
- Framework-mandated names are exempt: TanStack Router (`__root.tsx`,
  `time-tracker_.desktop.tsx`, generated `routeTree.gen.ts`), Expo Router
  (`_layout.tsx`, `(auth)/` groups), and `__tests__/` folders.
- Biome's `useFilenamingConvention` (root `biome.jsonc`) enforces file names, so a
  PascalCase or camelCase file fails `lint:check`/CI. Biome does not check folder
  names; keep them kebab-case by hand and in review.

## Architecture

### Monorepo layout

```
my-time/
├── apps/
│   ├── api/        — Bun + Elysia REST API
│   ├── web/        — React + Vite SPA
│   ├── english-quiz/ — Vue micro frontend loaded by web at runtime (see below)
│   └── extensions/
│       ├── browser/ — Browser extension (WXT + React; package `extension`)
│       └── gnome/  — GNOME Shell extensions (time-tracker/, player/ = MPRIS Player Controls)
└── packages/
    ├── contracts/        — @my-time/contracts: Zod schemas for every API shape
    ├── client-features/  — @my-time/client-features: client code shared by web + mobile
    ├── session-sync/     — @my-time/session-sync: SSE sync logic shared by web + desktop
    └── micro-frontends/  — @my-time/micro-frontends: host ↔ remote mount contract
```

Shared packages are named `@my-time/<folder>`. Keep them separate; each has
one job and its own dependencies:

- `contracts` sits at the bottom of the graph (only `zod`, `date-fns`) and is
  imported by every app, including the API. Put only data shapes there, never
  runtime client logic.
- `client-features` imports the API's `App` type, so it can never live in
  `contracts` (that would make `api → contracts → api` a cycle).
- `session-sync` is runtime behaviour (reconnects, timers), not a shape.
- `micro-frontends` describes the frontend ↔ frontend boundary and needs DOM
  types, which `api` and `desktop` do not have.

Package manager: **bun** with workspaces. Linter/formatter: **Biome** (no ESLint, no Prettier).

### Shared session synchronization

`packages/session-sync` contains runtime-independent SSE parsing, reconnect
backoff, reconnect loop, connection state, and revision/lifecycle guards reused
by web and desktop. Use confirmed SSE state before commands while connected; fetch current
state when disconnected. Keep fetch/Soup, token storage, UI, and timers in their
client adapters. Keep React synchronization hooks as thin lifecycle adapters;
separate browser listeners, command handlers, and per-mount summary queues.
Do not duplicate shared rules in either client.

### Micro frontends

`apps/english-quiz` is a Vue app loaded into `apps/web` at runtime through
the Module Federation runtime. Full guide: `docs/micro-frontends.md`.

- Host and remote share only `packages/micro-frontends` (framework-agnostic
  `mount(el, props) → { update, unmount }`, props, events, contract version).
  Never import across `apps/web` ↔ `apps/english-quiz`.
- Remotes are served same-origin under `/remotes/<name>/`: Vite proxy in dev,
  `apps/web/nginx.conf` in production. Keep remote `base`, nginx paths and
  proxies in sync.
- The host loads remotes with `loadRemoteModule` and renders them with
  `<RemoteApp>` (`apps/web/src/shared/lib/micro-frontends`), which handles
  loading, errors/retry and lifecycle. A remote failure must never break the
  rest of the dashboard.
- Remotes render inside Shadow DOM and style themselves with the host's CSS
  variables.
- Remotes reach the API only through the host's `apiFetch` prop (the host adds
  the origin, token and refresh); request/response shapes still come from
  `@my-time/contracts`.

### Date & time

Always use **`date-fns`** (installed in both `apps/api` and `apps/web`) for any date/time formatting, parsing, comparison, or manipulation. Never use raw `Date` methods like `toLocaleDateString` or `toLocaleTimeString`.

### Logging

The API uses **`pino`** (`apps/api/src/shared/logger.ts`) for all logging — never `console.log`/`console.error` outside `shared/api-config.ts` (which runs before the logger can be constructed). Logs are structured JSON in production, pretty-printed in development (`NODE_ENV`-driven). `httpLoggerPlugin` (`apps/api/src/shared/http-logger.ts`), mounted first in `app.ts`, logs one line per request (method, path, status, duration, request id) and logs uncaught errors; log business events (e.g. user registered) from the service layer, not routes. On the VPS, `docker-compose.prod.yml` ships every container's logs into **Loki** via **Grafana Alloy**, viewable/searchable in **Grafana** (`http://<host>:3001`) — all self-hosted and free. Configs live in `observability/`. Dashboards are provisioned from `observability/grafana/provisioning/dashboards/*.json` (read-only in the UI), so edit the JSON and keep its queries in sync with the http-logger fields and logged messages.

### @my-time/contracts — the API contract layer

`packages/contracts/` is a shared package imported by both `api` and `web`. It exports Zod schemas and TypeScript types for every API request/response shape. **Never duplicate schema definitions** — always define them in `packages/contracts/src/features/<feature>/` and import from there.

### api — Elysia + Drizzle

- **Entry:** `src/index.ts` → connects DB, starts server.
- **App:** `src/app.ts` — mounts all plugins under `/api/v1`, exports `App` type and `type { App }` via `src/public.ts`.
- **Feature structure:** `src/features/<feature>/routes.ts` (Elysia plugin), `service.ts`, `repository.ts`, `schemas.ts`.
- **Schemas in routes** use Elysia's `t` (TypeBox) for runtime validation; business schemas live in `packages/contracts/`.
- **DB:** Drizzle ORM with Postgres (`src/db/`). Schema files in `src/db/schema/`. Always generate + run migrations after schema changes.
- **Auth:** JWT access tokens (15 min) + refresh tokens (7 days) stored in `refresh_tokens` table. `/auth/me` validates the Bearer token on every dashboard load.
- **Path aliases** (tsconfig): `@db`, `@features/*`, `@shared/*`, `@/*` → `src/*`.

### web — React + TanStack Router + Tailwind v4

Web environment variables are validated with Zod during Vite startup/build and
in the browser using `src/shared/config/web-env.ts`. Set `VITE_API_URL` in
`apps/web/.env` (copy `.env.example` for local development) or the build environment.
Missing or invalid values fail the build; the extension store URL remains
optional. Extension download filenames are fixed constants in `contracts`.

**Architecture: Feature-Sliced Design (FSD).** `src/` is organised into layers, and
**imports may only point down the stack** — never upward, never sideways between
slices of the same layer. Boundaries are enforced by Biome (`noRestrictedImports`
overrides in `biome.jsonc`), so violations fail `lint`/CI.

```
app       src/app/     routing, providers, layout wiring (e.g. app/ui/dashboard-shell/)
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
- **Dashboard layout:** `src/app/ui/dashboard-shell/` (`DashboardShell`, one component per file) holds the
  sidebar + mobile nav; the layout route `src/app/routes/dashboard.tsx` renders
  `<DashboardShell><Outlet/></DashboardShell>`. Add nav items to `NAV_ITEMS` in `dashboard-shell/nav-items.ts`.
- **API client:** `src/shared/lib/api.ts` — Eden Treaty typed client (`treaty<App>`). The `App` type is imported from `@my-time/api` (the api package's public export). This gives end-to-end type safety with zero code generation.
- **Time-tracker synchronization:** The feature receives session snapshots from
  `/time-tracker/events` through an authenticated fetch SSE stream. Reuse the
  shared token-refresh handler; streaming requests time out connection setup,
  not the entire response body. Refresh today's summary on changes/reconnects
  and at server midnight, and keep elapsed ticks local. Use backend-computed
  timer snapshots and shared display projection; the API server timezone defines
  daily accounting and sessions are split at day boundaries. Do not poll unchanged
  session state. Cancel streams on unmount and guard delayed mutation/summary
  responses against newer snapshots. Desktop availability is account-wide and
  comes from `desktop-presence` events on the same SSE stream; do not infer it
  from browser storage or successful pairing. Presence events must not trigger
  work-session or summary refreshes.
- **Auth guard:** `dashboard.tsx` `beforeLoad` calls `fetchMe()` (`@/features/auth/shared/api`) and redirects to login on failure. Tokens stored via `src/shared/lib/token-storage.ts`.
- **UI components:** Shadcn-style components in `src/shared/ui/` (Button, Input, Card, etc.). Use these before reaching for raw HTML.
- **Styling:** Tailwind v4 with CSS variables. Use design tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) to stay consistent with the design system.
- **Path alias:** `@/` → `src/`.

### How to add a new feature end-to-end

1. **Schema:** Add Zod schema(s) to `packages/contracts/src/features/<feature>/`.
2. **API route:** Create `apps/api/src/features/<feature>/routes.ts` as an Elysia plugin, wire it into `apps/api/src/app.ts`.
3. **DB (if needed):** Add Drizzle table to `apps/api/src/db/schema/`, run `db:generate` + `db:migrate`.
4. **Web feature:** Create `apps/web/src/features/<feature>/` with `ui/`, `model/`, `api/` segments and an `index.ts` barrel (copy an existing slice like `time-tracker`).
5. **Web page:** Create `apps/web/src/pages/<feature>/ui/<Feature>Page.tsx` + `index.ts`, composing the feature's barrel. Add a thin route in `apps/web/src/app/routes/dashboard/<feature>.tsx` that renders the page, and a nav item to `NAV_ITEMS` in `src/app/ui/dashboard-shell/nav-items.ts`. The route tree regenerates on next `dev` run.
6. **API calls:** Use `api.<resource>.<method>()` from the Eden Treaty client (`@/shared/lib/api`) inside the feature's `api/` segment — types flow automatically from the `App` type.
