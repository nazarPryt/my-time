# Code Style & Conventions

## Language
- TypeScript throughout all apps (strict mode implied by tsconfig)
- `.ts` for logic/API, `.tsx` for React components

## React
- Functional components only (no class components)
- Named exports preferred (e.g., `export function App()`)

## Path Aliases
- `@/` maps to `src/` in web app (configured via Vite + tsconfig)
- `@db` and `@db/schema` map to API internal db paths

## Styling
- TailwindCSS v4 (utility-first, no separate config file — uses CSS-based config)
- shadcn/ui component pattern: components live in `src/components/ui/`
- `clsx` + `tailwind-merge` used for conditional class merging (via `@/shared/lib/cn`)
- `class-variance-authority` (CVA) for component variants

## UI Components
- shadcn/ui components in `apps/web/src/components/ui/`
- Barrel export at `apps/web/src/components/ui/index.ts` — import from `@/components/ui`
- Base UI (`@base-ui/react`) and Radix UI as underlying primitives
- `Button` component has `isLoading?: boolean` prop — shows Loader2 spinner and disables itself
- `Input` component auto-handles password visibility toggle when `type="password"`

## Shared Web Utilities (apps/web/src/shared/)
- `@/shared/lib/cn` — `cn()` helper (clsx + tailwind-merge)
- `@/shared/lib/api` — Eden Treaty client; exports `api` pointing to `client.api.v1`
- `@/shared/config/web-config` — `WEB_CONFIG` with `API_URL` (from `VITE_API_URL` env var)

## Feature Organization
- Feature logic lives in `src/feature/<domain>/<feature>/`
- Custom hooks encapsulate form logic (useForm + zodResolver + onSubmit)
- Each feature folder has an `index.ts` barrel export
- Example: `src/feature/auth/login/useLogin.ts` exported via `src/feature/auth/login/index.ts`

## API Feature Organization
- Each feature in `src/features/<domain>/` has: `routes.ts`, `service.ts`, `repository.ts`, `schemas.ts`
- `repository.ts` handles all DB access for the feature
- `schemas.ts` holds Zod schemas specific to the feature

## Forms
- react-hook-form with `zodResolver` from `@hookform/resolvers/zod`
- Zod schemas are the single source of truth for validation
- No inline validation rules in `register()` calls
- Form hook returns `{ form, onSubmit }` — component destructures `{ register, handleSubmit, formState }` from `form`

## Routing (TanStack Router)
- File-based routing, auto code-splitting via `@tanstack/router-plugin/vite`
- `routeTree.gen.ts` is auto-generated — do not edit manually
- Auth routes under `src/routes/auth/` render full-bleed (no nav bar)
- Dashboard routes: `routes/dashboard.tsx` is a layout route (sidebar + `<Outlet />`); sub-pages in `routes/dashboard/`

## Linting & Formatting
- Biome (`biome.jsonc` at monorepo root) — replaces ESLint + Prettier
- Run `bun run lint:fix` from monorepo root to auto-fix
- Single quotes, no semicolons, tab indentation
- Import sorting enabled (organizeImports)

## API (Elysia)
- Route handlers as inline arrow functions
- TypeScript module format (`"type": "module"`)

## Extension (WXT)
- Entrypoints in `entrypoints/` directory
- popup, background, content scripts as separate entrypoints
