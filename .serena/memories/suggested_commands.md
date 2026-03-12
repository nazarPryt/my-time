# Suggested Commands

## From monorepo root (using Bun workspaces)

```bash
# Web app
bun run web:dev        # Start web dev server (Vite)
bun run web:build      # TypeScript check + Vite build

# API
bun run api:dev        # Start API with watch mode (Elysia on port 3000)
# Note: no api:build — Bun runs TypeScript directly, no build step needed

# Browser extension
bun run extension:dev  # Start WXT extension dev (Chrome)

# Linting & formatting (Biome — runs across all workspace packages)
bun run lint           # Check all files
bun run lint:fix       # Auto-fix issues
bun run format         # Format all files
```

## Per-app commands (run from app directory)

```bash
# Web
cd apps/web
bun run dev            # Dev server
bun run build          # Build
bun run lint           # Biome check (delegates to root biome.jsonc)
bun run preview        # Preview production build

# API
cd apps/api
bun run dev            # Dev server with --watch

# Extension
cd apps/extension
bun run dev            # Chrome dev
bun run dev:firefox    # Firefox dev
bun run build          # Chrome build
bun run build:firefox  # Firefox build
bun run zip            # Package Chrome extension
bun run zip:firefox    # Package Firefox extension
bun run compile        # TypeScript type-check only
```

## Utility

```bash
bun install            # Install all workspace dependencies
git status / git log   # Standard git commands
```
