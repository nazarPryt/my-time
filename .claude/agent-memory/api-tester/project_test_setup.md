---
name: Test setup helpers
description: runMigrations + cleanDatabase utilities and the lifecycle pattern used in all API test files
type: project
---

Located at `apps/api/src/test/setup.ts`.

- `runMigrations()` — runs Drizzle migrations against the test DB. Call once in `beforeAll`.
- `cleanDatabase()` — deletes all rows from `refreshTokens` then `users` (FK order). Because `timeSessions` cascades on user delete, this also wipes all sessions. Call in `afterEach` to prevent state leakage between tests.

Standard lifecycle:

```ts
beforeAll(async () => {
  await runMigrations()
  await cleanDatabase()
})

afterEach(async () => {
  await cleanDatabase()
})
```

**Why:** This matches the pattern established in `auth.test.ts` and avoids test-order dependencies.
**How to apply:** Always use this pattern in new test files — never skip `cleanDatabase` in `afterEach`.
