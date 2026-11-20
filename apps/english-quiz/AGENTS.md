# AGENTS.md — apps/english-quiz

Vue 3 micro frontend loaded by `apps/web` through Module Federation. Read
`docs/micro-frontends.md` before changing how it is built, served or loaded.

- The only public surface is `src/mount.ts` (exposed as `./mount`). It must
  satisfy `RemoteModule<EnglishQuizProps>` from `@my-time/micro-frontends`.
  Never import from `apps/web`, and never let the host import from here.
- Render only inside the shadow root `mount.ts` creates. Styles are plain
  `.css` files next to the components they style, registered in
  `src/styles.ts` (joined and injected into the shadow root); do not use SFC
  `<style>` blocks — Vite would inject them into the host's `<head>`.
  Use the host's CSS variables (`var(--primary, <fallback>)`) for colors;
  shared primitives and remote-local tokens live in `src/shared/styles/base.css`.
- Layout and conventions: `docs/architecture.md` (modes, layers, data source).
  Vue code follows the official `vuejs-ai/skills@vue-best-practices` skill:
  Composition API with `<script setup lang="ts">`, `shallowRef` for
  primitives, props down / events up, focused composables, pure logic in
  `model/`. File names stay kebab-case (repo rule wins over the skill's
  PascalCase advice).
- Keep `base` in `vite.config.ts`, the nginx paths, and the host proxy path
  (`/remotes/english-quiz/`) identical.
- Sentence-builder content comes from the API through the host's `apiFetch`
  prop (never `fetch` directly, never tokens); shapes and answer rules come
  from `@my-time/contracts/english-quiz`. Topic files live in
  `apps/api/src/features/english-quiz/content/`.
- Report unrecoverable errors through `onError` and user-facing outcomes
  through `onEvent`; never reach into the host's DOM, storage or globals.
  The one exception is the remote's own namespaced localStorage entry
  (`PROGRESS_STORAGE_KEY` in `src/progress/progress-store.ts`); never read or
  write any other key.
- Navigation belongs to the host: no router here. Render the `mode` prop
  (undefined = hub) and ask for changes with a `mode-changed` event. Mode ids
  come only from `ENGLISH_QUIZ_MODES` in `@my-time/micro-frontends`.
- Contract changes: see "Changing the contract" in `docs/micro-frontends.md`.
- Every `data-testid` comes from `ENGLISH_QUIZ_REMOTE_TEST_IDS` in
  `@my-time/micro-frontends` (the host's e2e tests use only test ids). Never
  write a test id as a string literal in a component.
- Every screen that loads data or code gets its own `<screen>-skeleton.vue`
  (see "Skeletons" in `docs/architecture.md`), never a plain "Loading…".
- Vue files are kebab-case like everything else (`question-card.vue`).
- Pure logic goes in `model/` (or a pure `.ts` file) with `bun:test` tests next to it.
