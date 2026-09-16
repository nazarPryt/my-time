---
name: workout feature tests
description: Location and coverage of the workout feature's bun:test suite (repository/service/routes split)
type: project
---

`apps/api/src/features/workout/__tests__/` — `fixtures.ts`, `repository.test.ts`, `service.test.ts`, `routes.test.ts`, mirroring the [[project_eden_treaty]] / site-blocking / permesso split. 66 tests, 150 expect() calls, all passing as of this writing.

- `fixtures.ts` — same `VALID_USER`/`OTHER_USER`/`registerAndGetToken`/`authHeaders` shape as site-blocking; no module mocks needed (workout has no external deps to stub, unlike permesso's checker/telegram-bot).
- `repository.test.ts` — real DB round-trips for `workoutSetsRepository` (getTodaySets/addSet/deleteSet/resetTodaySets/getMonthSets) and `workoutGoalsRepository` (getGoal/upsertGoal). Covers day/month boundary inclusion (`gte` start inclusive, `lt` end exclusive — tested exact-boundary cases), userId scoping, and exerciseType scoping.
- `service.test.ts` — hits the real DB through the repositories (no mocking layer between service and DB in this feature); covers total-reps aggregation, DEFAULT_GOAL_REPS=100 fallback when no goal row exists, month-boundary exclusion in getProgress, leap-year day count (Feb 2024 = 29 days).
- `routes.test.ts` — all 6 routes (GET today, POST sets, DELETE setById, DELETE sets, PUT goal, GET progress), 401 on every route when unauthenticated, exerciseType query/body defaulting to 'pushups', cross-user DELETE setById is a silent no-op returning 200 (not 403/404) — matches the DB layer's `and(id, userId)` scoping, same as site-blocking's deleteById.

**Gotcha — seeding a second exerciseType for isolation tests:** `ExerciseTypeSchema` is currently `z.enum(['pushups'])`, the only defined value, but the `workout_sets.exercise_type` column is a plain `text()` column with no DB check constraint. To test that queries/deletes are scoped by exerciseType (not just by day), seed a second literal like `'situps'` **directly via `db.insert(workoutSets).values({...})`** (bypasses the repository's `ExerciseType`-typed params, so no unsafe type cast needed) rather than trying to call a repository function with an invalid enum value.

**Why:** Task explicitly asked for exerciseType-scoping coverage even though the enum only has one member today — the schema is clearly designed to grow (goal/set tables + repository functions are already fully parameterized by exerciseType).
**How to apply:** Reuse this direct-insert-with-arbitrary-string trick for any single-member-enum column where you need a second value purely to prove a WHERE clause is scoped correctly.
