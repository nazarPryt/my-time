# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from this directory (`apps/mobile`) using `bun` (or `npx`).

```bash
# Start dev server (interactive — choose platform from menu)
bun run start

# Start on a specific platform directly
bun run android    # Android emulator / device
bun run ios        # iOS simulator / device
bun run web        # Browser

# Lint
bun run lint
```

> This app is part of the `my-time` monorepo. From the repo root you can scope commands with `bun --filter mobile <script>`.

## Environment

Copy `.env.local.example` → `.env.local` and set `EXPO_PUBLIC_API_URL` to the API base URL (default: `http://localhost:3000`). On a physical device use your machine's LAN IP instead of `localhost`.

## Architecture

### Routing — Expo Router (file-based)

Routes live in `app/`. Every `.tsx` file becomes a screen; `_layout.tsx` files wrap their segment with a navigator.

- `app/_layout.tsx` — root layout. Wraps everything in `AuthProvider`, mounts a `<Stack>` with headers hidden.
- `app/index.tsx` — entry point. Shows a spinner while auth state rehydrates, then redirects to `/(auth)/login` or `/(protected)`.
- `app/(auth)/` — unauthenticated screens. Redirects to `/(protected)` if already logged in.
  - `_layout.tsx` — auth group Stack
  - `login.tsx` — Login screen
- `app/(protected)/` — authenticated screens. Redirects to `/(auth)/login` if not authenticated.
  - `_layout.tsx` — Tabs navigator
  - `index.tsx` — Dashboard screen

To add a protected screen: create a file in `app/(protected)/` and add a `<Tabs.Screen>` entry to `app/(protected)/_layout.tsx`.

`typedRoutes` is enabled (`app.json` → `experiments`), so `expo-router`'s `href` values are fully typed — use `href` props instead of raw strings where possible.

### Auth flow

Auth state lives in `shared/lib/auth-context.tsx` (`AuthProvider` + `useAuth` hook). On app start it reads the stored token from SecureStore and calls `/auth/me` to rehydrate the user.

```
useAuth() → { isAuthenticated, isLoading, user, login, logout }
```

- `login(email, password)` — calls `POST /api/v1/auth/login`, saves the access token, sets user state. Throws `Error` with the API's message on failure.
- `logout()` — clears SecureStore, resets user to `null`.
- `isLoading` — `true` only during the initial rehydration on app start; becomes `false` once the auth state is known.

### API client — Eden Treaty

`shared/lib/api-client.ts` exports a typed Eden Treaty client:

```ts
import { api } from '@/shared/lib/api-client'
// api.auth.login.post(...), api.auth.me.get(), etc.
```

**Metro shim pattern:** The `api` workspace package (`apps/api`) is an Elysia server — Metro must not bundle it. `metro.config.js` intercepts `import ... from 'api'` and redirects Metro to `shims/api-shim.js` (an empty module). TypeScript still gets the real types via the `tsconfig.json` path alias `"api" → ../../apps/api/src/public.ts`. At runtime, `import type { App }` is erased by Babel anyway.

Do **not** remove this shim or the `resolveRequest` override in `metro.config.js` — Metro will try to bundle the Elysia server and fail.

### Token storage

`shared/lib/token-storage.ts` wraps `expo-secure-store`:

```ts
tokenStorage.save(accessToken)   // store
tokenStorage.get()               // retrieve (returns null if absent)
tokenStorage.clear()             // delete
```

Only the access token is stored. The API's refresh token is an httpOnly cookie — not accessible in React Native. Token refresh is not yet implemented; users are redirected to login when the access token expires.

### Key configuration

- **New Architecture enabled** (`newArchEnabled: true`) — no Fabric/JSI workarounds needed.
- **React Compiler enabled** (`reactCompiler: true`) — avoid manual `useMemo`/`useCallback` unless profiling shows a real need; the compiler handles it.
- **Path alias:** `@/*` maps to the repo root of this package (e.g. `@/shared/lib/api-client`).
- **Workspace deps:** `api` and `contracts` are imported by their package names (not `@my-time/api`). TypeScript resolves them via `tsconfig.json` paths; Metro resolves `contracts` normally and `api` via the shim.

### Monorepo context

- `contracts/` — shared Zod schemas and TypeScript types. Import from `'contracts'` (e.g. `import { type MeResponse } from 'contracts'`).
- `apps/api/` — Elysia REST API. Import the `App` type from `'api'` (type-only, erased at runtime).

### Linting

ESLint with `eslint-config-expo` (flat config). Biome is used in the rest of the monorepo but **not** in this package — use `bun run lint` here, not `bun run check`.