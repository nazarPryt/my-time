# my·time desktop

A personal GNOME Shell extension for Ubuntu 24.04 / GNOME 46. It adds Play,
Stop, and an elapsed timer to the desktop panel. It uses the same account and
work sessions as the web app, and works while the browser is closed.

## Platform support

This is a GNOME Shell extension, not a standalone desktop application. Its
metadata currently supports GNOME 46 only. Ubuntu 24.04 is the development
target; other Linux distributions such as Arch need the same supported GNOME
version and runtime dependencies. Other GNOME versions have not been validated.
Windows, macOS, KDE, and other desktop environments can use the web tracker.

## Download from the web tracker

The web Time Tracker page includes a desktop download and installation guide.
Production web Docker builds include the GNOME ZIP. For local web development,
run `bun run desktop:web-package` from the repository root to build and copy it
into the web public directory. The web app downloads the ZIP from
`/my-time@my-time.local.shell-extension.zip` on the same host.

Install the downloaded ZIP without extracting it:

```bash
gnome-extensions install --force my-time@my-time.local.shell-extension.zip
```

Log out and back in, then enable and connect as described below. The download includes the server URLs, so new users only need to sign in.

## Install

From the monorepo root:

```bash
bun install
bun --filter desktop typecheck
bun run desktop:install
```

The installer creates and installs
`apps/desktop/build/my-time@my-time.local.shell-extension.zip` into your user
extensions directory. Log out and back in after the first installation, then:

```bash
gnome-extensions enable my-time@my-time.local
```

On an Xorg session, restarting GNOME Shell with Alt+F2, entering `r`, and pressing
Enter can reload installed extensions. On Wayland, log out and back in. Save
your work before logging out; the installer does not restart your session.

Ubuntu's GNOME installation normally includes GJS, GTK4, libadwaita, Soup 3,
libsecret, and the extension tools. If a dependency is missing:

```bash
sudo apt install gjs gnome-shell gir1.2-adw-1 gir1.2-soup-3.0 gir1.2-secret-1 libglib2.0-bin
```

## Connect

1. Click the timer in the panel and choose **Settings**.
2. Choose **Sign in with browser**. Keep desktop Settings open while it opens
   the web Time Tracker. If you are already signed in there, you do not need
   to enter a password again; otherwise sign in on the web first.
3. Check that the confirmation code matches desktop Settings, then click
   **Connect desktop**. The desktop signs in automatically and shows
   **Connected**. Approve only requests you started on your own desktop.

Email/password sign-in remains available as a fallback.

The password is used only to sign in. Access and refresh tokens are stored in
the Linux Secret Service keyring, scoped to the API URL. The keyring must be
available and unlocked. Nonsecret settings are stored in GSettings. Sign out
from Settings before changing accounts; sign-out clears the local
desktop credentials without ending a work session.

## Use

- **Play** starts work, or restores the session already running on the server.
- **Stop** finishes and saves the current work session.
- In **Settings → Timer → Timer mode**, choose **Current session** (default)
  or **Daily total**. Current session returns to zero after Stop. Daily total
  keeps all work recorded for your account today, including web sessions, and
  resumes accumulating after Play. The setting survives restarts and updates.
- Click the timer for connection status, **Refresh now**, **Open web tracker**,
  and **Settings**.

The extension listens to an authenticated Server-Sent Events (SSE) stream. The API
sends the current session and computed timer totals on connection and pushes new
snapshots when a session starts, ends, or is abandoned in any client, and at
server midnight. The one-second display ticks locally without API requests.

The API server's timezone defines a day. Work from 23:50 to 00:05 contributes
ten minutes to the previous day and five to the next. Daily total resets at
server midnight while Current session continues uninterrupted. Sleep, shutdown,
and disconnection do not stop work; stop or explicitly discard the session when
needed. Discarded sessions contribute zero. Session age alone never discards work.

The stream reconnects with jittered backoff after network failures and receives
a fresh snapshot after reconnection. It renews authentication when its access
token expires. The web tracker uses the same SSE endpoint through an authenticated
fetch stream. Both clients receive pushed updates; the web refreshes today's
statistics after changes, on reconnection, and at server midnight. HTTP remains
the transport for start/stop commands.

When the API is unavailable, Start and Stop save timestamp observations on this
desktop. The red panel shows **Offline**, or a provisional elapsed timer while
working. Open the menu to see **Working offline** or **Waiting to sync** after stopping.
While offline, the panel shows the current session timer even if Daily total is
selected, then returns to the selected mode on reconnection. Daily totals are
unavailable offline; the API owns all accounting and day boundaries.

The desktop menu shows how many sessions are waiting to sync (including ongoing
offline work), progress while uploading, and the last successful synchronization
time. Counts decrease only after API confirmation; failed uploads remain queued.
The timestamp survives restarts and is scoped to the server and account. Use
**Sync now** to retry queued work, or **Refresh now** when the queue is empty.

Saved work survives extension reloads and is scoped to the server and account ID.
It remains saved after sign-out, and resumes synchronization when that same account
reconnects. Failed uploads retry automatically with bounded backoff and stable IDs.
If the stored refresh token is rejected, sign in again through Settings.

The API preserves session records and counts overlapping ranges only once in
daily, weekly, and timer totals. For example, desktop work from 10:00–10:35 and
web work from 10:20–10:50 contribute 50 minutes. Offline stops target their original
session; they never stop a newer web session. If a web session is running when
the desktop reconnects, the desktop adopts it. Otherwise, ongoing offline work
becomes the active server session.

Deploy the API with its database migration before updating the desktop extension.
Automated tests cover offline persistence and server reconciliation; a real
GNOME smoke test (API outage, restart, reconnection, and overlapping web work)
is still required to verify the panel and dconf behavior on the desktop.

The cross-client suite additionally tests real API/browser synchronization with
desktop workers restarted from disk-backed GNOME settings, including a simulated
week offline and a committed upload whose response is lost. Run
`bun run test:web:e2e:integration offline-sync.spec.ts` from the repository root.
See [the integration test guide](../web/e2e-integration/README.md) for coverage
and the distinction between isolated keyfile settings and the native desktop.

## Develop and update

To test, build/typecheck, lint the repository, package, and install in one command:

```bash
bun run desktop:update
```

Each step must pass before the next runs. The build runs once. After installation,
reload GNOME as described above; this command does not restart your desktop.
To run the same checks and packaging without installing:

```bash
bun run desktop:update --skip-install
```

Individual commands:

```bash
bun --filter desktop typecheck
bun --filter desktop test
bun run desktop:build
bun run desktop:package
bun run lint:check
bun --filter web test:e2e e2e/dashboard/time-tracker/time-tracker.spec.ts
```

Source lives in `src/`; `dist/` and `build/` are generated and ignored. Bun bundles
TypeScript and compatible dependencies into GJS JavaScript. GNOME imports stay
external. Build scripts also compile the settings schema.

To update, run `bun run desktop:install` again, then reload your GNOME session as
described above. Disabling and enabling alone does not reliably reload changed
JavaScript. GNOME 46 is the supported version; test before adding other shell
versions to `metadata.json`.

For logs:

```bash
journalctl --user -f -o cat
```

Look for GNOME Shell extension errors or preferences-process errors. Never add
credentials or tokens to diagnostic logs.

## Remove

```bash
gnome-extensions prefs my-time@my-time.local
# Sign out in the settings window to clear stored desktop credentials.
gnome-extensions disable my-time@my-time.local
gnome-extensions uninstall my-time@my-time.local
```

## References

- [GNOME extension getting started](https://gjs.guide/extensions/development/creating.html)
- [GNOME TypeScript setup](https://gjs.guide/extensions/development/typescript.html)
- [Panel widgets](https://gjs.guide/extensions/topics/st-widgets.html)
- [Preferences](https://gjs.guide/extensions/development/preferences.html)

## Source architecture

```text
src/
├── extension.ts               # Shell composition root
├── prefs.ts                   # Preferences composition root
├── shell/
│   ├── application.ts         # Lifecycle, SSE setup, settings subscription
│   ├── browser-launch.ts      # Browser launch and notifications
│   └── ui/tracker-panel.ts    # St widgets and rendering
├── preferences/
│   └── ui/account-page.ts     # GTK/libadwaita widgets and rendering
├── bll/
│   ├── account-controller.ts  # Sign-in/sign-out workflow and state
│   └── tracker-controller.ts  # Session workflow and state
├── dal/                       # HTTP/SSE, keyring, settings, client factories
└── shared/                    # URLs, elapsed display, error helpers
```

Imports across source folders use the `@/` alias, for example
`@/bll/account-controller`; imports within the same folder remain relative.
Bun resolves these paths during bundling.

Shell and preferences run in separate processes with different UI toolkits.
The entry points assemble the dependencies. Views receive state and callbacks;
controllers receive plain input and publish plain state. Controllers never read
or mutate widgets. The settings store translates GSettings keys into application
values, and API/keyring adapters handle data access.

For example, a sign-in click passes a plain input object to the account
controller. The controller validates it, calls the API, and persists confirmed
connection settings. Its state updates tell the view which controls are enabled
and which message to display. Closing the window disposes the controller, which
unsubscribes from settings and cancels its active adapters.

This layout follows the process separation and module ownership recommendations
in the [GNOME extension best practices](https://gjs.guide/extensions/review-guidelines/best-practices.html).
The folder names are our convention, not an official GNOME template.

## SSE API and deployment

Deploy the API changes before using this extension version. The desktop uses
`GET /api/v1/time-tracker/events` with a Bearer token in the Authorization header.
The `session-state` event contains protocol version `1`, `activeSession`
(the existing session shape or `null`), and a `timer` snapshot with server totals,
capture time, timezone, and day boundaries. The authenticated
`GET /api/v1/time-tracker/timer` endpoint returns the same session/timer pair for
manual reconciliation without transferring session history. New clients accept
older events during rolling upgrades, but Daily total requires the updated API.
HTTP endpoints still handle commands.
An idle stream sends a comment heartbeat every 20 seconds without reading the
database. A stream closes at its access token's expiry; the desktop reconnects
and shares refresh-token rotation with ordinary requests.

Mutations and Postgres notifications commit in the same transaction. Each API
process shares one Postgres listener across its streams, so changes reach devices
connected to other replicas. A listener reconnection reconciles all its local
subscribers. Notifications are not a durable event log: reconnects always send
current state rather than replaying historical events. Slow subscribers have one
pending change flag instead of an unbounded event queue.

The SSE response disables caching and sends `X-Accel-Buffering: no`. Bun's timeout
for this route is 60 seconds, longer than the heartbeat interval. The production
reverse proxy is managed outside this repository through Coolify: verify that it
streams responses without buffering/compression delays and allows idle periods
longer than 20 seconds. The web container's nginx serves static files and does
not proxy this API route. Test the deployed HTTPS endpoint before rollout; local
stream tests do not verify the external proxy configuration.

## Build-time server URLs

Desktop builds use `VITE_API_URL` and `FRONTEND_WEB_URL` (or `VITE_WEB_URL`)
for the GSettings defaults in the packaged schema. Local builds read the web
`.env` and `.env.local`; explicit environment variables take precedence. Without
overrides, defaults are `http://localhost:3000/api/v1` and `http://localhost:5173`.
Production Docker builds use the same API and frontend build arguments as the
web and browser extension. Only these public URLs are included in the ZIP.
Encrypted production env files must be decrypted by the existing deployment
workflow; the desktop build does not decrypt secrets. Previously saved URLs
remain unchanged when updating an installed extension.

## Browser sign-in protocol

Desktop Settings creates a five-minute request and opens its public request ID
on the web. The desktop keeps a separate random secret in memory. The web
requires a signed-in user and explicit account approval, with a matching code
shown on both clients. The desktop checks only this temporary login request
every five seconds until approval, expiry, or closing Settings. This does not
poll session state. The API enforces polling and creation limits, stores only
a hash of the device secret, and atomically consumes approval while saving the
refresh token. Credentials are delivered only to the requesting desktop and
stored in Secret Service; they are not put in URLs or exposed to the web page.

Deploy the API and migration `0014_gigantic_the_anarchist.sql` before publishing
the updated desktop ZIP. Browser and controller tests use mock accounts; a
real GNOME browser/keyring smoke test remains to be performed.

## Desktop connection badge on the web

The web tracker shows **Desktop connected · Synced** when at least one GNOME
extension for the signed-in account has an active authenticated session stream.
The download/setup card is hidden while connected. A closed stream changes the
badge to **Desktop not connected**; if the web stream drops, desktop status is
**unavailable** until reconnection confirms it. This is account-wide status, not
a check that an extension is installed on the browser's own computer.

The API recognizes the existing `my-time-desktop/` user agent, so previously
installed extensions are detected too. Desktop stream leases renew with existing
heartbeats and expire after at most 60 seconds without renewal. Connect and
disconnect changes are delivered through Postgres notifications across API
replicas and a separate `desktop-presence` SSE event. Presence events do not
refresh work-session state or summaries. Deploy migration `0015_low_turbo.sql`
with the API/web update.
