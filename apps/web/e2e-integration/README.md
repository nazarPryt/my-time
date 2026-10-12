# Real cross-client synchronization tests

From the repository root, run:

```bash
bun run scripts/e2e-integration.ts
```

Docker and the installed Playwright Chromium browser are required. The runner
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

This does not launch GNOME Shell or exercise Soup, Secret Service, native
suspend/resume, extension activation, or preferences. Those still require a native
runtime smoke test. Authentication credentials are generated per test and tokens
are issued by the isolated real API.

The API tests and cross-client suite share `docker-compose.test.yml`. Its defaults
are `TEST_DB_NAME=my_time_test` and `TEST_DB_PORT=5433`. The integration runner
overrides them with `my_time_e2e` and `5434`, and uses the `my-time-e2e` Compose
project. Container names are project-scoped so the suites can run concurrently;
E2E cleanup removes only its own project.
