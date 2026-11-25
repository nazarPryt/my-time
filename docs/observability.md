# Observability

How we know my-time works in production: **logs** (Loki), **metrics**
(Prometheus), **dashboards** and **alerts** (Grafana, alerts sent to Telegram),
plus an **external uptime check** that still works when the VPS is down.

Everything is self-hosted and free and runs from `docker-compose.prod.yml`.
Configs live in `observability/`. Grafana is provisioned from files only:
change the JSON/YAML in the repo, not in the UI.

> This file is the contract between the app code, the dashboards and the alert
> rules. If you rename a log message, a field or a metric, update this file and
> every dashboard/alert that uses it in the same change.

## Architecture

```
 api ── stdout JSON logs ─┐
 web/english-quiz nginx ──┤                     ┌──────────────┐
 postgres ────────────────┼─ Docker socket ──► │              │──► Loki ───────┐
                          │                     │    Alloy     │                │
 api :9464/metrics ───────┼─ scrape ─────────► │ (collector)  │──► Prometheus ─┼──► Grafana ──► Telegram
 host (/proc,/sys) ───────┤  built-in exporters│              │                │   dashboards    alerts
 containers (cAdvisor) ───┤                     └──────────────┘                │
 postgres (pg exporter) ──┤                                                     │
 blackbox (public URLs) ──┘                                                     │
                                                                                │
 GitHub Actions uptime workflow ── pings public URLs from outside ──► Telegram ─┘
```

| Component  | Role                                                         |
|------------|--------------------------------------------------------------|
| Alloy      | Ships container logs to Loki; scrapes/exports metrics, remote-writes them to Prometheus |
| Loki       | Log storage (30 days)                                        |
| Prometheus | Metric storage (30 days)                                     |
| Grafana    | Dashboards + alerting                                        |

Grafana datasource UIDs are fixed so dashboards and alert rules can reference
them: **`loki`** and **`prometheus`**.

## Logs

The API logs JSON lines with pino (`apps/api/src/shared/logger.ts`). Every line
has `level` (string: `trace|debug|info|warn|error|fatal`), `time`, `service`
(`"api"`), `msg`. Alloy turns `level` into a Loki label, so filter with
`{service="api", level=~"error|fatal"}`. Everything else is a JSON field:
filter with `| json | field="value"`.

Loki labels: `service` (compose service name), `container`, `stream`, `level`
(api only). Never add high-cardinality values (user ids, paths) as labels.

### Level rules

- `info` — normal events, including the per-request access line.
- `warn` — something unusual that the system handled (failed login, blocked
  Telegram chat, a permesso check the portal rejected, client-side errors).
- `error` — a real failure that needs a look (5xx, job failed, integration down).
- `fatal` — the process cannot continue (DB unreachable at boot, uncaught exception).

A 4xx response is **not** an error: it's visible on the access line through
`status`, never as an `error` line.

### Log catalogue (api)

| `msg`                                  | level | fields |
|----------------------------------------|-------|--------|
| `request completed`                    | info  | `requestId`, `method`, `route` (pattern, e.g. `/api/v1/time-tracker/:id/end`; `unmatched` for 404s), `path`, `status`, `durationMs`, `userId?`, `errorCode?` (Elysia code such as `VALIDATION`, `NOT_FOUND`), `stream?` (`true` for SSE routes — their duration is the stream setup, never use it for latency) |
| `request failed`                       | error | `requestId`, `method`, `route`, `path`, `code`, `err` — only for 5xx / unexpected errors |
| `server is up and running`             | info  | `host`, `port`, `version` |
| `shutdown signal received`             | info  | `signal` |
| `metrics server listening`             | info  | `port` |
| `unhandled promise rejection`          | error | `err` |
| `uncaught exception`                   | fatal | `err` (process exits 1 afterwards) |
| `database connection established` / `connecting to database` | info | |
| `migrations complete`                  | info  | |
| `health check failed`                  | error | `err` (DB unreachable while serving) |
| `job started`                          | debug | `job` |
| `job skipped: still running`           | warn  | `job` (previous run overlapped) |
| `job finished`                         | info  | `job`, `durationMs`, plus job summary fields |
| `job failed`                           | error | `job`, `durationMs`, `err` |
| `user registered`                      | info  | `userId` |
| `user logged in`                       | info  | `userId` |
| `login failed`                         | warn  | `emailHash` (first 12 hex chars of sha256 of the lower-cased email) |
| `user logged out`                      | info  | |
| `token refresh failed`                 | warn  | `reason` (`unknown-token` \| `invalid-token`) |
| `extension token exchange failed`      | warn  | |
| `desktop connection approved`          | info  | `userId` |
| `desktop pairing rate limited`         | warn  | |
| `sse stream opened`                    | info  | `stream` (`session` \| `telegram-link`), `userId`, `client?` (`web` \| `desktop`) |
| `sse stream closed`                    | info  | `stream`, `userId`, `durationMs` |
| `Session stream failed`                | error | `userId`, `err` |
| `User notification listener connected` | info  | `channel`, `reconnect` (`true` after a dropped connection — logged at **warn**) |
| `permesso check completed`             | info  | `userId`, `trigger` (`scheduled` \| `manual`), `durationMs` |
| `permesso check failed`                | warn  | `userId`, `trigger`, `durationMs`, `error` |
| `permesso error screenshot saved`      | info  | `screenshotPath` (logged by the checker right before the failure line) |
| `Telegram bot registered webhook` / polling messages | info/warn/error | see `permesso/telegram/transport.ts` |
| `failed to send Telegram notification` | error | `userId`, `err` |
| `Telegram chat blocked the bot — disconnecting user` | warn | `userId`, `chatId` |
| `client error reported`                | warn  | `source` (`web` \| `extension`), `message`, `stack?`, `url?`, `appVersion?`, `userAgent?`, `userId?` |
| `site blocked` / `site removed`        | info  | `userId`, `domain`/`id` |
| `offline work synchronized`            | info  | `userId`, `observations` |
| `english quiz content synced`          | info  | counts |

The API never logs passwords, tokens, cookies or raw emails (`redact` in
`logger.ts`; emails are hashed).

### nginx (web, english-quiz)

Access logs are JSON (one line per request) with: `time`, `method`, `uri`,
`status`, `bytes`, `request_time` (seconds), `user_agent`, `referer`. Query with
`{service="web"} | json | status >= 500`. `uri` is the path **without** the
query string (tokens never reach the logs); `status`, `bytes` and
`request_time` are JSON numbers. Container healthchecks hit `/healthz`, which
is not logged.

### Postgres

Postgres logs statements slower than 500 ms (`log_min_duration_statement`),
lock waits and checkpoints. Query `{service="db"} |= "duration:"`.

## Metrics

### API (`api:9464/metrics`, internal network only — never exposed publicly)

Served by a separate Bun server inside the api process
(`apps/api/src/shared/metrics.ts`), scraped by Alloy as `job="api"` with
`honor_labels`: the app's own `job` label (the cron job name) is kept, so
`job_runs_total{job="permesso.scheduled-checks"}` works as written below. Those
`job_*` series therefore do **not** carry `job="api"`; select them by metric
name. Everything else from the api (and `up{job="api"}`) has `job="api"`.

| metric | type | labels | notes |
|--------|------|--------|-------|
| `http_requests_total` | counter | `method`, `route`, `status` | every request except `/health`; includes streams |
| `http_request_duration_seconds` | histogram | `method`, `route`, `status` | excludes SSE streams; buckets 5ms…10s |
| `sse_connections` | gauge | `stream` | currently open streams |
| `sse_connections_opened_total` | counter | `stream` | |
| `job_runs_total` | counter | `job`, `result` (`success`\|`failure`) | |
| `job_duration_seconds` | histogram | `job` | |
| `job_last_success_timestamp_seconds` | gauge | `job` | set to process start until the first run, so a restart doesn't look like a stale job |
| `permesso_checks_total` | counter | `trigger`, `result` (`success`\|`failure`) | |
| `telegram_messages_total` | counter | `result` (`sent`\|`failed`\|`blocked`) | |
| `auth_events_total` | counter | `event` (`register`\|`login`\|`login_failed`\|`refresh`\|`refresh_failed`\|`logout`) | |
| `client_errors_total` | counter | `source` | |
| `app_info` | gauge (1) | `version` | |
| `process_*`, `nodejs_*` | | | prom-client default metrics (memory, CPU, event-loop lag, handles) |

`route` is the route pattern or `unmatched`, never a raw path.

Job names: `auth.purge-expired-refresh-tokens` (weekly, Sunday 03:00),
`permesso.scheduled-checks` (hourly).

### Infrastructure (collected by Alloy)

Every target is scraped every **30 s** (use `$__rate_interval` or windows of at
least 2m in queries) and remote-written to Prometheus, which keeps 30 days or
5 GB, whichever comes first.

| job | source | key series |
|-----|--------|-----------|
| `node` | `prometheus.exporter.unix` | `node_cpu_seconds_total`, `node_memory_MemAvailable_bytes`, `node_memory_MemTotal_bytes`, `node_filesystem_avail_bytes`/`node_filesystem_size_bytes` (root filesystem: `mountpoint="/"`), `node_load1` |
| `cadvisor` | `prometheus.exporter.cadvisor` | `container_cpu_usage_seconds_total`, `container_memory_working_set_bytes`, `container_memory_rss`, `container_spec_memory_limit_bytes`, `container_network_{receive,transmit}_bytes_total` (label `interface`), `container_oom_events_total`, `container_start_time_seconds`, `container_last_seen` — each series has `service` (compose service name) and `container`; nothing else is kept |
| `postgres` | `prometheus.exporter.postgres` | `pg_up`, `pg_stat_activity_count`, `pg_settings_max_connections`, `pg_database_size_bytes` (label `datname`), `pg_stat_database_deadlocks`, `pg_stat_database_xact_rollback` |
| `blackbox` | `prometheus.exporter.blackbox` | `probe_success`, `probe_duration_seconds`, `probe_ssl_earliest_cert_expiry`, `probe_http_status_code` — label `target` (`web`, `api`); `instance` is the probed URL |
| `alloy`, `loki`, `prometheus`, `grafana` | self-metrics | `up`, ingestion rates, storage (e.g. `loki_distributor_lines_received_total`, `prometheus_tsdb_head_series`) |

`instance` is fixed (`vps` for node/cadvisor, `db` for postgres, `alloy` for
Alloy) so redeploys don't create new series. Host network traffic is not
collected: Alloy runs in its own network namespace, so `node_network_*` only
shows the Alloy container. Use cAdvisor's per-service `container_network_*`
instead.

Blackbox probes go out through the public URL (`FRONTEND_WEB_URL`, and
`API_URL` + `/api/v1/health`), so they exercise DNS, TLS and the reverse proxy.
They still run on the VPS itself; see the external uptime check below for
"the whole box is down".

## Dashboards (folder "my-time")

| uid | title | answers |
|-----|-------|---------|
| `my-time-api-overview` | API overview | Is the API healthy? traffic, errors, latency, slow routes, recent errors |
| `my-time-jobs` | Jobs & integrations | Did cron jobs run? permesso checks, Telegram, SSE connections, LISTEN reconnects |
| `my-time-activity` | Users & activity | Sign-ups, logins, failed logins, active users, client errors |
| `my-time-infrastructure` | Infrastructure | Host CPU/memory/disk, containers, Postgres, TLS/uptime probes, observability stack itself |
| `my-time-logs` | Logs explorer | Search any service's logs by level, text or requestId |

Every dashboard shows deploys as annotations (`server is up and running`, with
the version).

## Alerts

Defined in `observability/grafana/provisioning/alerting/` (`rules.yaml`,
folder **"my-time alerts"**), evaluated every minute and sent to the
`telegram` contact point. Notifications are grouped by alert name (wait 30s,
group interval 5m) and repeated every 4h while firing. Every rule has
`summary`, `description` and `runbook` annotations; the Telegram message shows
all three.

| rule | condition | for | no data |
|------|-----------|-----|---------|
| API down | `max(up{job="api"}) < 1` | 2m | **alerting** (target gone = down) |
| API high 5xx ratio | 5xx / all > 5% over 5m, only with ≥ 20 requests and ≥ 3 errors | 5m | ok |
| API slow (p95 > 1s) | p95 of `http_request_duration_seconds` > 1s, only with ≥ 20 requests in 5m | 10m | ok |
| API crash loop | `changes(process_start_time_seconds{job="api"}[30m]) > 2` | — | ok |
| API fatal log | `count_over_time({service="api", level="fatal"}[5m]) > 0` | — | ok |
| API error log burst | > 10 `level="error"` api lines in 10m | — | ok |
| Client error spike | `increase(client_errors_total[15m]) > 20` | — | ok |
| Scheduled job failed | `increase(job_runs_total{result="failure"}[1h]) > 0`, per `job` | — | ok |
| Permesso scheduled checks stale | last success of `permesso.scheduled-checks` > 2h ago | — | ok |
| Refresh-token purge stale | last success of `auth.purge-expired-refresh-tokens` > 8 days ago | — | ok |
| Permesso checks failing | failure ratio > 50% over 6h, only with ≥ 4 checks | — | ok |
| Postgres down | `max(pg_up) < 1` | 2m | **alerting** |
| Postgres connections high | connections / `max_connections` > 80% | 5m | ok |
| Host disk almost full | root filesystem < 15% free | 5m | ok |
| Host memory low | `MemAvailable / MemTotal` < 10% | 10m | ok |
| Host CPU saturated | CPU busy > 90% | 15m | ok |
| Public endpoint down | `probe_success == 0`, per `target` | 3m | ok |
| TLS certificate expires soon | `probe_ssl_earliest_cert_expiry` < 14 days | — | ok |
| Log/metric pipeline: Alloy down | `max(up{job="alloy"}) < 1` | 5m | **alerting** (Alloy pushes every metric, so its absence *is* the signal) |
| Log pipeline: no logs received | no Loki lines from any service in 15m | — | **alerting** |

"No data → ok" is deliberate where a missing series means "nothing happened"
(no errors, no traffic). A query that fails (datasource down) puts the rule in
the error state, which Grafana also notifies as `DatasourceError`.

A counter series only shows up in `increase()` from its second sample, so the
api initialises every known label value at 0 at startup (`job_runs_total` per
job and result, `auth_events_total`, `client_errors_total`,
`permesso_checks_total`, `telegram_messages_total`). Otherwise the first event
after a restart is missed (a sign-up shows as 0). Add new label values to that
list.

Panels that count events are exact, not `increase()`: adjacent `increase()`
windows skip the change between them and extrapolate, so one event can show
as 0, 1.1 or (just after a deploy) 2.

- Bar panels (5m minimum interval):
  `(x offset -$__interval - x) >= 0 or x offset -$__interval`. The bar at
  time t counts (t, t + interval], so the bucket in progress shows at once;
  Grafana aligns the range end down to the step and would otherwise hide it.
- Stat and top-N panels over the time range:
  `sum_over_time(((x - x offset 1m) >= 0 or x + 0)[$__range:1m])`, the sum of
  one-minute changes. `+ 0` drops the metric name so both branches are one
  series.

In both, the `or` fallback covers a series that is new or reset by a restart.

### Telegram

Set `GRAFANA_ALERT_TELEGRAM_BOT_TOKEN` (a bot from @BotFather; it can be a
different bot from the app's `TELEGRAM_BOT_TOKEN`) and
`GRAFANA_ALERT_TELEGRAM_CHAT_ID` (your user id, or a group id like
`-100…`; send the bot a message, then read `chat.id` from
`https://api.telegram.org/bot<token>/getUpdates`). Until both are set Grafana
still starts and alerts show under Alerting in the UI, but nothing is
sent. Check delivery with Alerting → Contact points → telegram → Test.

Grafana turns an env-expanded numeric value into a number, which the Telegram
contact point rejects. So `observability/grafana-entrypoint.sh` writes the chat
id into a copy of the provisioning files as a quoted string before starting
Grafana. Keep the `__TELEGRAM_CHAT_ID__` placeholder in `contact-points.yaml`.

## External uptime check

`.github/workflows/uptime.yml` runs every 15 minutes (and on demand) from
GitHub's servers. It catches the failures the VPS can't report on itself (host
down, network, DNS). It retries each URL for about a minute before failing,
then sends a Telegram message.

| setting | kind | value |
|---------|------|-------|
| `UPTIME_WEB_URL` | repository variable | public site, e.g. `https://my-time.example.com/` |
| `UPTIME_API_HEALTH_URL` | repository variable | `<API_URL>/api/v1/health` |
| `UPTIME_TELEGRAM_BOT_TOKEN` | repository secret | bot token (can be the Grafana alert bot) |
| `UPTIME_TELEGRAM_CHAT_ID` | repository secret | chat id |

Unset URLs are skipped. Without the Telegram secrets a failure only shows as a
red run in Actions. It sends a message on every failing run (every 15 min) for
as long as the site is down.

Limits: GitHub may delay scheduled runs by several minutes (or drop them under
load), and **disables scheduled workflows after 60 days without repository
activity** (re-enable from the Actions tab). Treat it as a backstop. For
real external monitoring, also add a free hosted check, e.g.
[UptimeRobot](https://uptimerobot.com) (5-minute HTTP checks, Telegram
integration) on the same two URLs.

## Running it

### Production (`docker-compose.prod.yml`)

Only Grafana is meant to be routed publicly (Coolify domain `GRAFANA_DOMAIN`);
Loki (3100), Prometheus (9090) and the api metrics port (9464) are only
`expose`d on the compose network. Memory limits: Loki, Prometheus and Alloy
512 MB each, Grafana 384 MB (about 100–150 MB each in practice).

Alloy mounts the Docker socket, the containerd socket, `/proc`, `/sys` and `/`
read-only, and runs with `cgroup: host` and `pid: host`. cAdvisor and the node
exporter need these to see the host and the other containers.

Environment variables (besides the existing `POSTGRES_*`, `API_URL`,
`FRONTEND_WEB_URL`, `GRAFANA_ADMIN_*`, `GRAFANA_DOMAIN`):

| variable | required | purpose |
|----------|----------|---------|
| `GRAFANA_ALERT_TELEGRAM_BOT_TOKEN` | for alerts | bot that sends alert messages |
| `GRAFANA_ALERT_TELEGRAM_CHAT_ID` | for alerts | chat that receives them |
| `GRAFANA_METRICS_PASSWORD` | recommended | basic-auth password for Grafana's `/metrics` (user `metrics`), which is otherwise public through the Grafana domain; Alloy sends the same credentials |

The Postgres exporter connects with the app's `POSTGRES_USER`/`POSTGRES_PASSWORD`
(assembled into a URL in the compose file). A password with URL-reserved
characters (`@`, `/`, `:`, `?`, `#`) must be percent-encoded there.

Permesso error screenshots live in the `permesso-screenshots` volume
(`/app/screenshots` in the api container).

### Locally

`bun run observability:up` starts the same Loki/Prometheus/Alloy/Grafana images
(`docker-compose.observability.yml`), watching the dev servers on the host
(`bun run dev`: api metrics on `:9464`, Postgres on `:5432`). Open Grafana at
http://localhost:3001 (admin/admin). `bun run observability:down` stops it.

`bun run check:observability` validates the Alloy, Loki, Prometheus and nginx
configs plus every alert query with the same images (part of CI's Docker job
and `bun run ci:local`).

`bun run observability:test` checks what the dashboards show, end to end. It
starts this stack with a disposable Postgres and the API as a container
(`docker-compose.observability-test.yml`, Grafana on :3201, API on :3200, so
`bun run dev` can keep running), sends known traffic (sign-ups, logins, failed
logins, refreshes, feature use, client errors), then queries every panel
through Grafana. Each panel must return data unless it is listed in
`scripts/observability-test/panels/expectations.ts` (`ALLOWED_EMPTY`), and
the activity panels must show exactly the traffic sent. Finally it opens every
dashboard in Chromium, fails on a panel that renders an error, and saves
screenshots to `observability-test-results/`. It takes about 2–4 minutes
(image builds plus waiting for 30s scrapes). Run it after changing a
dashboard, a metric, a label or a log message the dashboards use.

It works like `bun run ci:local`; both are built on
`scripts/shared/step-runner/`. A preflight (Docker, Playwright's Chromium,
free ports) fails within seconds with a fix for each problem; a terminal gets a live step list with an ETA from the last
run (`~/.cache/my-time-observability-test/timings.json`); each step logs to
`my-time-observability-test-logs` in the temp directory, and a failed step
prints its last lines (for the panel check, the list of wrong panels). The
stack is always removed, also after Ctrl+C, and a boxed summary ends the run.
`--plain` (or a non-TTY) streams the output instead; `--keep` leaves the
stack running and prints the Grafana URL.

Code in `scripts/observability-test/`: `run-observability-test.ts` (preflight
→ steps → report → cleanup), `steps.ts` (the step list), `traffic/` (the
API client and the traffic scenario), `grafana/` (dashboard files, the query
client and the browser check) and `panels/` (expectations and comparing them
with query results).

## Runbook

- **"A user says X failed"** — ask for the time; every API response carries an
  `X-Request-Id` header. Search `{service="api"} |= "<requestId>"` in Explore
  (or the Logs explorer dashboard).
- **API down alert** — `docker compose -f docker-compose.prod.yml ps`, then
  the API logs around the alert time (look for `fatal` / `uncaught exception`).
- **Disk alert** — check `docker system df` and the Loki/Prometheus volume
  sizes; `docker builder prune` and `docker image prune` free old build cache
  and images.
- **Permesso checks failing** — the portal probably changed its HTML; the
  `permesso check failed` line has the error and a screenshot path
  (`permesso-screenshots` volume, `/app/screenshots` in the api container).
- **Log pipeline / Alloy down** — `docker compose -f docker-compose.prod.yml
  logs alloy loki`. While Alloy is down every metric alert is blind; the
  external uptime check still works.
- **Telegram alerts stopped arriving** — Grafana → Alerting → Contact points →
  telegram → Test; check the Grafana logs for `Notify for alerts failed`.
