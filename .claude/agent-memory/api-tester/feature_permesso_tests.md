---
name: permesso feature tests
description: Location and coverage summary for the permesso feature test file (timezone-aware scheduling, Telegram, checker)
type: project
---

File: `apps/api/src/features/permesso/permesso.test.ts` — now covers essentially the whole feature ahead of a planned refactor (routes, service, repository, jobs, telegram-bot).

Covered:
- `getHourInTimeZone` (pure unit, from `./jobs`) — UTC offset 0, whole-hour offset (Europe/Rome), half-hour offset (Asia/Kolkata), invalid-timezone fallback to `date.getUTCHours()`, DST vs non-DST Rome offset difference.
- `PUT /permesso` (practice number) — 401; creates a fresh row (GET reflects it); calling again on an existing row resets `lastStatus`/`lastError`/`lastCheckedAt` to null (seeded first via `permessoRepository.recordCheckResult`).
- `GET /permesso` — 401; empty status for a fresh user; `telegramConnected: true` once `telegramChatId` is seeded directly via drizzle.
- `POST /permesso/check` — 401; 409 no practice number; success path (response shape, subscription row updated, a `permesso_checks` row with `triggeredBy: 'manual'`); failure path (`lastError` set, `success: false`); Telegram notification sent only when `telegramChatId` is set. `checker.ts`'s `checkPermessoStatus` is mocked via `mock.module` — see [[project_mock_module_pattern]].
- `GET /permesso/history` — 401; empty array for a fresh user; 25 seeded rows (via direct `db.insert`, one second apart) → only 20 returned, newest first.
- `POST /permesso/telegram/link` (Eden path: `api.permesso.telegram.link.post`) — 401; 409 no practice number; 503 bot-not-configured is genuinely the *default* in this test process (see below, no mocking needed to prove it); success path mocks `buildTelegramDeepLink` to return a fake link and asserts `telegramLinkToken` persists.
- `POST /permesso/telegram/disconnect` — 401; clears `telegramChatId`/`telegramLinkToken` on an existing row; no-op 200 when no subscription row exists.
- `PUT /permesso/schedule` — 401, 422 invalid IANA timezone, 422 out-of-range checkHours (24, -1), happy path with dedup+sort, timezone persisted (verified via direct DB read — response schema doesn't expose `timezone`), no-practice-number-yet no-op edge case.
- `POST /permesso/reset` — 401; full wipe of practice number/schedule/telegram link/history back to the empty shape, verified both via response and a direct DB read that the row is actually gone; no-op 200 when there was never a subscription row.
- `permessoRepository` unit tests (real test DB, no HTTP) — `upsertPracticeNumber` insert-then-conflict-resets-status fields; `linkTelegramChat` is single-use (second call with the same now-cleared token returns `null`); `recordCheckResult` writes both the subscription row update and a `permesso_checks` insert from one call.
- `telegram-bot.sendTelegramCheckResult` 403 handling — exercises the **real** implementation (not the module-wide mock) to prove a Telegram 403 (bot blocked) triggers `permessoRepository.disconnectTelegram`. See [[project_mock_module_pattern]] for how the real functions were captured before `./telegram-bot` got mocked for the rest of the file, and how `node-telegram-bot-api` itself was faked.
- `jobs.runScheduledChecks` (exported from `./jobs`) — `permessoRepository.listAll`/`recordCheckResult` are spied via `spyOn` (safe here since real DB writes are unnecessary and the spies are `mockRestore()`d in the same test) with fake rows; checkHours are derived from `getHourInTimeZone(new Date(), tz)` at test time (not hardcoded) so it can't go flaky; asserts only "due" subscriptions get checked, `triggeredBy: 'scheduled'`, and Telegram is only sent for rows with a `telegramChatId`.

Key non-obvious business rules discovered by reading source (not assumed):
- `permessoRepository.updateCheckHours` does a plain `UPDATE ... WHERE userId=X` with **no upsert/insert fallback**. Calling `PUT /permesso/schedule` before ever setting a practice number silently no-ops (200, `toStatusResponse(null)`, no row created). Only `upsertPracticeNumber` (`PUT /permesso` root) creates the row.
- `startTelegramBot()` is only ever invoked from `src/index.ts`, never from `src/app.ts` — so in every test in this file (which imports `app` from `@/app`), the module-private `bot` in `telegram-bot.ts` is `undefined` by default, meaning `buildTelegramDeepLink` returning `null` (→ 503) is real default behavior, not something that needed mocking to prove.
- Eden Treaty's default date auto-parsing breaks `z.string()`-typed date fields the moment they're non-null — this file's client is constructed with `treaty(app, { parseDate: false })`. See [[project_eden_date_parsing]].

Route path notes: `PERMESSO_ROUTES` (`contracts/src/api-routes.ts`) — `root: '/'`, `schedule: '/schedule'`, `check: '/check'`, `history: '/history'`, `telegramLink: '/telegram/link'`, `telegramDisconnect: '/telegram/disconnect'`, `reset: '/reset'`, all under prefix `/permesso`. Via Eden Treaty: `api.permesso.put/get(...)`, `api.permesso.schedule.put(...)`, `api.permesso.check.post(...)`, `api.permesso.history.get(...)`, `api.permesso.telegram.link.post(...)`, `api.permesso.telegram.disconnect.post(...)`, `api.permesso.reset.post(...)` — no bracket notation needed anywhere in this feature (no hyphenated path segments).

Zod contract schemas (e.g. `UpdateCheckHoursRequestSchema` with a `.refine()` validating IANA timezone via `Intl.DateTimeFormat`) are passed directly as Elysia route `body` validators — Elysia 1.4.x accepts Zod via Standard Schema. Confirmed 422 is the resulting status for both schema-shape violations and refine failures.

Explicitly out of scope (by request, not attempted): `checker.ts`'s real Puppeteer scraping logic; the SSE `GET /permesso/telegram-link-events` endpoint; `telegram-link-events.ts`'s `waitForTelegramLinkOrHeartbeat` in isolation.
