# Web app restructure — Feature-Sliced Design (FSD) migration plan

**Status:** ✅ COMPLETE — Phase 0 · 1 · 2 · 3 · 4 all done. `app → pages → features →
shared` with strictly downward imports, enforced by Biome. App + e2e typecheck, build,
and lint all green.

Phase 4 done:
- **Biome import-boundary rules** added to `biome.jsonc` (`noRestrictedImports`
  overrides, scoped to `apps/web/src/`), enforced by `lint`/CI:
  - `shared/` may not import app/pages/features
  - `features/` may import shared only (no app, pages, or another feature)
  - `pages/` may not import app or another page; features only via their barrel
  - `app/` may import anything below but features only via their barrel
  Verified: each rule fires on a deliberate violation; current code is clean.
- **Fixed a suppression regression:** the shadcn a11y override targeted
  `**/components/ui/**`, which the Phase 1 move broke — retargeted to `**/shared/ui/**`.
  (Those 5 "pre-existing" warnings were suppressed all along; the glob just went stale.)
- **Fixed `tsconfig.e2e.json`** — removed the TS7-invalid `baseUrl`; e2e typecheck now
  passes, which also confirms the Phase 3 e2e import repairs resolve.
- **Updated `CLAUDE.md`** web section (layers + rules) and the add-a-feature recipe.

> **Pre-existing issue found (not caused by this migration), fix separately:**
> `apps/web/tsconfig.e2e.json` still sets `baseUrl`, which TS7 removed, so
> `tsc -p tsconfig.e2e.json` fails before it can check anything. `tsconfig.app.json`
> was already migrated off `baseUrl`; the e2e one was missed. Part of the TS7 cleanup.
> (Playwright itself resolves `@/` via its own transpile, so tests still run.)

Phase 3 done:
- New `pages/` layer: `login`, `register`, `dashboard-home`, `workout`,
  `site-blocking`, `settings` (real composition) + thin `time-tracker`,
  `permesso-status` pass-throughs. Each is `pages/<name>/ui/<Name>Page.tsx` + barrel.
- Every route file is now ~6 lines: `createFileRoute(...)({ component: XPage })`.
  `routes/index.tsx` stays a pure redirect (routing-only, no page).
- **`DashboardShell`** (sidebar + mobile nav) extracted to `app/ui/dashboard-shell.tsx`
  — it lives in `app`, NOT `shared`, because it imports `SignOutButton` (a feature)
  and shared must never import upward. The dashboard layout route renders
  `<DashboardShell><Outlet/></DashboardShell>`.
- `dashboard` feature **dissolved**: `LiveClock`/`StatCard` → `pages/dashboard-home/ui/`;
  `DASHBOARD_TEST_IDS` → `shared/ui/testIds.ts` (needed by the app shell, the home
  page, and e2e — so it sits at the lowest common layer, shared).
- e2e locator imports repaired (they had broken on the Phase 1–2 moves; e2e is not
  in the `tsc -b` graph, so it stayed silent until now).

Phase 2 done: `feature/` → `features/`; slices `auth/login`, `auth/register`,
`auth/logout`, `site-blocking`, `time-tracker`, `workout`, `permesso` all use
`ui/model/api(/lib)` segments with a single `index.ts` public barrel; external
importers now go through the barrel, not deep paths. `LoginForm`/`RegisterForm`
extracted from their routes. `features/auth/shared/` holds `fetchMe`,
`authErrorHandler`, `testIds`. The `dashboard` "feature" (`LiveClock`/`StatCard`)
is intentionally left for Phase 3, where it dissolves into `pages/dashboard-home`.

> **Reference slice shape** (copy this for every other feature):
> ```
> features/auth/login/
>   ui/LoginForm.tsx      # presentational + calls the hook
>   model/useLogin.ts     # hook / business logic  → imports ../api/login
>   api/login.ts          # loginUser() Eden call
>   index.ts              # export * from './ui/LoginForm'  (public API only)
> features/auth/shared/   # cross-slice bits: api.ts (fetchMe), lib/authErrorHandler, testIds
> ```
> Relative-import depth differs by segment nesting: `model/useLogin.ts` reaches the
> auth-shared lib via `../../shared/lib/...`, but a still-flat slice file
> (`register/useRegister.ts`) uses `../shared/lib/...`. Watch this when moving files.

> Lint/format scripts are `bun run lint:check` and `bun run lint:fix` (root), not
> `check` — the CLAUDE.md names are stale. 5 pre-existing a11y/array-key warnings
> live in the shadcn `field.tsx`/`input-group.tsx` primitives (not introduced by
> this migration); clean up separately if desired.

> ⚠️ The `vite build`/`dev` step needs **Node 20+** (rolldown uses `node:util`'s
> `styleText`). System Node 18 fails with `does not provide an export named 'styleText'`
> — run `nvm use 22` first. `tsc -b` (typecheck) works on any version. See the
> WebStorm interpreter note in project memory.

## Goal

Restructure `apps/web/src` so that **imports flow strictly top → bottom** across
named layers. A screen (`page`) is *assembled* from `features`; a `feature` is a
self-contained capability; both stand on a `shared` foundation. Nothing ever
imports "upward" or "sideways".

## The layers (top imports from bottom, never the reverse)

```
app        routing, providers, the router entry        (framework wiring only)
  │
pages      one screen each; composes features + shared (layout & composition)
  │
features   one interactive capability each             (ui + model + api)
  │
entities   shared domain models — DEFERRED, see below  (not created yet)
  │
shared     design system, api client, utils, config    (depends on nothing)
```

**The one hard rule:** a file may only import from layers *below* its own, and
**never from a sibling in the same layer**. If two features need the same thing,
push that thing *down* (into `shared`, or later `entities`). This is what stops
spaghetti — the dependency direction alone answers "can changing X break Y?".

**Slice public API:** every feature/page folder exposes an `index.ts` barrel.
Other layers import only from the barrel (`@/features/auth/login`), never deep
(`@/features/auth/login/model/useLogin`). You can then rearrange a slice's guts
freely without breaking callers.

**Segments inside a slice** (this matches the existing `three-layer-architect`
rule UI → BLL → DAL):

```
features/<name>/
  ui/       React components (BLL boundary is the top)
  model/    hooks, stores, business logic  (BLL)
  api/      Eden Treaty calls              (DAL)
  lib/      pure helpers (optional)
  index.ts  public barrel
```

Inside a slice the same direction holds: `ui → model → api`.

## Naming convention (decide once, apply everywhere)

- **Folders** (layers, slices, segments): `kebab-case` — `site-blocking`, `time-tracker`.
- **Component files**: keep current `PascalCase` (`LoginForm.tsx`) to minimise diff.
- Barrels are always `index.ts`.

> File renames (kebab vs Pascal) are cosmetic and risky in bulk. This plan keeps
> existing file names; only *folders* and *locations* change. A file-casing sweep
> can be a separate, later pass.

---

## Target tree (end state)

```
apps/web/src/
├── app/                              # LAYER: app
│   ├── routes/                       # ← moved from src/routes (TanStack scans here)
│   │   ├── __root.tsx
│   │   ├── index.tsx                 # renders <LandingPage/>
│   │   ├── auth.tsx                  # auth layout route
│   │   ├── auth/
│   │   │   ├── login.tsx             # renders <LoginPage/>  (3 lines)
│   │   │   └── register.tsx          # renders <RegisterPage/>
│   │   ├── dashboard.tsx             # layout route: auth guard + <DashboardShell/>
│   │   ├── dashboard/
│   │   │   ├── index.tsx             # renders <DashboardHomePage/>
│   │   │   ├── workout.tsx           # renders <WorkoutPage/>
│   │   │   ├── time-tracker.tsx      # renders <TimeTrackerPage/>
│   │   │   ├── site-blocking.tsx     # renders <SiteBlockingPage/>
│   │   │   ├── permesso-status.tsx   # renders <PermessoStatusPage/>
│   │   │   └── settings.tsx          # renders <SettingsPage/>
│   │   └── test/error.tsx
│   └── routeTree.gen.ts              # ← generated here (config change)
│
├── pages/                           # LAYER: pages (NEW)
│   ├── landing/                      # from routes/index.tsx
│   ├── login/                        # from routes/auth/login.tsx
│   ├── register/                     # from routes/auth/register.tsx
│   ├── dashboard-home/               # from routes/dashboard/index.tsx (+ LiveClock/StatCard)
│   ├── workout/
│   ├── time-tracker/
│   ├── site-blocking/
│   ├── permesso-status/
│   └── settings/
│       └── each: ui/<Name>Page.tsx + index.ts
│
├── features/                        # LAYER: features (renamed from feature/)
│   ├── auth/
│   │   ├── login/    { ui/ model/ api/ index.ts }
│   │   ├── register/ { ui/ model/ api/ index.ts }
│   │   ├── logout/   { ui/ model/ api/ index.ts }
│   │   └── shared/   { api.ts (fetchMe), lib/authErrorHandler.ts, testIds.ts }
│   ├── workout/          { ui/ model/ api/ index.ts }
│   ├── time-tracker/     { ui/ model/ lib/ api/ index.ts }
│   ├── site-blocking/    { ui/ model/ api/ index.ts }
│   └── permesso/         { ui/ model/ api/ index.ts }
│
├── shared/                          # LAYER: shared
│   ├── ui/                           # ← components/ui/* (shadcn) + app-level shared UI
│   ├── lib/                          # api.ts, cn.ts, fetch-with-refresh.ts, token-storage.ts
│   └── config/                       # web-config.ts
│
└── main.tsx                          # entry (stays; conceptually app layer)
```

Notes:

- **`dashboard` feature disappears.** `LiveClock` + `StatCard` are used only by the
  home screen → they move into `pages/dashboard-home/ui/`. `DASHBOARD_TEST_IDS`
  (nav link ids) belongs with the sidebar → `app` layer or `shared`.
- **The dashboard sidebar** (`DashboardLayout`, `SidebarContent`, `Wordmark`) is a
  *layout*, not a page. It stays in `app/routes/dashboard.tsx`, or its UI extracts
  to a small `DashboardShell` component in `shared/ui` if we want the route file thin.
- **`entities/` is deliberately NOT created yet.** The one real candidate is a
  `session` model (`token-storage` + `fetchMe`/`/auth/me`). Introduce it only once a
  second feature needs it. Until then `token-storage` stays in `shared/lib` and
  `fetchMe` in `features/auth/shared`.

---

## Per-feature: before → after

### 1. auth  (`feature/auth` → `features/auth`)

Before:
```
feature/auth/
  api.ts                 # fetchMe()
  authErrorHandler.ts
  testIds.ts
  login/  { api.ts, useLogin.ts, index.ts }
  logout/ { api.ts, useLogout.ts, index.ts, ui/SignOutButton.tsx }
  register/ { api.ts, useRegister.ts, index.ts }
```
After:
```
features/auth/
  login/
    ui/LoginForm.tsx     # NEW — the <form> extracted from routes/auth/login.tsx
    model/useLogin.ts    # moved (was login/useLogin.ts)
    api/login.ts         # moved (was login/api.ts)
    index.ts             # exports LoginForm, useLogin
  register/
    ui/RegisterForm.tsx  # NEW — extracted from routes/auth/register.tsx
    model/useRegister.ts
    api/register.ts
    index.ts
  logout/
    ui/SignOutButton.tsx # moved
    model/useLogout.ts
    api/logout.ts
    index.ts
  shared/                # auth-internal shared (used by >1 auth slice)
    api.ts               # fetchMe() — session check (future: entities/session)
    lib/authErrorHandler.ts
    testIds.ts
```
Key point: today the login `<form>` lives in the route file. It moves down into
`features/auth/login/ui/LoginForm.tsx`; the page only arranges it.

### 2. workout  (`feature/workout` → `features/workout`)

Before: `api.ts, store.ts, useRestTimer.ts, testIds.ts, ui/{HeroCounter, QuickAddButtons, RestTimer, SetRow, SetsLog, WorkoutHeader, WorkoutProgressChart, index}`
After:
```
features/workout/
  ui/       (unchanged files: HeroCounter, QuickAddButtons, RestTimer, SetRow,
             SetsLog, WorkoutHeader, WorkoutProgressChart, index.ts)
  model/    store.ts, useRestTimer.ts
  api/      api.ts
  testIds.ts            # or fold into model/
  index.ts              # re-export ui + the widget the page needs
```
`WorkoutProgressChart` stays here; the dashboard-home page imports it (page→feature, allowed).

### 3. time-tracker  (`feature/time-tracker` → `features/time-tracker`)

Before: `api.ts, store.ts, utils.ts, ui/{SessionList, SessionRow, TimeProgressChart, TimeTrackerWidget, TodayStats, index}`
After:
```
features/time-tracker/
  ui/       (unchanged files)
  model/    store.ts
  lib/      utils.ts
  api/      api.ts
  index.ts
```
`TimeProgressChart` + `TimeTrackerWidget` exported for the pages that use them.

### 4. site-blocking  (`feature/site-blocking` → `features/site-blocking`)  — biggest reshuffle

Before (flat):
```
feature/site-blocking/
  api.ts, store.ts, index.ts
  blocked-site-item.tsx, extension-connect-button.tsx, site-list.tsx
  use-extension-connection.ts, use-favicon.ts
```
After:
```
features/site-blocking/
  ui/     blocked-site-item.tsx, extension-connect-button.tsx, site-list.tsx
  model/  store.ts, use-extension-connection.ts, use-favicon.ts
  api/    api.ts
  index.ts
```

### 5. permesso  (`feature/permesso` → `features/permesso`)

Before: `api.ts, store.ts, telegram-link-stream.ts, index.ts, ui/{status-card, telegram-card, schedule-editor, schedule-section, schedule-summary, practice-number-form, practice-number-section, history-section, check-history, hour-toggle, danger-zone, permesso-status-widget, index}`
After:
```
features/permesso/
  ui/     (unchanged files)
  model/  store.ts, telegram-link-stream.ts
  api/    api.ts
  index.ts
```

### 6. dashboard  (`feature/dashboard` → REMOVED)

Before: `testIds.ts, ui/{LiveClock, StatCard, index}`
After: split by ownership —
- `LiveClock`, `StatCard` → `pages/dashboard-home/ui/`
- `DASHBOARD_TEST_IDS` (nav link ids) → next to the sidebar in `app` (or `shared`).

---

## Pages layer — what each page holds

Every page is: `pages/<name>/ui/<Name>Page.tsx` + `index.ts`. The route file just
renders it.

| Page                | Source today                          | Composes (features) |
|---------------------|---------------------------------------|---------------------|
| `landing`           | `routes/index.tsx`                     | — |
| `login`             | `routes/auth/login.tsx` (form → feature)| `auth/login` |
| `register`          | `routes/auth/register.tsx`             | `auth/register` |
| `dashboard-home`    | `routes/dashboard/index.tsx`           | `time-tracker`, `workout` (+ own LiveClock/StatCard) |
| `workout`           | `routes/dashboard/workout.tsx`         | `workout` |
| `time-tracker`      | `routes/dashboard/time-tracker.tsx`    | `time-tracker` |
| `site-blocking`     | `routes/dashboard/site-blocking.tsx`   | `site-blocking` |
| `permesso-status`   | `routes/dashboard/permesso-status.tsx` | `permesso` |
| `settings`          | `routes/dashboard/settings.tsx`        | (tbd) |

Example — the login route shrinks to:
```tsx
// app/routes/auth/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/pages/login'
export const Route = createFileRoute('/auth/login')({ component: LoginPage })
```
```tsx
// pages/login/ui/LoginPage.tsx
import { AuthShell } from '@/shared/ui'
import { LoginForm } from '@/features/auth/login'
export function LoginPage() {
  return <AuthShell title="Welcome back" description="…"><LoginForm /></AuthShell>
}
```

---

## Migration order (phased, app stays working after every phase)

Each phase is independently shippable and verifiable with `bun run web:dev` +
`bun run check`.

- **Phase 0 — app layer / config only.** Set `routesDirectory: './src/app/routes'`
  and `generatedRouteTree: './src/app/routeTree.gen.ts'` in `vite.config.ts`;
  `git mv src/routes src/app/routes`; fix the `routeTree.gen` import in `main.tsx`.
  No behaviour change. *Verify boots + all routes resolve.*

- **Phase 1 — shared layer.** `git mv src/components/ui src/shared/ui`; move
  `auth-shell`, `error-boundary`, `not-found-screen` into `shared/ui`; update
  imports (`@/components/ui` → `@/shared/ui`). Low risk, mechanical.

- **Phase 2 — features, one slice at a time.** Rename `feature/` → `features/`.
  Normalise each slice to `ui/model/api` + `index.ts`. **Do `auth/login` first as
  the reference slice** (this also creates `LoginForm.tsx`). Then site-blocking
  (biggest win), then the rest. After each slice: check + dev.

- **Phase 3 — pages layer, one screen at a time.** Extract each route's component
  into `pages/<name>`; leave a 3-line route file. Start with `login`, then
  `dashboard-home` (the multi-feature one), then the trivial ones.

- **Phase 4 — enforce + document.** Add an import-boundary lint rule (Biome
  `noRestrictedImports`, or a dependency-cruiser check) so violations fail CI.
  Update `CLAUDE.md` (web section) and the `three-layer-architect` agent to the
  new layer names.

## Risks & things to watch

- **`routeTree.gen.ts` path** must match config exactly, or the router won't build.
- **Barrels must not create cycles** — a feature's `index.ts` should export leaves,
  not re-import pages.
- **Cross-feature imports today** (dashboard-home → time-tracker/workout) become
  legal *only* because they move up into the `pages` layer. Watch for any
  feature→feature import surviving the move — those are the ones to break.
- **Test IDs / e2e**: `data-testid`s don't change, so Playwright specs keep passing;
  only import paths in any component tests need updating.
- Do file-casing normalisation (kebab vs Pascal) as a *separate* pass, not now.

## Open decisions for you

1. Keep the dashboard sidebar in the route file, or extract a `DashboardShell`?
2. `settings` page — what features does it compose? (currently unknown)
3. Introduce `entities/session` now, or defer until a second consumer appears?
   (plan assumes defer)
```
