---
name: e2e-testing
description: Playwright E2E testing patterns, Page Object Model, configuration, CI/CD integration, artifact management, and flaky test strategies.
origin: ECC
---

# E2E Testing Patterns

Comprehensive Playwright patterns for building stable, fast, and maintainable E2E test suites.

## Test File Organization

This project's actual layout (`apps/web/e2e/`) — one folder per dashboard
tab / auth flow, not one flat directory of specs:

```
apps/web/e2e/
├── support/                        # cross-feature helpers, nothing page-specific
│   ├── auth.mocks.ts                # API_ME, MOCK_USER, mockAuth()
│   └── dashboard.fixtures.ts        # base fixture: overrides `page` to auto-mock auth
├── dashboard/
│   ├── BaseLocators.ts              # shell locators (sidebar nav, sign-out) shared by every tab
│   ├── workout/                     # one folder per dashboard tab
│   │   ├── workout.locators.ts      # element lookups only — extends BaseLocators
│   │   ├── workout.mocks.ts         # API path constants + fixture data + page.route() stubs
│   │   ├── WorkoutPage.ts           # extends WorkoutLocators — navigation/interaction only
│   │   ├── workout.fixtures.ts      # test.extend: wires WorkoutPage + its default mocks
│   │   └── workout.spec.ts
│   └── home/                        # same split, plus a describe block per widget
│       └── ...
├── auth/
│   ├── login/                       # same 4-file split, but no BaseLocators (pre-auth page)
│   │   ├── login.locators.ts
│   │   ├── login.mocks.ts
│   │   ├── LoginPage.ts
│   │   ├── login.fixtures.ts
│   │   └── login.spec.ts
│   └── register/                    # separate trio from login — different form, own file set
│       └── ...
├── shared/                          # cross-cutting, not tied to one tab (404, error boundary, auth guard)
│   ├── auth-guard.spec.ts
│   └── error-boundary.spec.ts
└── tsconfig.json
```

Rules for adding a new page/tab:
- New dashboard tab → new folder under `dashboard/`, same 5-file set (`*.locators.ts`, `*.mocks.ts`, `*Page.ts`, `*.fixtures.ts`, `*.spec.ts`).
- New auth-adjacent flow (not behind the dashboard shell) → new folder under `auth/`, same split minus `BaseLocators`.
- A test that isn't about one page's content (routing guards, global error boundary, 404) → `shared/`, plain `@playwright/test` imports, no page object.
- Something more than one feature's spec needs (e.g. a second widget embedded in another tab's page, like the workout chart on dashboard home) → import the *other* feature's `mocks.ts` rather than duplicating its fixture data. The consuming spec still lives under the page it actually renders on.

## Page Object Model (POM): four files, one responsibility each

Don't put locators, mock data, and page actions in one class. Split into
**locators** (what elements exist) → **mocks** (what the network returns) →
**page object** (how you act on the page) → **fixture** (wires the other
three together for a spec). Worked example from `dashboard/workout/`:

**`workout.locators.ts`** — pure `getByTestId` lookups, no navigation, no
`page.route`. A class (not a factory function) so the page object below can
`extend` it and keep flat property access (`workoutPage.header`, not
`workoutPage.locators.header`):

```typescript
import type { Locator, Page } from '@playwright/test'
import { BaseLocators } from '../BaseLocators'

export class WorkoutLocators extends BaseLocators {
  readonly heroCounter: Locator
  readonly totalReps: Locator
  readonly quickAddButtons: Locator
  // ...every other getByTestId lookup

  constructor(page: Page) {
    super(page)
    this.heroCounter = page.getByTestId('hero-counter')
    this.totalReps = this.heroCounter.getByTestId('total-reps')
    this.quickAddButtons = page.getByTestId('quick-add-buttons')
  }

  quickAddBtn(reps: number) {
    return this.quickAddButtons.getByTestId(`quick-add-${reps}`)
  }
}
```

**`workout.mocks.ts`** — API path constants, fixture data, and route-stubbing
functions. Plain functions taking `page` as an argument; they know nothing
about locators:

```typescript
import type { Page } from '@playwright/test'
import type { TodayResponse } from 'contracts'
import { API_PREFIX, WORKOUT_ROUTES } from 'contracts'

export const API_WORKOUT_TODAY = `**${API_PREFIX}${WORKOUT_ROUTES.prefix}${WORKOUT_ROUTES.today}*`

export const MOCK_TODAY_WITH_SETS: TodayResponse = {
  sets: [/* ... */],
  goal: { exerciseType: 'pushups', targetReps: 100 },
  total: 25,
}

export async function mockWorkoutToday(page: Page, data = MOCK_TODAY_WITH_SETS) {
  await page.route(API_WORKOUT_TODAY, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }),
  )
}
```

A test overrides the default by calling the mock function again with new
data — no `page.unroute()` needed. Playwright resolves overlapping
`page.route()` handlers in reverse registration order, so the last one
registered wins as long as it calls `route.fulfill()`/`route.continue()`
(not `route.fallback()`).

**`WorkoutPage.ts`** — extends the locators class, adds only navigation and
interaction helpers. No mock data, no `page.route` calls:

```typescript
import type { Page } from '@playwright/test'
import { WorkoutLocators } from './workout.locators'

export const WORKOUT_PATH = '/dashboard/workout'

export class WorkoutPage extends WorkoutLocators {
  async goto() {
    await this.page.goto(WORKOUT_PATH)
    await this.heroCounter.waitFor({ state: 'visible' })
  }
}
```

**`workout.fixtures.ts`** — a `test.extend` that builds the page object and
applies its default mocks, so specs never repeat setup boilerplate. Chains
off a project-level base fixture (`support/dashboard.fixtures.ts`) that
already mocks auth for every dashboard tab:

```typescript
import { test as base } from '../../support/dashboard.fixtures'
import { WorkoutPage } from './WorkoutPage'
import { mockWorkoutProgress, mockWorkoutToday } from './workout.mocks'

export const test = base.extend<{ workoutPage: WorkoutPage }>({
  workoutPage: async ({ page }, use) => {
    await mockWorkoutToday(page)
    await mockWorkoutProgress(page)
    await use(new WorkoutPage(page))
  },
})

export { expect } from '@playwright/test'
```

## Test Structure

Import `test`/`expect` from the feature's own `*.fixtures.ts`, not from
`@playwright/test` directly — that's what wires up the page object and
default mocks:

```typescript
import { expect, test } from './workout.fixtures'
import { MOCK_TODAY_EMPTY, mockWorkoutToday } from './workout.mocks'

test.describe('Workout page', () => {
  test.describe('Initial load', () => {
    test.beforeEach(async ({ workoutPage }) => {
      await workoutPage.goto()
    })

    test('shows total reps from API response', async ({ workoutPage }) => {
      await expect(workoutPage.totalReps).toHaveText('25')
    })
  })

  test.describe('Empty state (no sets today)', () => {
    test('shows empty placeholder when no sets exist', async ({ page, workoutPage }) => {
      // Override the fixture's default mock before navigating
      await mockWorkoutToday(page, MOCK_TODAY_EMPTY)
      await workoutPage.goto()

      await expect(workoutPage.setsLogEmpty).toBeVisible()
    })
  })
})
```

## Playwright Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'playwright-results.xml' }],
    ['json', { outputFile: 'playwright-results.json' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
```

## Flaky Test Patterns

### Quarantine

```typescript
test('flaky: complex search', async ({ page }) => {
  test.fixme(true, 'Flaky - Issue #123')
  // test code...
})

test('conditional skip', async ({ page }) => {
  test.skip(process.env.CI, 'Flaky in CI - Issue #123')
  // test code...
})
```

### Identify Flakiness

```bash
npx playwright test tests/search.spec.ts --repeat-each=10
npx playwright test tests/search.spec.ts --retries=3
```

### Common Causes & Fixes

**Race conditions:**
```typescript
// Bad: assumes element is ready
await page.click('[data-testid="button"]')

// Good: auto-wait locator
await page.locator('[data-testid="button"]').click()
```

**Network timing:**
```typescript
// Bad: arbitrary timeout
await page.waitForTimeout(5000)

// Good: wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/data'))
```

**Animation timing:**
```typescript
// Bad: click during animation
await page.click('[data-testid="menu-item"]')

// Good: wait for stability
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.locator('[data-testid="menu-item"]').click()
```

## Artifact Management

### Screenshots

```typescript
await page.screenshot({ path: 'artifacts/after-login.png' })
await page.screenshot({ path: 'artifacts/full-page.png', fullPage: true })
await page.locator('[data-testid="chart"]').screenshot({ path: 'artifacts/chart.png' })
```

### Traces

```typescript
await browser.startTracing(page, {
  path: 'artifacts/trace.json',
  screenshots: true,
  snapshots: true,
})
// ... test actions ...
await browser.stopTracing()
```

### Video

```typescript
// In playwright.config.ts
use: {
  video: 'retain-on-failure',
  videosPath: 'artifacts/videos/'
}
```

## CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: ${{ vars.STAGING_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Test Report Template

```markdown
# E2E Test Report

**Date:** YYYY-MM-DD HH:MM
**Duration:** Xm Ys
**Status:** PASSING / FAILING

## Summary
- Total: X | Passed: Y (Z%) | Failed: A | Flaky: B | Skipped: C

## Failed Tests

### test-name
**File:** `tests/e2e/feature.spec.ts:45`
**Error:** Expected element to be visible
**Screenshot:** artifacts/failed.png
**Recommended Fix:** [description]

## Artifacts
- HTML Report: playwright-report/index.html
- Screenshots: artifacts/*.png
- Videos: artifacts/videos/*.webm
- Traces: artifacts/*.zip
```

## Wallet / Web3 Testing

```typescript
test('wallet connection', async ({ page, context }) => {
  // Mock wallet provider
  await context.addInitScript(() => {
    window.ethereum = {
      isMetaMask: true,
      request: async ({ method }) => {
        if (method === 'eth_requestAccounts')
          return ['0x1234567890123456789012345678901234567890']
        if (method === 'eth_chainId') return '0x1'
      }
    }
  })

  await page.goto('/')
  await page.locator('[data-testid="connect-wallet"]').click()
  await expect(page.locator('[data-testid="wallet-address"]')).toContainText('0x1234')
})
```

## Financial / Critical Flow Testing

```typescript
test('trade execution', async ({ page }) => {
  // Skip on production — real money
  test.skip(process.env.NODE_ENV === 'production', 'Skip on production')

  await page.goto('/markets/test-market')
  await page.locator('[data-testid="position-yes"]').click()
  await page.locator('[data-testid="trade-amount"]').fill('1.0')

  // Verify preview
  const preview = page.locator('[data-testid="trade-preview"]')
  await expect(preview).toContainText('1.0')

  // Confirm and wait for blockchain
  await page.locator('[data-testid="confirm-trade"]').click()
  await page.waitForResponse(
    resp => resp.url().includes('/api/trade') && resp.status() === 200,
    { timeout: 30000 }
  )

  await expect(page.locator('[data-testid="trade-success"]')).toBeVisible()
})
```
