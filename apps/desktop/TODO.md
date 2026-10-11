# TODO: replace session polling with SSE

Status: API + contracts + desktop + web SSE implementation is present, uncommitted.
See the implementation record below for completed checks and remaining work.
Decision recorded on 2026-10-11 for continuation in the next session.

## Goal and agreed decision

Replace the desktop's five-second active-session polling with Server-Sent
Events (SSE). Starting, stopping, or abandoning a session in the web application
should update the Linux panel promptly without repeatedly querying unchanged
state. Keep ordinary HTTP requests for commands; SSE carries API-to-client
notifications only. The API remains the source of truth.

The user selected SSE because this synchronization needs one-way updates.
WebSockets support both directions but are unnecessary for this requirement.
Webhooks would require the desktop to expose a reachable inbound endpoint.
SSE still maintains a persistent connection; it is not inherently more scalable
than WebSockets. One million registered users is different from one million
concurrently connected devices. At one million concurrent clients, five-second
polling means roughly 200,000 requests per second, even with no changes.

## Current behavior and relevant files

- `apps/desktop/src/shell/application.ts`: five-second network refresh timer,
  initial refresh on connection, and a separate one-second local render timer.
  Keep the local elapsed-time rendering timer; it does not call the API.
- `apps/desktop/src/bll/tracker-controller.ts`: framework-independent state,
  serialized HTTP actions, offline state, and disposal protection. `run()` skips
  work while busy; an SSE-triggered refresh must not silently lose an update
  arriving during a command or another refresh.
- `apps/desktop/src/dal/api-client.ts`: shared-contract validation, Bearer access
  tokens, one retry after 401, and serialized refresh-token rotation. Credentials
  live in Linux Secret Service. Access tokens currently expire after 15 minutes.
- `apps/desktop/src/dal/http-transport.ts`: libsoup 3 HTTP transport with a
  15-second timeout and `send_and_read_async`, which buffers the entire response.
  A persistent SSE stream needs asynchronous incremental reads and appropriate
  stream timeout behavior, not this buffered request path unchanged.
- `apps/desktop/src/dal/services.ts`: dependency composition; inspect before
  introducing stream adapters.
- `apps/api/src/features/time-tracker/{routes,service,repository}.ts`: active
  session reads and start/end/abandon mutations. Include stale-session abandonment
  performed during start and inspect all other writers before choosing event hooks.
- `contracts/src/features/`: source of truth for shared schemas, types, and route
  constants. Inspect the existing time-tracker exports before adding SSE contracts.
- `apps/api/src/features/permesso/routes.ts`: existing Elysia SSE usage.
- `apps/api/src/features/permesso/telegram-link-events.ts`: existing process-wide
  event emitter backed by Postgres LISTEN/NOTIFY across replicas. Useful reference,
  but inspect cancellation, listener gaps, reconnects, and delivery guarantees
  before adapting it to a continuous session stream.
- `apps/web/src/features/time-tracker/model/use-time-tracker-sync.ts`: the web
  client also polls every five seconds while visible and refreshes on focus.
  Desktop SSE alone does not remove this web polling.
- `apps/desktop/README.md`: existing synchronization documentation needs updating
  when implementation lands.

## Scope and project instructions

- [ ] Read root and applicable nested `AGENTS.md` files before implementation.
- [ ] Update `apps/desktop/AGENTS.md` when the change lands: its explicit
  "Poll every five seconds" guidance describes the old design. The user's SSE
  decision supersedes that guidance for this work. Keep `CLAUDE.md` as an import.
- [ ] Implement API + contracts + desktop first. Recommended follow-up: migrate
  the existing web synchronization hook to the same SSE endpoint for reciprocal
  push updates. Confirm whether to include that follow-up in the implementation
  scope; the agreed primary task concerns desktop synchronization.
- [ ] Preserve GNOME 46/GJS compatibility: no browser EventSource, DOM, Node, or
  Bun runtime APIs in the desktop. Use asynchronous Soup/Gio operations in DAL;
  keep BLL independent of GNOME and UI. Shell and preferences are separate processes.
- [ ] Keep shared schemas in contracts, use date-fns for time handling, use pino
  for API logging, and preserve web FSD boundaries if changing the web client.

## Proposed API and delivery design

- [ ] Add an authenticated SSE GET endpoint under the existing time-tracker
  feature; choose and export the route constant through contracts.
- [ ] Authenticate before opening the stream and derive user identity from the
  token, never from an untrusted subscription user ID. Notify only that user's
  connected devices. Do not put access/refresh tokens in URLs or logs.
- [ ] Send authoritative initial state on every connection and reconnection.
  Subscribe before reading the initial snapshot, and reconcile any changes during
  snapshot acquisition so a read/subscribe race cannot leave the client stale.
- [ ] Choose the event payload before coding. Recommended first version: an
  initial active-session snapshot, then a small session-changed notification
  causing one authoritative HTTP refresh per change. This removes idle polling
  while reusing existing validated reads. Full-state events are an optional
  optimization and need explicit ordering/version semantics.
- [ ] Define schemas, event names, and protocol versioning in contracts. Account
  for active session becoming null, duplicate notifications, and rapid mutations.
- [ ] Emit notifications only after successful persisted changes, covering start,
  end, abandon, stale-session cleanup, and any other session writers discovered.
  Avoid emitting success for failed or rolled-back mutations.
- [ ] Coalesce refreshes and retain a pending refresh when the client is busy.
  Prevent delayed snapshots/HTTP results from overwriting newer confirmed state.
- [ ] Send lightweight heartbeat comments/messages (proposed 20–30 seconds,
  adjusted to infrastructure timeouts). Heartbeats must not query the database.
- [ ] Define delivery guarantees explicitly. LISTEN/NOTIFY is not a durable event
  log. Reconnect snapshots repair disconnected clients; decide how to recover
  connected clients after a notification-publishing/listener failure, e.g. force
  affected streams to reconnect. Do not silently leave them stale indefinitely.
- [ ] No durable replay is required for an active-state view if reconnection
  always reconciles current state. Do not imply Last-Event-ID replay support
  without actually implementing a replay store.

## Desktop transport, authentication, and lifecycle

- [ ] Add an injectable stream adapter using Soup/Gio incremental asynchronous
  reads. Handle UTF-8 and SSE frames split across chunks, CRLF/LF, multiline data,
  heartbeat comments, malformed events, EOF, and bounded buffers.
- [ ] Check status/content type before consuming the stream; preserve the current
  no-redirect credential protection and HTTPS/loopback-only HTTP policy.
- [ ] Reuse the API client's token loading and serialized refresh logic. Define
  a server-enforced stream lifetime at access-token expiry; reconnect with a valid
  token so an open stream does not bypass token expiry indefinitely. Do not race
  single-use refresh-token rotation between streams and ordinary requests.
- [ ] On transient disconnect, retain last confirmed session and indicate lost
  synchronization. Reconnect with capped exponential backoff plus jitter;
  distinguish retryable failures, rate limiting, and rejected authentication.
- [ ] Refresh/reconcile on reconnect and after laptop suspend/network recovery.
  Reset retry delays after a healthy connection. Never run duplicate streams.
- [ ] Cancel reads, close streams, remove timers/listeners, and ignore stale
  callbacks on disable, sign-out, API URL/account changes, or controller replacement.
- [ ] Remove the five-second desktop network timer once push synchronization is
  verified. Keep manual refresh, confirmed HTTP command behavior, and local ticks.
  Do not introduce permanent polling as a hidden fallback; document any proposed
  compatibility fallback separately before choosing it.

## Deployment and scaling

- [ ] Inspect production proxy/load-balancer configuration: disable buffering
  for SSE, prevent caching, verify idle timeouts and graceful shutdown behavior,
  and verify streaming through the actual deployed route.
- [ ] Reuse a process-level event distribution mechanism for the initial deployment
  after inspecting the existing Postgres integration. Never hold one database
  connection per desktop SSE subscriber or perform database reads on heartbeats.
- [ ] Support mutations and subscribers landing on different API replicas.
  Postgres LISTEN/NOTIFY may suit the initial deployment; reassess a broker or
  dedicated streaming tier using measured load rather than claiming million-client
  capacity from the protocol choice alone.
- [ ] Bound slow-client queues and subscription resources. Observe active streams,
  reconnects, event latency, failures, and resource usage without logging secrets.
- [ ] If migrating web sync, account for Bearer authentication: browser EventSource
  cannot set arbitrary Authorization headers. Use an authenticated fetch stream or
  deliberately designed cookie authentication; do not leak tokens into query strings.
  Inspect existing web refresh handling, CORS, tab visibility, and summary updates.

## Verification and acceptance checklist

- [ ] Test API auth/user isolation, mutation notifications, snapshot/subscription
  races, post-commit behavior, cancellation, and listener cleanup with a test DB.
- [ ] Test desktop stream parsing with split frames/UTF-8, heartbeats, invalid
  payloads, disconnects, authentication expiry, retry/backoff, and disposal.
- [ ] Test rapid start/stop and events arriving during commands/refreshes, including
  a missed-event recovery after reconnect. Validate no state regression.
- [ ] Verify web start/stop updates Linux promptly without five-second polling.
  Verify desktop actions still work and web synchronization still works; if web
  SSE is out of scope, explicitly report its remaining polling.
- [ ] Verify idle operation produces no recurring active-session HTTP requests
  and no heartbeat-triggered DB queries. Allow connection/reconnect snapshots,
  actual changes, manual actions, and token renewal.
- [ ] Run appropriate repository checks from the root with Bun: desktop tests,
  desktop typecheck/build, repository lint, and relevant API tests with the test
  Postgres instance. Inspect current scripts before selecting commands. Use web
  checks/E2E if its synchronization changes.
- [ ] Perform a separate real GNOME 46 smoke test covering suspend/resume,
  reconnect, account switching, and extension disable/enable. Do not write real
  sessions to the user's account for automated tests or restart the desktop
  session automatically. Installation outside the workspace needs applicable
  sandbox authorization.
- [ ] Update README and this checklist with completed work and evidence. Keep
  automated verification distinct from an actual GNOME/account smoke test.

## Implementation record

- Implemented `GET /api/v1/time-tracker/events` with authenticated, versioned
  full-state `session-state` events. Full snapshots were chosen over the original
  invalidation-only proposal to avoid a separate desktop GET for every change.
- Subscriptions precede snapshot reads; a pending-change flag retains mutations
  during reads. Streams respect backpressure, close at token expiry, and clean up
  on cancellation. Heartbeats every 20 seconds do not query the DB. Bun's route
  idle timeout is 60 seconds.
- Repository mutations publish Postgres NOTIFY in the same transaction as the
  write; failed publishing rolls back the mutation. One process-wide listener
  serves all desktop connections and reconciles them when LISTEN reconnects.
- Desktop uses incremental Soup/Gio reads, bounded SSE parsing, shared token
  refresh, retry backoff with jitter, a silence watchdog, and full lifecycle
  cleanup. Removed the five-second network timer and retained local rendering.
- New pushed state invalidates delayed HTTP results; changes arriving during
  commands trigger a coalesced reconciliation instead of being discarded.
- Updated desktop AGENTS.md and README. No migrations were needed because no
  database schema changed. No commits or extension installation performed.
- Web follow-up is now implemented: the synchronization hook uses an authenticated
  fetch SSE stream with shared token refresh, retry backoff, a heartbeat watchdog,
  and online/visibility recovery. It applies snapshots directly and coalesces
  today's summary reads on changes/reconnects and at local midnight. Removed
  five-second web polling. Version guards protect pushed state and summaries from
  late HTTP results and callbacks from an unmounted tracker.

Verification:

- Web: 99 unit tests passed; production build and typecheck passed. The full
  browser run passed 146 of 147 tests; the login error-handling regression was
  fixed and all five login tests then passed. All 25 tracker browser tests passed,
  including idle request counts, reconnects, heartbeat survival, and stale HTTP
  responses. Shared refresh excludes public login/register credential checks.
- Desktop: 41 tests passed, typecheck/build passed.
- Full API suite: 298 tests passed, including SSE auth/isolation, mutation
  delivery, read/subscribe races, rollback/no-op behavior, cross-client database
  notifications, expiry/cancellation, and idle heartbeats without DB reads.
- Additional targeted checks passed after final review: deterministic snapshot
  race handling and recovery of connected subscribers after terminating the
  Postgres LISTEN connection. The latter confirms missed-event reconciliation.
- API typecheck, desktop build, web production build, and repository lint passed.
- Native standalone GJS/Soup smoke passed against a temporary local API and an
  isolated test account: initial idle snapshot, connection surviving the default
  Bun idle timeout through the real heartbeat interval, pushed start/stop, and
  cancellation. This is not a real GNOME Shell panel smoke test.

Remaining before rollout:

- [x] Review and simplify the uncommitted changes (see
  `../../docs/session-sync-review.md`).
- [ ] Test the real GNOME 46 panel, suspend/resume, sign-out/account switching,
  and disable/enable in the user's desktop session.
- [ ] Verify streaming through the deployed Coolify HTTPS proxy. That proxy's
  settings are outside this repository; local tests cannot verify them.
- [x] Migrate web polling to the same SSE endpoint.
- [ ] Load-test connection count, slow consumers, reconnect bursts, and event
  delivery before making capacity claims or introducing a dedicated broker.

The original checklist above describes the design and possible follow-ups;
unchecked planning items are not all blockers for this scoped implementation.

## Next-session starting point

Read the implementation record, inspect git status and the diff, then address
review findings and remaining rollout checks. Do not commit before user review.


## Shared synchronization refactor

Web and desktop now reuse `packages/session-sync` for SSE parsing, reconnect
backoff, connection state, revision/lifecycle guards, and choosing pushed state
versus a server read. Connected desktop commands no longer read `/active`.
Web command handlers are separated from the store. Automated controller/parser
and web store checks cover this change; the installed GNOME panel has not been
updated or smoke-tested for this refactor.


## Review and simplification verification

- React synchronization hook reduced to lifecycle wiring; shared reconnect logic,
  browser listeners, command handlers, and summary queues have separate owners.
- Fixed command/disconnect, delayed-read/disposal, summary/remount, and token
  refresh/sign-out races; regression tests cover these cases.
- API: 299 tests passed. Web: 105 unit tests and all 147 browser tests passed.
  Desktop: 41 tests passed. Shared synchronization: 14 tests passed.
- Web production build, desktop build/typecheck, and repository lint passed.
- Standalone GJS/Soup smoke against a temporary local mock server passed for an
  initial snapshot, heartbeat, and cancellation of a pending read. This check
  creates no account sessions and does not test the real GNOME Shell panel.
- The installed desktop extension and deployed proxy were not changed or tested
  as part of this review.
