---
name: time-tracker feature tests
description: Location and coverage summary for the time-tracker feature test file
type: project
---

File: `apps/api/src/features/time-tracker/time-tracker.test.ts`

Covered routes:
- GET /time-tracker/active — no session (null), has session, other-user isolation, 401
- GET /time-tracker/today — empty stats, completed work stats, abandoned not counted, active not counted, other-user isolation, 401
- GET /time-tracker/weekly — 30-day array, most-recent-first order, day totals, streak=0 (no today), streak consecutive days, abandoned excluded, 401
- POST /time-tracker/start — creates session, stale auto-abandon (>2h), no-abandon fresh (<2h), invalid type (422), missing body (422), 401
- PATCH /time-tracker/:id/end — ends session, other-user returns null, non-existent returns null, 401
- DELETE /time-tracker/:id — abandons active, 404 already-ended, 404 already-abandoned, 404 other-user, 404 non-existent, 401

Integration suites:
- Full lifecycle: start → active → end → today stats
- Abandon lifecycle: start → abandon → no longer active, not counted in stats
- Multi-user isolation: user A and user B cannot see each other's sessions

Key business rules tested:
- `abandonStale` triggers on `startSession` for sessions older than 2 hours
- Sessions with `abandonedAt` set are excluded from stats in both `getToday` and `getWeeklySummary`
- `getWeeklySummary` covers 30 days, most-recent-first
- `currentStreakDays` breaks on the first day (from today) with no completed sessions
