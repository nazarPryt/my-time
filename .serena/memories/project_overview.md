# my-time — Project Overview

**Purpose:** A time-tracking application built as a monorepo, targeting multiple platforms (web, browser extension, mobile placeholder, desktop placeholder).

## Monorepo Structure

```
my-time/
├── apps/
│   ├── web/        # React 19 web app (Vite + TailwindCSS v4 + shadcn/ui)
│   ├── api/        # Bun + Elysia REST API server (port 3000)
│   ├── extension/  # Browser extension (WXT framework + React 19)
│   ├── mobile/     # Placeholder (empty)
│   └── desktop/    # Placeholder (empty)
├── shared/
│   ├── config/     # Shared configuration
│   ├── ui/         # Shared UI components
│   └── contracts/  # Shared type contracts (Zod schemas + inferred types)
├── package.json    # Root monorepo config (Bun workspaces: apps/*, shared/*)
├── biome.jsonc     # Biome linter/formatter config (covers all apps & shared)
└── bun.lock
```

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
│   └── auth-shell.tsx  # Split-panel layout for auth pages
├── feature/
│   └── auth/
│       ├── login/      # useLogin hook + index.ts
│       └── register/   # useRegister hook + index.ts
├── routes/
│   ├── __root.tsx      # Root layout (hides nav on /auth/* routes)
│   ├── index.tsx
│   ├── about.tsx
│   └── auth/
│       ├── login.tsx   # /auth/login
│       └── register.tsx # /auth/register
├── lib/utils.ts        # cn() helper
└── index.css           # TailwindCSS v4 + theme CSS variables
```

## Shared Contracts (shared/contracts/)

Zod schemas with inferred TypeScript types for all API request/response shapes.
- `auth/api.ts` — LoginRequest, RegisterRequest, RefreshRequest, LogoutRequest, MeResponse
- `auth/types.ts` — UserSchema
- `common/types.ts` — TokensSchema, ApiErrorSchema
- Path alias `@contracts` maps to `shared/contracts/` in web app
