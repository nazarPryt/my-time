# Task Completion Checklist

After completing a coding task, run the relevant checks depending on which app was modified:

## Web app (`apps/web`)
```bash
cd apps/web
bun run lint       # ESLint check
bun run build      # TypeScript + Vite build (catches type errors)
```

## API (`apps/api`)
```bash
cd apps/api
# No dedicated lint/test script yet — bun run dev confirms it runs
bun run dev        # Verify it starts
```

## Extension (`apps/extension`)
```bash
cd apps/extension
bun run compile    # TypeScript type-check (tsc --noEmit)
bun run build      # Full WXT build
```

## General
- No global test suite defined yet (api has a stub "no test" script)
- Ensure TypeScript compiles without errors before committing
- Run lint before committing web changes
