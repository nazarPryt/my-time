# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the monorepo root using `bun`.

```bash
bun run extension:dev       # WXT dev mode — opens Chrome with the extension loaded, hot-reloads
bun run extension:package   # Build the release zip → apps/web/public/my-time-extension.zip
bun --filter extension compile        # Typecheck (tsc --noEmit)
bun --filter extension dev:firefox    # Dev mode in Firefox

# Lint/format — Biome at the root covers this package too
bun run lint:check
```

> **Node 18 caveat:** the system Node (18) is too old for WXT's CLI (`node:util` has no
> `styleText`), so `bun --filter extension build`/`zip` fail. `extension:package` works
> because it runs WXT on Bun's runtime: `cd apps/extension && bun --bun wxt <cmd>`.
> Use the same form for any other WXT command.

## Environment

Copy `.env.example` → `.env`:
- `VITE_API_URL` — API base **including** `/api/v1` (default `http://localhost:3000/api/v1`)
- `VITE_WEB_URL` — web app origin (default `http://localhost:5173`)

Both are **baked in at build time** (`src/shared/config/extension-config.ts`). A zip built
with localhost values only works against a local stack — build release zips with the
production URLs. `VITE_WEB_URL` must match the web app origin exactly: the content script
only talks to that origin.

## Architecture

WXT + React, Manifest V3. Blocks sites using `declarativeNetRequest` (DNR) rules built from
the user's block list, which lives on the API — the extension is a read-only mirror of it.

### Entrypoints (`src/entrypoints/`)

WXT turns each entrypoint into a manifest entry; there is no hand-written `manifest.json`
(see `wxt.config.ts` for name, version, permissions).

- `background/` — service worker. Syncs blocked sites on startup, handles typed messages
  (`messaging.ts`), and reacts to `runtime.onInstalled`: on **install** it opens the web app's
  Site Blocking page; on a **version change** it reloads open web app tabs so they get the
  new content script.
- `content/` — injected into every page, but only acts on `VITE_WEB_URL`. Bridges the web
  app (`window.postMessage`) and the background (`runtime.sendMessage`).
- `popup/` — toolbar popup (email/password login fallback, blocked count, Sync now, sign out).
  The `<title>` in `popup/index.html` is the toolbar hover tooltip.
- `public/block.html` — page that blocked navigations are redirected to (`?domain=…`).

### Layers — UI → BLL → DAL

Mirrors the web app's three-layer rule, but **only by convention** — Biome does not enforce
it here, so check imports yourself. Each file states its layer in a header comment.

```
entrypoints/, features/   UI + React hooks  → call bll/ only (plus messages to background)
bll/                      business logic    → call dal/ only; never fetch() or browser.* directly
dal/                      the only code that touches fetch(), browser.storage, declarativeNetRequest
```

- `dal/api/client.ts` — the only `fetch()` caller. `apiFetch` adds the Bearer token and on a
  401 retries once via `/auth/refresh-extension`, rotating both tokens.
- `dal/storage/*Repository.ts` — one repository per `browser.storage.local` key
  (`my_time_tokens`, `blocked_sites`).
- `dal/dnrAdapter.ts` — the only DNR owner. Each domain gets two rules: redirect `main_frame`
  to `block.html`, block `sub_frame`/`xmlhttprequest`/`other`. Updates replace **all**
  dynamic rules atomically.
- `bll/siteBlocking/siteBlockingService.ts` — `syncBlockedSites()` = fetch → store → apply DNR.

DNR changes must happen in the background context — the popup asks the background to sync
via a `SYNC` message rather than calling the service itself.

### Messaging

Two channels, both typed by hand:

**Extension-internal** (`src/shared/messages.ts` — discriminated unions `ExtensionMessage` /
`ExtensionResponse`): `SYNC`, `EXCHANGE_TOKEN`, `GET_STATUS`. Add a variant to both unions
and a branch in `background/messaging.ts`; async handlers must `return true` to keep the
response channel open.

**Web app ↔ content script** (`window.postMessage`, `MY_TIME_*` types). The web side lives in
`apps/web/src/features/site-blocking/model/use-extension-connection.ts` — change both
sides together:

| Message | Direction | Payload |
|---|---|---|
| `MY_TIME_READY` | ext → web, on content script load | `authenticated`, `version` |
| `MY_TIME_PING` / `MY_TIME_PING_RESULT` | web → ext → web | result carries `authenticated`, `version` |
| `MY_TIME_CONNECT` / `MY_TIME_CONNECT_RESULT` | web → ext → web | `token` → `success` |
| `MY_TIME_SYNC` | web → ext, no reply | — (forwarded to the background as `SYNC`) |

No reply to a ping within 300 ms means "not installed". A content script orphaned by an
extension reload (`browser.runtime.id` undefined) stays silent rather than reporting a
bogus signed-out state.

### Auth

Two ways in, both ending in tokens stored under `my_time_tokens`:
1. **Connect from the web app (primary).** The web app gets a one-time token from
   `POST /auth/extension-token`, posts it as `MY_TIME_CONNECT`; the background exchanges it at
   `/auth/exchange-extension-token` for an access + refresh token pair, then syncs.
2. **Popup login (fallback)** via `/auth/login-extension`.

Sign-out in the popup clears tokens, the cached list, and all DNR rules.

### When does the block list sync?

On service worker startup, right after connecting/login, on the popup's **Sync now**, and
whenever the web app adds or removes a site (it posts `MY_TIME_SYNC` after the API call
succeeds). There is no periodic sync — a change made while no web app tab with the content
script is open (e.g. from another device) arrives at the next one of those.

## Versioning & releases

The version is **not** in `package.json`. It comes from `EXTENSION_VERSION` in
`contracts/src/features/site-blocking/extension-version.ts`, which `wxt.config.ts` imports
by file path (not the `contracts` barrel, to keep zod out of the config). The web app
compares the installed version against the same constant and shows an update prompt
(sidebar dot + update card) when the user's copy is older.

Release order:
1. Bump `EXTENSION_VERSION` (dotted numbers only, e.g. `0.3.0` — Chrome rejects anything else).
2. `bun run extension:package` with production env values.
3. Publish the zip.
4. Deploy the web app.

Publish the zip **before** (or with) the web deploy, or users get prompted to download a
version that isn't up yet.

Distribution is currently a zip installed via **Load unpacked**; the web app's setup card
walks users through it. Once on the Chrome Web Store, set `VITE_EXTENSION_STORE_URL` in the
web app and the cards switch to the store flow. Unpacked installs are identified by folder
path — updating means unzipping over the **same folder**, or the user must reconnect.

CI doesn't build or check the extension, and the web Docker image excludes
`apps/extension` (`.dockerignore`), so the zip isn't part of a deploy automatically.

## Monorepo context

- `contracts/` — shared Zod schemas/types and `EXTENSION_VERSION`. Import from `'contracts'`
  (resolved via `tsconfig.json` paths). Prefer `import type` — a runtime import of a schema
  pulls zod into the extension bundle.
- `apps/api/` — API the extension calls with plain `fetch` (not Eden Treaty).
- `apps/web/` — owns the onboarding UI: `features/site-blocking/` (setup card, update card,
  status badge, connection store).
- Path alias: `@/*` → `src/*`. WXT auto-imports `browser`, `defineBackground`,
  `defineContentScript` — no imports needed for those.
