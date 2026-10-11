# Desktop development

Read the root `AGENTS.md` first. This package is a personal GNOME Shell extension
for Ubuntu 24.04 / GNOME 46, implemented in TypeScript and executed by GJS.

## Commands

Run from the monorepo root with Bun:

- `bun run desktop:build` — bundle the extension and preferences, compile settings.
- `bun run desktop:package` — build an installable GNOME extension zip.
- `bun run desktop:install` — package and install into the user's GNOME extensions.
- `bun run desktop:update` — tests → build/typecheck → repository lint → package
  → install; stops on failure. Use `--skip-install` to verify without installation.
- `bun --filter desktop typecheck` — check TypeScript against GNOME 46 definitions.
- `bun --filter desktop test` — test the controller and HTTP client with fake adapters.
- `bun run lint:check` — repository Biome checks.

## Structure and runtime

- `src/extension.ts` and `src/prefs.ts`: thin GNOME entry points / composition roots.
- `src/shell/application.ts`: Shell lifecycle, settings subscription, and SSE setup.
- `src/shell/ui/`: St panel widgets; only imported by the Shell entry point.
- `src/shell/browser-launch.ts`: browser launch and Shell notifications.
- `src/preferences/ui/`: GTK/libadwaita widgets; only imported by preferences.
- `src/bll/`: runtime-independent account and tracker controllers.
- `src/dal/`: API client, Soup transport, Secret Service token store, GSettings
  store, and shared service factories.
- `src/shared/`: URL validation, elapsed-time formatting, and error helpers.

Use `@/` (mapped to `src/` in `tsconfig.json`) for imports across folders;
use relative imports for files in the same folder. Bun resolves aliases when
bundling; keep `gi://`, `resource://`, and package imports unchanged.

Entry points assemble controllers, adapters, and views. Controllers accept plain
input and publish plain state; views render that state and forward user actions.
UI must not perform persistence/network operations or construct controllers.
BLL may import DAL interfaces/types and API errors, but must not import GNOME
APIs or UI. DAL must not import BLL or UI. Shared helpers depend on no application
layer. Keep all GSettings keys and writes in `dal/settings-store.ts`.

Shell and preferences execute in different processes. Never import GTK/Adwaita
from Shell modules or St/Clutter from preferences modules. Shared runtime modules
must not import either UI toolkit. Each resource's owner handles its cleanup.

Architecture references:
- [Extension anatomy](https://gjs.guide/extensions/overview/anatomy.html)
- [GNOME extension best practices](https://gjs.guide/extensions/review-guidelines/best-practices.html)
- [TypeScript setup](https://gjs.guide/extensions/development/typescript.html)

- `schemas/`: GSettings definitions for nonsecret configuration.
- `scripts/`: Bun build, packaging, and installation tooling.
- `metadata.json`: extension identifier and supported GNOME versions.

GJS has no browser DOM or Node/Bun APIs. Use GNOME's St/Clutter widgets in the
panel and GTK4/libadwaita in preferences. Bun is build/test tooling only. Bundle
compatible JS dependencies; keep `gi://` and `resource://` imports external.
Pin GNOME type definitions to the supported shell version. Do not claim support
for other GNOME versions until tested on them.

## Lifecycle and data

Create widgets, settings, sessions, and timers in `enable()`. In `disable()`,
cancel in-flight work, remove GLib sources, disconnect settings signals, and
destroy every actor. Ignore async results from a disabled or replaced controller.
Use asynchronous network/keyring APIs so GNOME Shell stays responsive.

The existing API owns work sessions. Use confirmed SSE session state before
acting while connected; fetch the current session when disconnected. Only show success after API confirmation. Shared
parsing, retry policy, and synchronization guards live in `packages/session-sync`;
keep GNOME transport and UI adapters local. Preserve confirmed
session state on network errors. Receive authoritative session snapshots through
the authenticated SSE endpoint, reconnect with bounded backoff, and reconcile
pushes arriving during commands without applying stale HTTP results. Do not poll
for unchanged session state. Keep the `my-time-desktop/` user agent on the
session stream: the API uses it to track desktop presence for the web badge.
Presence notifications are separate from session snapshots; older desktop
parsers may ignore them. Keep the one-second local render timer and derive
elapsed time from the server's start timestamp with `date-fns`.

Reuse `contracts` schemas, types, and route constants. Browser sign-in uses short-lived API pairing requests approved by the signed-in
web account. Keep the device secret out of browser URLs; cancel polling and
keyring operations when preferences close. Desktop password auth uses the
existing `/auth/login-extension` and `/auth/refresh-extension` routes. Store token
pairs in the Linux Secret Service keyring, scoped to the API URL. Never store
passwords or tokens in GSettings, files, logs, or the repository. Stop requests
before sign-out or account changes. Allow HTTP only for loopback development.

The web synchronization hook stays inside the existing time-tracker feature.
Keep FSD import boundaries. Test desktop-to-web session changes and failed
requests without writing real work sessions to the user's account.

## Installation and verification

Build artifacts live in ignored `dist/` and `build/` directories. Bake public
server URL defaults into the generated GSettings schema using `VITE_API_URL`
and `FRONTEND_WEB_URL` (fallback `VITE_WEB_URL`). Reuse deployment values and
local web env files; never embed credentials or decrypt secrets in build scripts.
Server URLs are build configuration; account preferences expose only email
and password plus browser sign-in, with no editable server URL fields. Preserve
existing user settings when updating the extension. Installation
changes files outside this workspace; obey the session's sandbox permissions.
Do not restart the user's desktop session automatically. Document activation
and GNOME reload instructions in `README.md`.

Keep `TODO.md` honest: distinguish automated checks from a real GNOME/account
smoke test. Keep `CLAUDE.md` as an import of this file.
