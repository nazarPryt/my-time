# End-to-end coverage

Reviewed 2026-10-12 against the browser, packaged-extension and real API suites.

## Running the suites

Run from the monorepo root:

```bash
bun run test:web:e2e
bun run test:web:e2e:extension
bun run test:web:e2e:integration
```

The browser suite runs Chromium against Vite and mocks ordinary API calls. Its
session helper serves real streaming HTTP with controlled desktop/session events.

The extension suite builds the actual WXT extension, loads it into isolated
Chromium profiles, and serves account/API responses from a local HTTP server. It
runs separately from the ordinary suite because extension service workers and
persistent profiles require their own fixtures. It makes no external site or
Telegram requests.

The cross-client integration runner starts disposable PostgreSQL on port 5434,
the actual API on 3101, a desktop transport harness on 3102, and Vite on 5174.
It runs the production desktop `ApiClient`, `TrackerController`, SSE parser, and
synchronization rules with HTTP/SSE adapters against the real API and database.
It always removes its database container and network when the run finishes;
it never uses or clears the development database. Docker and the Playwright
Chromium browser must be available. See
[the integration README](../apps/web/e2e-integration/README.md).

CI runs all three suites, alongside API, web, shared-sync and desktop unit tests.
The integration job must pass before the web build job.

## Covered flows

| Area | Coverage |
| --- | --- |
| Login | Forms, invalid-input request guards, rejected credentials/server errors, successful token-authenticated dashboard, Enter/pending submission, retry, reload persistence, auth-page redirect, refresh success/rejection, sign-out/token cleanup |
| Registration | Validation/errors, success → authenticated dashboard, token persistence after reload, retry after rejected registration |
| Time tracker | Initial state, start/stop/abandon, saved history/stats, elapsed ticks, navigation persistence, server timer totals and midnight display projection; failed Start/Stop/Delete preserve state and allow retry; summary failure/recovery |
| Live credentials | Stream refresh/reconnect, shared refresh across concurrent SSE and summary 401s, rejected refresh halts retries, re-login restores synchronization |
| Browser synchronization | Remote start/stop, offline reconciliation/recovery, no idle polling, Bearer authentication, long-lived stream, delayed Start/Stop responses, stale summaries, stream disposal/remount, presence does not change session/history |
| Real cross-client synchronization | Browser commands update desktop; desktop commands update browser; saved history survives reload; backend daily totals agree with desktop; concurrent desktops share one active session; reconnect reconciles offline changes; separate real accounts keep independent sessions |
| Desktop connection | Presence/loss/recovery, setup navigation/mobile layout, explicit pairing approval, expiration/errors, pending request through login, consumed request after refresh |
| Permesso | First setup and input validation, replace confirmation/cancellation with history preservation, save failure/retry, manual checks/status/history, failed scheduled-check rendering, schedule hours/timezone and disable confirmation/cancellation, schedule failure/retry, Telegram link event/timeout/error, disconnect confirmation/cancellation/error/retry, both reset confirmations/cancellations, reset success/failure/retry, load failure/refetch |
| Site blocking web UI | List loading/errors, add/remove and rollback, extension sync messages, install/connect/update, timeout/error/retry, version indicators |
| Packaged extension | Real blocked domain/subdomain redirects and displayed domain, allowed pages, Return navigation, account reconnect replacing rules, sign-out removing credentials/rules, re-login |
| Workout | Sets, quick add/delete/reset, goals; failed add/delete roll back optimistic changes and allow retry, failed reset retains saved sets, failed goal restores saved target; progress chart/month navigation |
| Work time chart | Loading/empty states, aggregate hours and active days, daily tooltip, failed load/revisit recovery, prior-value retention on failed refresh |
| Settings | Direct load/reload and shell navigation smoke tests; settings remain placeholder content |
| Shared | Auth guards, sign-out confirmation, route error/retry, 404, dashboard rendering |

Tests exposed and fixed a packaged-extension defect: Manifest V3 disallowed the
blocked page's inline script. Moving it into `public/block.js` restores the
blocked-domain display and Return button, both verified with the actual extension.

## Remaining runtime boundaries

The real desktop integration uses the production controller and client but a
Bun transport harness. It does **not** launch GNOME Shell, exercise native Soup,
render the panel/preferences, suspend/resume the operating system, or install and
enable/disable the GNOME package. Those need a native desktop smoke environment;
mocked browser or controller tests cannot substitute for that environment.

The packaged extension tests verify main-frame redirects and normal allowed
navigation. They do not yet exercise subframe/XHR blocking, failed account-switch
synchronization, or the packaged extension against a real API/database. The web
UI and actual extension are tested in separate suites.

Permesso/Telegram browser responses are simulated; government scraping, real
Telegram delivery, and production deployments are outside these suites. API
service/scheduler/bot tests cover their backend logic separately.

The work-time chart currently has no distinct error message: a failed first read
shows the empty state, while a failed later read retains prior data. Workout
mutation failures restore data but do not currently render a dedicated error
message. Tests assert these current behaviors.

Chromium desktop is the configured browser target. Some setup tests resize to
mobile widths; a complete mobile or Firefox/WebKit compatibility suite remains
outside the current coverage.

The API tests and cross-client suite share `docker-compose.test.yml`. Its defaults
are `TEST_DB_NAME=my_time_test` and `TEST_DB_PORT=5433`. The integration runner
overrides them with `my_time_e2e` and `5434`, and uses the `my-time-e2e` Compose
project. Container names are project-scoped so the suites can run concurrently;
E2E cleanup removes only its own project.
