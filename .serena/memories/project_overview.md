# my-time — Project Overview

**Purpose:** A time-tracking application built as a monorepo, targeting multiple platforms (web, browser extension, mobile placeholder, desktop placeholder).

## Monorepo Structure

```
my-time/
├── contracts/      # Shared Zod schemas + TS types (package name: "contracts")
│   └── src/
│       ├── auth.ts
│       └── index.ts
├── apps/
│   ├── web/        # React 19 web app (Vite + TailwindCSS v4 + shadcn/ui)
│   ├── api/        # Bun + Elysia REST API server (port 3000, package: "api")
│   ├── extension/  # Browser extension (WXT framework + React 19)
│   ├── mobile/     # Placeholder (empty)
│   └── desktop/    # Placeholder (empty)
├── package.json    # Root monorepo config (Bun workspaces: apps/*, contracts)
├── biome.jsonc     # Biome linter/formatter config
└── bun.lock
```

## API Contract (one source of truth)

- **Zod schemas + TS types** → `contracts/src/` (package `"contracts"`) — import as `import { ... } from 'contracts'`
- **`App` type** (Eden Treaty) → `apps/api/src/public.ts` exports `export type { App }` only
- All apps add `"contracts": "workspace:*"` to deps and `"contracts": ["../../contracts/src/index.ts"]` to tsconfig paths + project reference `{ "path": "../../contracts" }`
- `apps/api/src/features/*/schemas.ts` files re-export from `'contracts'` so API internals are unchanged

## API Structure (apps/api/src/)

```
src/
├── app.ts          # Elysia app definition (plugins, routes)
├── index.ts        # Entry point — calls app.listen()
├── public.ts       # Public type surface: exports ONLY `App` type (schemas live in contracts/)
├── features/
│   └── auth/
│       ├── routes.ts     # Route handlers
│       ├── service.ts    # Business logic
│       ├── repository.ts # DB access layer
│       ├── schemas.ts    # Zod schemas for this feature
│       └── auth.test.ts  # Integration tests
├── shared/
│   └── api-config.ts
├── db/
│   ├── connect.ts
│   ├── index.ts
│   ├── schema/
│   │   ├── index.ts
│   │   ├── users.ts
│   │   └── refresh-tokens.ts
│   └── migrations/
└── test/
    └── setup.ts    # runMigrations() + cleanDatabase() helpers for integration tests
```

`apps/api/tsconfig.json` has `composite: true` so `tsc -b` on any consumer compiles the API first (using API's own tsconfig with bun-types, @db aliases) and emits `.d.ts` declarations. Consumers only see the declarations — never Bun/server source.

## Tech Stack

| Layer      | Tech                                          |
|------------|-----------------------------------------------|
| Runtime    | Bun (package manager + runtime)               |
| Web        | React 19, TypeScript, Vite, TailwindCSS v4    |
| UI Library | shadcn/ui (Base UI + Radix UI primitives)     |
| Icons      | lucide-react                                  |
| Routing    | TanStack Router v1 (file-based, auto code-splitting) |
| Forms      | react-hook-form + @hookform/resolvers + Zod v4 |
| Validation | Zod 4.3.6 (pinned exact version in all packages) |
| API        | Elysia (TypeScript-first Bun HTTP framework)  |
| Extension  | WXT (browser extension framework) + React 19  |
| Linting    | Biome (biome.jsonc at root, replaces ESLint)  |

## Web App Structure (apps/web/src/)

```
src/
├── components/
│   ├── ui/             # shadcn/ui components + index.ts barrel export
│   │   └── (button, input, card, badge, select, label, field,
│   │        input-group, combobox, dropdown-menu, alert-dialog,
│   │        separator, textarea, ...)
│   └── auth-shell.tsx  # Split-panel layout for auth pages
├── feature/
│   └── auth/
│       ├── login/      # useLogin hook + index.ts
│       └── register/   # useRegister hook + index.ts
├── routes/
│   ├── __root.tsx      # Root layout (hides nav on /auth/* routes)
│   ├── index.tsx       # Redirect to /dashboard
│   ├── dashboard.tsx   # Dashboard layout route (sidebar + <Outlet />)
│   ├── dashboard/
│   │   ├── index.tsx   # /dashboard home
│   │   └── settings.tsx # /dashboard/settings
│   └── auth/
│       ├── login.tsx   # /auth/login
│       └── register.tsx # /auth/register
├── shared/
│   ├── config/
│   │   └── web-config.ts  # WEB_CONFIG (API_URL from VITE_API_URL)
│   └── lib/
│       ├── cn.ts          # cn() helper (clsx + tailwind-merge)
│       └── api.ts         # Eden Treaty client (exports `api = client.api.v1`)
├── main.tsx
└── index.css           # TailwindCSS v4 + theme CSS variables
```
