# CI/CD: How to do it professionally

Reference notes on how to wire up a production-grade CI/CD pipeline for this
repo (bun monorepo, Elysia API + Postgres, React/Vite web, Playwright e2e,
deployed via `docker-compose.prod.yml` on a VPS).

**Status:** CI (`.github/workflows/ci.yml`) is implemented and live — lint,
typecheck, API tests, web e2e tests, and a production build run on every PR
and push to `main`/`dev`. Image build/push to GHCR
(`.github/workflows/deploy.yml`, job `build-and-push`) is also live. The
actual VPS deploy (job `deploy` in the same file) is written out but
disabled (`if: false`) until VPS SSH access is wired up — see §10 for what's
left.

## 1. CI and CD are separate concerns

- **CI (Continuous Integration)** — every push/PR gets built and tested
  automatically. Its only job is to answer "is this code safe to merge?"
- **CD (Continuous Deployment/Delivery)** — a separate pipeline that takes
  code that already passed CI and ships it. It only runs on `main` (or a
  tag), never on feature branches.

Keeping them as separate jobs (not one giant script) means a flaky e2e test
never accidentally touches production, and deploy can be re-run without
re-running the whole test suite.

## 2. Branch/environment strategy

```
feature branch → PR → dev → main → tag/release
```

- PRs into `dev`/`main` run **CI only**, gated as a **required status
  check** in GitHub branch protection — nobody can merge if tests fail, no
  exceptions (not even admins, via admin-enforcement).
- Merges to `main` trigger **CD to production**. Optionally, merges to
  `dev` trigger CD to a **staging** environment first (a second VPS or a
  second docker-compose stack) to catch integration issues before prod.

The required check is what actually enforces quality — without it CI is
just a suggestion.

## 3. CI pipeline stages (fail fast, cheapest first)

```
install deps (cached) → lint/format (biome) → typecheck → unit/integration tests → e2e tests → build
```

Cheapest checks first (`biome check`, `tsc --noEmit`) so a typo fails in 10
seconds, not after a 3-minute Postgres+Playwright run.

- **API tests:** use GitHub Actions' native `services:` block to run
  Postgres as a sidecar container for the job, instead of
  `docker-compose.test.yml`. Faster (no Docker-in-Docker) and disposed of
  automatically.
- **Web e2e:** `bunx playwright install --with-deps chromium` then
  `bun --filter web test:e2e`. Upload the Playwright HTML report as a
  build artifact on failure.
- **Caching:** cache `~/.bun/install/cache` keyed on `bun.lock` hash, and
  cache Playwright's browser binaries — difference between a 4-minute and
  a 40-second CI run.

## 4. Build a real artifact, don't deploy from source

Don't `git pull` raw source onto the server and `docker compose build`
there. Build the Docker images **once, in CI**, tag them immutably, push
to a registry:

```
docker build -t ghcr.io/you/my-time-api:sha-<git-sha> apps/api
docker push ghcr.io/you/my-time-api:sha-<git-sha>
```

Why this matters:
- The exact image that passed tests is the exact image that runs in prod
  — no "works in CI, breaks on the server because node_modules drifted."
- Instant rollback: redeploy the previous SHA tag, no rebuild needed.
- The VPS never needs source code or a compiler toolchain, just Docker.

GHCR (GitHub Container Registry) is free for private repos tied to a
GitHub account and integrates with `GITHUB_TOKEN` with zero extra secrets.

## 5. The deploy job

```yaml
deploy:
  needs: [test, build]
  if: github.ref == 'refs/heads/main'
  environment: production   # GitHub Environment, see below
```

Deploy step SSHs to the VPS:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --no-build
```

(`--no-build` since images were already built and pushed in step 4 — the
server only ever pulls.)

Use a **GitHub Environment** (`production`) for this job — free benefits:
- Secrets scoped only to that job (SSH key, DB password), invisible to PR
  builds from forks.
- Optional **required reviewers** — a human approves before prod deploy
  runs.
- A deployment history tab showing what's live and when it went out.

## 6. Database migrations — the part people get wrong

Never run `db:migrate` blindly right before swapping containers.
Professional order:

1. Write migrations to be **backward-compatible** with both old and new
   app code (additive columns, no in-place renames) — this is what makes
   zero-downtime deploys possible at all.
2. Run the migration as its own step, against prod DB, **before** swapping
   the app container.
3. Only then roll the api/web containers to the new image.
4. If step 2 fails, the deploy stops — old containers keep serving
   traffic, nothing breaks.

## 7. Health checks and rollback

After `docker compose up -d`, the deploy job should curl a health endpoint
(`/api/v1/health`) in a retry loop for ~30s before declaring success. If it
never comes up healthy, auto-rollback: re-pull the previous SHA tag and
redeploy it. Without this, "deploy succeeded" only means "the command
exited 0," not "the app is actually serving."

## 8. Secrets

`JWT_SECRET`, `POSTGRES_PASSWORD`, SSH keys, etc. never live in the repo or
in workflow YAML — they're GitHub Environment secrets, injected as env
vars at run time. `.env.example` stays documentation of *what* secrets
exist; real values only exist in GitHub's encrypted store and on the VPS.

## 9. Notifications

A failed **deploy** (not every failed CI run — too noisy) posts to
Slack/Telegram/Discord, so a broken prod push is known immediately rather
than discovered via a user bug report.

## Summary: quick version vs. professional version

| | Quick/local version | Professional version |
|---|---|---|
| Build | Rebuild on the server from source | Build once in CI, immutable image tagged by git SHA |
| Registry | None | GHCR (or similar) |
| Rollback | Manual, rebuild from an old commit | Redeploy previous SHA tag, no rebuild |
| Secrets | `.env` files on server | GitHub Environment secrets, scoped per job |
| Migrations | Run inline with deploy | Separate pre-step, backward-compatible, blocks deploy on failure |
| Prod gate | None | Required status checks + required reviewer approval on `production` environment |
| Failure detection | Notice manually | Health-check retry loop + auto-rollback + alert |

## 10. Manual setup checklist (one-time, GitHub UI)

These can't be done from a workflow file — they're one-time settings you
click through yourself.

1. **Branch protection** on `main` (and `dev`): Settings → Branches → Add
   rule → require status checks `Lint`, `Typecheck`, `API tests`,
   `Web e2e tests`, `Build` (the CI job names) → require branches to be up
   to date before merging → do **not** allow admins/actors to bypass. This
   is what actually enforces quality — without it CI is just a suggestion.
2. **Create the `production` GitHub Environment**: Settings → Environments
   → New environment → `production`. Optionally add a required reviewer so
   a human approves before the deploy job runs.
3. **When VPS SSH access is ready**, to turn on the `deploy` job in
   `.github/workflows/deploy.yml`:
   - Switch `docker-compose.prod.yml`'s `api`/`web` services from `build:`
     to `image: ghcr.io/nazarpryt/my-time-{api,web}:${IMAGE_TAG:-latest}`
     (they still build from source today, which is what local
     `bun run docker:build`/`docker:up` rely on — check that still works
     the way you want it to before/after this change).
   - Add `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY` as secrets scoped to the
     `production` environment.
   - Confirm/adjust `DEPLOY_DIR` in the `deploy` job — it's currently a
     placeholder (`/opt/my-time`) for wherever `docker-compose.prod.yml`
     actually lives on the VPS.
   - Delete the `if: false` line on the `deploy` job.
