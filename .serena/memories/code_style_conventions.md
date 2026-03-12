# Code Style & Conventions

## Language
- TypeScript throughout all apps (strict mode implied by tsconfig)
- `.ts` for logic/API, `.tsx` for React components

## React
- Functional components only (no class components)
- Named exports preferred (e.g., `export function App()`)
- `default export` also present alongside named export in App files

## Path Aliases
- `@/` maps to `src/` in web app (configured via Vite + tsconfig)

## Styling
- TailwindCSS v4 (utility-first, no separate config file — uses CSS-based config)
- shadcn/ui component pattern: components live in `src/components/ui/`
- `clsx` + `tailwind-merge` used for conditional class merging (via `lib/utils.ts`)
- `class-variance-authority` (CVA) for component variants

## UI Components
- shadcn/ui components in `apps/web/src/components/ui/` (badge, button, card, input, select, dropdown-menu, etc.)
- Base UI (`@base-ui/react`) and Radix UI as underlying primitives

## Linting & Formatting
- Biome (`biome.jsonc` at monorepo root) — replaces ESLint + Prettier
- Single quotes, no semicolons, tab indentation
- Import sorting enabled (organizeImports)
- Tailwind `@apply` directives enabled in CSS parser
- Overrides: non-null assertions allowed in `main.tsx` entry points; a11y/array-index rules relaxed in `components/ui/`
- ESLint fully removed from all apps

## API (Elysia)
- Route handlers as inline arrow functions
- TypeScript module format (`"type": "module"`)

## Extension (WXT)
- Entrypoints in `entrypoints/` directory
- popup, background, content scripts as separate entrypoints
