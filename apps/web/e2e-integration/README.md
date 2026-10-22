# Real cross-client synchronization tests

From the repository root, run:

```bash
bun run scripts/e2e-integration.ts
```

Docker and the installed Playwright Chromium browser are required. The runner
also requires `gsettings` and `glib-compile-schemas` (`libglib2.0-bin` on Ubuntu)
for the offline persistence scenarios. CI installs these tools automatically.
The runner
starts a disposable PostgreSQL database on port 5434, applies real migrations,
starts the production API routes on port 3101, and runs Vite on port 5174.
The database container and network are removed after successful or failed tests.
No development database or personal account is used.

The desktop harness runs the production `ApiClient`, `TrackerController`, shared
SSE parser and synchronization guards, with fetch HTTP/SSE adapters and an
in-memory token store. The browser makes real authenticated API requests without
route mocks. The harness uses the desktop stream user agent, so real account
presence is exercised too. Artifacts are isolated under
`apps/web/playwright-report/integration-artifacts`.

Coverage includes browser-originated start/stop, desktop-originated start/stop,
backend totals, history persistence after reload, desktop reconnect after missing
a browser command, concurrent desktop clients and separation between accounts.

Offline scenarios use a separate desktop worker process running the production
`OfflineTracker`, `OfflineSyncLoop`, `TrackerController`, `ApiClient`, and
`GSettingsStore`. The settings adapter calls real `gsettings` with an isolated
keyfile backend under a temporary directory; it never uses the user's dconf
profile. Restarts terminate the worker with SIGKILL and launch a fresh process
against the same settings files, so persistence is tested beyond in-memory state.
Temporary settings are removed during fixture and server teardown.

These scenarios verify:

- 35 minutes offline survives restart, appears in the real web history, and is
  removed from the local queue after API acknowledgement.
- A running session retains its ID and original start across a simulated week
  and restart, including time while its desktop process was absent.
- Ongoing offline work becomes an active API session when no web session exists.
- An upload committed by the API whose response is lost remains queued across
  restart and retries without duplicate records or totals.
- Overlapping web and desktop ranges count once, and reconnect adopts the active
  web session.
- An offline stop preserves a newer web session; switching accounts against the
  same settings directory keeps saved queues separate and preserves the original
  account's work for later sync.

The worker's observation clock is controlled instead of waiting 35 minutes or a
week. API calculations, Postgres persistence, SSE delivery, authentication and
browser requests remain real. Connection loss is injected into the desktop's
HTTP/SSE transport; successful responses are never mocked. The week-long scenario
tests work retention, not token aging: the API's clock is not advanced.

Run only the offline scenarios with:

```bash
bun run test:web:e2e:integration offline-sync.spec.ts
```

This does not launch GNOME Shell or exercise Soup, Secret Service, the dconf
backend, a physical machine reboot, native
suspend/resume, extension activation, or preferences. Those still require a native
runtime smoke test. Authentication credentials are generated per test and tokens
are issued by the isolated real API.

The API tests and cross-client suite share `docker-compose.test.yml`. Its defaults
are `TEST_DB_NAME=my_time_test` and `TEST_DB_PORT=5433`. The integration runner
overrides them with `my_time_e2e` and `5434`, and uses the `my-time-e2e` Compose
project. Container names are project-scoped so the suites can run concurrently;
E2E cleanup removes only its own project.
