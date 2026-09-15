---
name: project_test_suite_structure
description: File-split convention (fixtures/routes/repository/service) for apps/api feature test suites, validation status codes, and cleanDatabase cascade scope
metadata:
  type: project
---

Test suites live at `apps/api/src/features/<feature>/__tests__/`, split by concern:
- `fixtures.ts` — shared Eden Treaty client setup ([[project_eden_treaty]]), user fixtures, `registerAndGetToken`/`authHeaders` ([[project_auth_token]]). If the feature has side-effecting external deps (permesso: headless browser checker, Telegram bot), also does `mock.module(...)` at module scope plus a `clearFixtureMocks()` helper called in `afterEach` ([[project_mock_module_pattern]]).
- `routes.test.ts` — full HTTP-level tests through Eden Treaty, covering 401 (no auth), validation errors, and success/error status codes end to end.
- `repository.test.ts` — direct unit tests of the `*Repository` object against the real test DB.
- `service.test.ts` — direct unit tests of the `*Service` object, bypassing HTTP/Elysia validation — useful for exercising business-logic branches (e.g. a discriminated-union return) that HTTP-layer body validation would otherwise short-circuit before reaching the service.

Lifecycle: see [[project_test_setup]]. `cleanDatabase()` only deletes `refreshTokens` and `users` directly — any other table with `onDelete: 'cascade'` on `user_id` (e.g. `blocked_sites`, `permesso_subscriptions`, `timeSessions`) is cleaned transitively; no need to add a feature's table there unless it lacks the cascade FK.

Elysia route validation: body schemas are Zod schemas imported directly from `contracts`, passed as `{ body: SomeSchema }` — Elysia 1.4's Standard Schema support handles this without TypeBox. A validation failure (missing field, wrong type, out-of-range value) returns **422**, distinct from any **400**/**409** the route handler itself sets via `set.status` for business-logic branches.

Reference implementations: `apps/api/src/features/permesso/__tests__/` and `apps/api/src/features/site-blocking/__tests__/`.

Test commands: `bun run test:db:up` (start Docker test Postgres) → `bun run test:api` (or from `apps/api/`: `bun test src --env-file .env.test`) → `bun run test:db:down`.

**Why:** Matches the established permesso pattern, now also applied to site-blocking and workout — keeps every feature's test suite predictable to navigate.
**How to apply:** Follow this file split and lifecycle for every new feature's test suite.
