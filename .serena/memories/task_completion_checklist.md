# Task Completion Checklist

After completing a coding task, run the relevant checks depending on which app was modified:

## Web app (`apps/web`)
```bash
# From monorepo root:
bun run lint:fix   # Biome auto-fix
bun run web:build  # TypeScript + Vite build (catches type errors)

# Or from apps/web:
bun run lint       # Biome check
bun run build      # TypeScript + Vite build
```

## API (`apps/api`)
```bash
cd apps/api
bun run dev        # Verify it starts
```

## Extension (`apps/extension`)
```bash
cd apps/extension
bun run compile    # TypeScript type-check (tsc --noEmit)
bun run build      # Full WXT build
```

## General
- No global test suite defined yet
- Ensure TypeScript compiles without errors before committing
- Run `bun run lint:fix` from root before committing
- Zod version pinned at `4.3.6` exact in both `apps/web` and `shared/contracts` — keep in sync
