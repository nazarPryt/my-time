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
│   └── contracts/  # Shared type contracts (API/data types)
├── package.json    # Root monorepo config (Bun workspaces: apps/*)
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
| API        | Elysia (TypeScript-first Bun HTTP framework)  |
| Extension  | WXT (browser extension framework) + React 19  |
| Linting    | Biome (biome.jsonc at root, replaces ESLint)  |
