# AGENTS.md — apps/english-quiz

Vue 3 micro frontend loaded by `apps/web` through Module Federation. Read
`docs/micro-frontends.md` before changing how it is built, served or loaded.

- The only public surface is `src/mount.ts` (exposed as `./mount`). It must
  satisfy `RemoteModule<EnglishQuizProps>` from `@my-time/mfe-contracts`.
  Never import from `apps/web`, and never let the host import from here.
- Render only inside the shadow root `mount.ts` creates. Styles live in
  `src/styles/quiz.css` (injected into the shadow root); do not use SFC
  `<style>` blocks — Vite would inject them into the host's `<head>`.
  Use the host's CSS variables (`var(--primary, <fallback>)`) for colors.
- Keep `base` in `vite.config.ts`, the nginx paths, and the host proxy path
  (`/remotes/english-quiz/`) identical.
- Report unrecoverable errors through `onError` and user-facing outcomes
  through `onEvent`; never reach into the host's DOM, storage or globals.
- Contract changes: see "Changing the contract" in `docs/micro-frontends.md`.
- Vue files are kebab-case like everything else (`question-card.vue`).
- Pure logic goes in `src/model/` with `bun:test` tests next to it.
