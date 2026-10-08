# Desktop development

Read the root `AGENTS.md` first. This package is a personal GNOME Shell extension
for Ubuntu 24.04 / GNOME 46, implemented in TypeScript and executed by GJS.

## Commands

Run from the monorepo root with Bun:

- `bun run desktop:build` — bundle the extension and preferences, compile settings.
- `bun run desktop:package` — build an installable GNOME extension zip.
- `bun run desktop:install` — package and install into the user's GNOME extensions.
- `bun --filter desktop typecheck` — check TypeScript against GNOME 46 definitions.
- `bun --filter desktop test` — test the controller and HTTP client with fake adapters.
- `bun run lint:check` — repository Biome checks.

## Structure and runtime

- `src/extension.ts`: panel UI, settings signals, polling, and lifecycle wiring.
- `src/prefs.ts`: GTK4/libadwaita connection window; runs in a separate process.
- `src/model/`: runtime-independent timer controller and session display logic.
- `src/api/`: HTTP client and authentication; receives transport and token storage.
- `src/platform/`: GJS adapters for asynchronous Soup HTTP and libsecret storage.
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

The existing API owns work sessions. Fetch the current session before acting,
and only show a successful change after the API confirms it. Preserve confirmed
session state on network errors. Poll every five seconds; derive elapsed time
from the server's start timestamp with `date-fns`.

Reuse `contracts` schemas, types, and route constants. Desktop auth uses the
existing `/auth/login-extension` and `/auth/refresh-extension` routes. Store token
pairs in the Linux Secret Service keyring, scoped to the API URL. Never store
passwords or tokens in GSettings, files, logs, or the repository. Stop requests
before sign-out or account changes. Allow HTTP only for loopback development.

The web synchronization hook stays inside the existing time-tracker feature.
Keep FSD import boundaries. Test desktop-to-web session changes and failed
requests without writing real work sessions to the user's account.

## Installation and verification

Build artifacts live in ignored `dist/` and `build/` directories. Installation
changes files outside this workspace; obey the session's sandbox permissions.
Do not restart the user's desktop session automatically. Document activation
and GNOME reload instructions in `README.md`.

Keep `TODO.md` honest: distinguish automated checks from a real GNOME/account
smoke test. Keep `CLAUDE.md` as an import of this file.
