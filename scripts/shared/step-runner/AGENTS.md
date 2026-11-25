# scripts/shared/step-runner

Terminal tooling for repo scripts that run a sequence of steps: `bun run ci:local`
(`scripts/ci-local/`) and `bun run observability:test`
(`scripts/observability-test/`). Keep it free of any one script's details
(ports, compose projects, step lists); those stay in the script.

What it provides:

- `runPipeline` / `createStates` — run named steps in order, stop at the first
  failure or Ctrl+C, record durations.
- `createTui` — the live step list with spinner, current output line and an ETA
  from the previous run's `readTimings`/`writeTimings`.
- `ProcessRunner` — runs commands and remembers the current one so an
  interrupt can stop it; `InterruptGuard` turns Ctrl+C/SIGTERM into cleanup and
  a 130/143 exit code.
- `stepLogPath` / `resetLogDir` / `readLogTail` — one log file per step and the
  tail printed on failure.
- Preflight checks (`checkDocker`, `checkPorts`, `checkPlaywrightChromium`,
  `checkBrowser`) and `formatFailures` to list every problem with its fix.
- `cleanupTask`, `summaryRow`, `printSummaryBox` — the cleanup lines and the
  closing box.

A new runner follows `scripts/observability-test/run-observability-test.ts`:
preflight → `createStates` + `createTui` → `runPipeline` with its own step
runner → failure tail → cleanup → `printSummaryBox`. Put its `config`, `steps`
and step runner in its own `scripts/<name>/` folder.

Import it from the barrel (`../shared/step-runner`). Its tests run with the
other script tests: `bun run test:scripts` (CI and `ci:local`).
