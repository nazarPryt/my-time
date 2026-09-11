---
name: permesso feature tests
description: Location and coverage summary for the permesso feature test file (timezone-aware scheduling)
type: project
---

File: `apps/api/src/features/permesso/permesso.test.ts`

Covered:
- `getHourInTimeZone` (pure unit, imported from `./jobs`, no DB/app needed) — UTC offset 0, whole-hour offset (Europe/Rome), half-hour offset (Asia/Kolkata, the naive-implementation trap), invalid-timezone fallback to `date.getUTCHours()`, DST vs non-DST offset difference for Rome (January CET +1 vs July CEST +2).
- `PUT /permesso/schedule` — 401 unauthenticated, 422 invalid IANA timezone string, 422 out-of-range checkHours (24, -1), happy path with dedup+sort, timezone persistence verified via direct DB read (response schema `PermessoStatusResponseSchema` does NOT expose `timezone`), and the no-practice-number-yet edge case.

Key non-obvious business rule discovered by reading `repository.ts` (not assumed): `permessoRepository.updateCheckHours` does a plain `UPDATE ... WHERE userId=X` with no upsert/insert fallback. If a user calls `PUT /permesso/schedule` before ever setting a practice number (no row exists yet), the UPDATE affects 0 rows, `.returning()` is empty, and the service falls back to `toStatusResponse(null)` — request returns 200 but is silently a no-op (checkHours: [], no row created). Only `upsertPracticeNumber` (the `PUT /permesso` root route) creates the row via `onConflictDoUpdate`. Don't assume schedule updates upsert — verified this is the real, current behavior via test.

Route path note: `PERMESSO_ROUTES` (contracts `api-routes.ts`) uses `root: '/'` and `schedule: '/schedule'` under prefix `/permesso` — via Eden Treaty this is `api.permesso.put(...)` (practice number) and `api.permesso.schedule.put(...)` (check hours + timezone), not bracket notation (no hyphens in this segment).

Zod contract schemas (e.g. `UpdateCheckHoursRequestSchema` with a `.refine()` validating IANA timezone via `Intl.DateTimeFormat`) are passed directly as Elysia route `body` validators — Elysia 1.4.x accepts Zod via Standard Schema. Confirmed 422 is the resulting status for both schema-shape violations and refine failures.
