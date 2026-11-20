# Micro frontends

The dashboard's **English Quiz** tab is a micro frontend: a separate Vue app
(`apps/english-quiz`) that is built, tested, versioned and deployed on its
own, and loaded by the React host (`apps/web`) at runtime.

## Architecture

```
Browser ── https://my-time.example/dashboard/english-quiz
   │
   ▼
web container (nginx) ──────────────────────────────────────────┐
   │  /                         → React SPA (host)              │
   │  /remotes/english-quiz/*   → proxy_pass english-quiz:80 ───┼─► english-quiz container (nginx)
   │                                                            │     mf-manifest.json  (no-cache)
   └────────────────────────────────────────────────────────────┘     remoteEntry.js    (no-cache)
                                                                      assets/*-[hash]   (immutable)
```

| Piece | Where | Role |
|---|---|---|
| Contract | `packages/mfe-contracts` | Types both sides compile against: `mount(el, props) → { update, unmount }`, props, events, contract version |
| Remote | `apps/english-quiz` | Vue 3 app; Module Federation exposes `./mount` |
| Host runtime | `apps/web/src/shared/lib/micro-frontends` | `loadRemoteModule` (MF runtime, timeout, version check) + `<RemoteApp>` (React lifecycle adapter) |
| Host slot | `apps/web/src/features/english-quiz` | Loading skeleton, error/retry UI, passes props, receives events |
| Routing | `vite.config.ts` (dev) / `apps/web/nginx.conf` (prod) | Serve `/remotes/english-quiz/` from the remote, same origin |

## How it works, step by step

1. **Contract first.** `packages/mfe-contracts` defines what host and remote
   may assume about each other. It is framework-agnostic on purpose: the
   host passes a DOM element and plain props; the remote returns
   `update()`/`unmount()`. React never sees Vue and vice versa.
2. **The remote exposes a module.** `@module-federation/vite` builds
   `remoteEntry.js` plus `mf-manifest.json`, which lists every chunk of the
   exposed `./mount` module. File names are content-hashed except those two.
3. **The remote renders into Shadow DOM.** `mount.ts` attaches a shadow root
   and injects its CSS there, so the host's Tailwind reset and the quiz's
   styles cannot affect each other. CSS custom properties (`--primary`,
   `--card`, …) *do* cross the boundary, so the quiz follows the host theme
   and dark mode without sharing code.
4. **The host loads it at runtime.** `loadRemoteModule` registers the remote
   with the Module Federation *runtime* (not the build plugin), so the host
   build never knows the remote's URL or version — the remote can be
   redeployed without rebuilding the host. It enforces a timeout and refuses
   a remote whose `contractVersion` differs from the one the host expects.
5. **The host isolates failures.** `<RemoteApp>` shows a skeleton while
   loading and a "Try again" card if loading, mounting or the remote itself
   fails (the remote reports its own render errors through `onError`, since
   they never reach React's error boundaries). The rest of the dashboard
   keeps working.
6. **Communication.** Host → remote through props (`mode`, `initialLevel`,
   `apiFetch`, `update()` on change). Remote → host through callbacks (`onEvent` with
   `quiz-started` / `quiz-completed` / `mode-changed`). The "Last result" card
   on the page is React rendering data that came from Vue.
7. **Routing: one router, owned by the host.** The remote has no router. The
   host keeps the open mode in its URL (`/dashboard/english-quiz?mode=<id>`,
   validated against `ENGLISH_QUIZ_MODES` from the contract) and passes it as
   the `mode` prop; no `mode` shows the remote's hub. When the learner picks a
   mode or goes back, the remote sends `mode-changed` and waits for the new
   prop. Two routers in one tab (e.g. Vue Router's web history next to
   TanStack Router) would both write to `history` and drift apart.
8. **API access through the host.** The remote never handles tokens or the
   API URL. The host passes `apiFetch(path, init)` (`RemoteApiFetch` in the
   contract; `apps/web/src/shared/lib/api-fetch.ts`): `path` follows the API
   prefix (`/english-quiz/topics`), and the host adds the origin, the access
   token and the refresh on 401. Request/response shapes come from
   `contracts` (the remote imports only `contracts/english-quiz`, never
   `apps/web`). The sentence builder loads topics, a topic's rule and a
   server-picked round this way (contract v3).
9. **Same-origin serving.** The browser always requests
   `/remotes/english-quiz/…` from the site itself. Vite's dev proxy and the
   production nginx forward that to the remote's server. Same URL in every
   environment, no CORS, no extra domain or certificate.
10. **Caching.** Entry files (`mf-manifest.json`, `remoteEntry.js`) are
   `no-cache`, so a new deploy is picked up on the next page load; hashed
   chunks are cached for a year.
11. **Independent deploy.** The remote has its own Dockerfile, compose
   service and GHCR image. nginx resolves the remote per request (Docker DNS
   `resolver`), so the host boots even if the remote is down — users just see
   the quiz's error card until it is back.

## Running it

```bash
bun run dev           # api + web (:5173) + english-quiz (:5174)
bun run quiz:dev      # remote only, with a small fake API (src/dev); open http://localhost:5174/remotes/english-quiz/
bun --filter web test:e2e e2e/dashboard/english-quiz   # web dev server + a built remote (vite preview)
```

E2E specs mock the topic endpoints with `page.route(...)`
(`english-quiz.mocks.ts`). Playwright builds the remote and serves it with
`vite preview`: the remote's dev server, loaded by several workers at once,
kept the remote loading past 5s. A running `bun run dev` is reused instead,
so stop it for a reliable run.

## Changing the contract

- **Additive** (new optional prop, new event type): edit
  `packages/mfe-contracts`, ship the remote, then the host. Old hosts ignore
  what they don't know.
- **Breaking** (renamed/removed prop, changed event shape): bump
  `ENGLISH_QUIZ_CONTRACT_VERSION`. The host shows the error card instead of
  crashing if it meets a remote built for a different version. Deploy both,
  or keep the remote accepting both versions during the rollout.

## Adding another remote

1. Create `apps/<name>` with `@module-federation/vite`, `base:
   '/remotes/<name>/'`, a unique federation `name`, and expose `./mount`
   implementing `RemoteModule` from the contracts package.
2. Add its descriptor + props to `packages/mfe-contracts`.
3. Proxy `/remotes/<name>` in `apps/web/vite.config.ts` and `apps/web/nginx.conf`.
4. Add a feature slice in `apps/web` that renders `<RemoteApp>`.
5. Add its Dockerfile, compose service, deploy image, and CI steps
   (typecheck/test/build in `ci.yml` and `scripts/ci-local.ts`), plus a
   Playwright `webServer` entry.
