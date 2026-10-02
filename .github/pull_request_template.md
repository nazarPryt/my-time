## What

<!-- What does this PR change? One or two sentences, then bullets if needed. -->

## Why

<!-- The problem it solves or the reason for the change. Link an issue if there is one (e.g. "Closes #12"). -->

## How it was tested

<!-- Commands run, manual checks done, anything not tested and why. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactor
- [ ] Docs / tooling / CI

## Pre-flight checklist

- [ ] `bun run lint:check` passes
- [ ] Typecheck passes: `bun run --filter api typecheck`, `bun run --filter web typecheck`, `bun --filter extension compile`
- [ ] Tests for the touched areas pass (`bun run test:api`, `bun --filter web test`, `bun --filter web test:e2e`)
- [ ] Shared API shapes live in `contracts/`, not duplicated in api or web
- [ ] DB schema changed → migration generated (`bun --filter api db:generate`) and committed
- [ ] `apps/extension/` changed → `EXTENSION_VERSION` bumped (or not needed: no behaviour change for users)
- [ ] New env var → added to `.env.example` and the production secrets
