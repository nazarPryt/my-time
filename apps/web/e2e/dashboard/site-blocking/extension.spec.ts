import type { LinkProps } from '@tanstack/react-router'
import { EXTENSION_VERSION } from 'contracts'
import {
	announceFakeExtension,
	installFakeExtension,
	readFakeExtensionLog,
	setFakeExtensionState,
	simulateTabRefocus,
} from './fake-extension'
import { expect, test } from './site-blocking.fixtures'
import {
	API_EXTENSION_TOKEN,
	MOCK_EXTENSION_TOKEN,
	mockExtensionToken,
} from './site-blocking.mocks'

// Versions relative to EXTENSION_VERSION, so these tests survive a release bump.
const OLD_VERSION = '0.0.1'
const NEWER_VERSION = '999.0.0'

const SETTINGS_PATH: LinkProps['to'] = '/dashboard/settings'

const BADGE = {
	checking: 'Checking extension…',
	notInstalled: 'Extension not installed',
	notLinked: 'Extension not connected',
	linked: 'Extension active',
	update: 'Extension update available',
}

const isTokenRequest = (url: string, method: string) =>
	method === 'POST' && url.includes('/auth/extension-token')

test.describe('Site Blocking — extension', () => {
	test.describe('Status badge', () => {
		test('shows "checking" until the ping is answered', async ({
			page,
			siteBlockingPage,
		}) => {
			// The checking window is at most PING_TIMEOUT_MS (300ms) — too short to
			// assert reliably — so freeze the page's timers: neither the fake's reply
			// nor the timeout can fire until the clock resumes.
			await page.clock.install()
			await page.clock.pauseAt(Date.now() + 1000)
			await installFakeExtension(page)
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.checking)
			await expect(siteBlockingPage.statusBadge).toHaveAttribute(
				'data-variant',
				'outline',
			)
			// No card while we don't know yet — avoids flashing the setup guide.
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
			await expect(siteBlockingPage.updateCard).toHaveCount(0)

			await page.clock.resume()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
		})

		test('a reply slower than the 300ms ping timeout counts as not installed', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { pingDelayMs: 1000 })
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notInstalled)
			await expect(siteBlockingPage.setupCard).toBeVisible()
		})

		for (const { name, state, label, variant } of [
			{
				name: 'not installed',
				state: null,
				label: BADGE.notInstalled,
				variant: 'warning',
			},
			{
				name: 'installed but not connected',
				state: { authenticated: false },
				label: BADGE.notLinked,
				variant: 'warning',
			},
			{
				name: 'connected and up to date',
				state: {},
				label: BADGE.linked,
				variant: 'success',
			},
			{
				name: 'connected but outdated',
				state: { version: OLD_VERSION },
				label: BADGE.update,
				variant: 'warning',
			},
			{
				name: 'not connected and outdated',
				state: { authenticated: false, version: OLD_VERSION },
				label: BADGE.notLinked,
				variant: 'warning',
			},
		]) {
			test(`${name} → "${label}"`, async ({ page, siteBlockingPage }) => {
				if (state) await installFakeExtension(page, state)
				await siteBlockingPage.goto()

				await expect(siteBlockingPage.statusBadge).toHaveText(label)
				await expect(siteBlockingPage.statusBadge).toHaveAttribute(
					'data-variant',
					variant,
				)
			})
		}
	})

	test.describe('Not installed', () => {
		test.beforeEach(async ({ siteBlockingPage }) => {
			// No fake extension: the ping times out.
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notInstalled)
		})

		test('shows the setup card with step 1 pending and step 2 locked', async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.setupCard).toBeVisible()
			await expect(
				siteBlockingPage.stepDone(siteBlockingPage.installStep),
			).toHaveCount(0)
			await expect(siteBlockingPage.connectStep).toHaveAttribute(
				'data-disabled',
				'true',
			)
			await expect(siteBlockingPage.connectBtn).toHaveCount(0)
			await expect(siteBlockingPage.updateCard).toHaveCount(0)
		})

		test('offers the versioned extension zip as a download', async ({
			siteBlockingPage,
		}) => {
			// Dev has no VITE_EXTENSION_STORE_URL, so the manual-install path renders.
			await expect(siteBlockingPage.storeLink).toHaveCount(0)
			await expect(siteBlockingPage.downloadLink).toHaveAttribute(
				'download',
				'',
			)
			await expect(siteBlockingPage.downloadLink).toHaveAttribute(
				'href',
				new RegExp(
					`/my-time-extension\\.zip\\?v=${EXTENSION_VERSION.replaceAll('.', '\\.')}$`,
				),
			)
		})

		test('copies chrome://extensions to the clipboard', async ({
			page,
			context,
			siteBlockingPage,
		}) => {
			await context.grantPermissions(['clipboard-read', 'clipboard-write'])
			const chip = siteBlockingPage.copyableUrl(siteBlockingPage.setupCard)
			const copied = siteBlockingPage.copyableUrlCopied(
				siteBlockingPage.setupCard,
			)

			await expect(chip).toHaveText('chrome://extensions')
			await expect(copied).toHaveCount(0)
			await chip.click()

			await expect(copied).toBeVisible()
			expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
				'chrome://extensions',
			)
			// The check mark reverts to the copy icon after a moment.
			await expect(copied).toHaveCount(0, { timeout: 3000 })
		})

		test('"Reload this page" picks up an extension installed meanwhile', async ({
			page,
			siteBlockingPage,
		}) => {
			// Chrome only injects content scripts on load, so a fresh install is
			// invisible until the reload.
			await installFakeExtension(page, { authenticated: false })

			await siteBlockingPage.reloadBtn.click()

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
			await expect(siteBlockingPage.connectBtn).toBeVisible()
		})

		test('shows no update dot in the sidebar', async ({ siteBlockingPage }) => {
			await expect(siteBlockingPage.updateDot).toHaveCount(0)
		})
	})

	test.describe('Extension arriving in an open tab', () => {
		test.beforeEach(async ({ page, siteBlockingPage }) => {
			// Listener present but silent = content script not injected yet.
			await installFakeExtension(page, { installed: false })
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notInstalled)
		})

		test('MY_TIME_READY (not signed in) advances to the connect step', async ({
			page,
			siteBlockingPage,
		}) => {
			await announceFakeExtension(page, { authenticated: false })

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
			await expect(
				siteBlockingPage.stepDone(siteBlockingPage.installStep),
			).toBeVisible()
			await expect(siteBlockingPage.connectBtn).toBeVisible()
		})

		test('MY_TIME_READY (signed in) hides the setup card', async ({
			page,
			siteBlockingPage,
		}) => {
			await announceFakeExtension(page, { authenticated: true })

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
		})

		test('returning to the tab re-checks and detects it', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { installed: true })

			await simulateTabRefocus(page)

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
		})
	})

	test.describe('Installed but not connected', () => {
		test.beforeEach(async ({ page, siteBlockingPage }) => {
			await installFakeExtension(page, { authenticated: false })
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
		})

		test('marks step 1 done, hides install steps and unlocks step 2', async ({
			siteBlockingPage,
		}) => {
			await expect(
				siteBlockingPage.stepDone(siteBlockingPage.installStep),
			).toBeVisible()
			await expect(siteBlockingPage.downloadLink).toHaveCount(0)
			await expect(siteBlockingPage.reloadBtn).toHaveCount(0)
			await expect(siteBlockingPage.connectStep).not.toHaveAttribute(
				'data-disabled',
			)
			await expect(siteBlockingPage.connectBtn).toBeEnabled()
			await expect(siteBlockingPage.connectError).toHaveCount(0)
		})

		test('connecting hands a fresh token to the extension and hides the card', async ({
			page,
			siteBlockingPage,
		}) => {
			const tokenRequest = page.waitForRequest((req) =>
				isTokenRequest(req.url(), req.method()),
			)

			await siteBlockingPage.connect()

			await tokenRequest
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
			expect((await readFakeExtensionLog(page)).connectTokens).toEqual([
				MOCK_EXTENSION_TOKEN.token,
			])
		})

		test('shows "Connecting…" and disables the button meanwhile', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockExtensionToken(page, MOCK_EXTENSION_TOKEN, { delayMs: 500 })

			await siteBlockingPage.connect()

			await expect(siteBlockingPage.connectBtn).toHaveText('Connecting…')
			await expect(siteBlockingPage.connectBtn).toBeDisabled()
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
		})

		test('a token API failure shows an error and never messages the extension', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockExtensionToken(page, {}, { status: 500 })

			await siteBlockingPage.connect()

			await expect(siteBlockingPage.connectError).toBeVisible()
			await expect(siteBlockingPage.connectBtn).toBeEnabled()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
			expect((await readFakeExtensionLog(page)).connectTokens).toEqual([])
		})

		test('the extension rejecting the token shows an error', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { connectResult: 'failure' })

			await siteBlockingPage.connect()

			await expect(siteBlockingPage.connectError).toBeVisible()
			await expect(siteBlockingPage.setupCard).toBeVisible()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
		})

		test('the extension never answering times out with an error', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { connectResult: 'silent' })

			await siteBlockingPage.connect()

			await expect(siteBlockingPage.connectBtn).toHaveText('Connecting…')
			// CONNECT_TIMEOUT_MS is 5s.
			await expect(siteBlockingPage.connectError).toBeVisible({
				timeout: 8000,
			})
			await expect(siteBlockingPage.connectBtn).toBeEnabled()
		})

		test('retrying after a failure can succeed and clears the error', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { connectResult: 'failure' })
			await siteBlockingPage.connect()
			await expect(siteBlockingPage.connectError).toBeVisible()

			await setFakeExtensionState(page, { connectResult: 'success' })
			await siteBlockingPage.connect()

			await expect(siteBlockingPage.setupCard).toHaveCount(0)
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			expect((await readFakeExtensionLog(page)).connectTokens).toHaveLength(2)
		})

		test('stays connected after a later re-check', async ({
			page,
			siteBlockingPage,
		}) => {
			await siteBlockingPage.connect()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)

			await simulateTabRefocus(page)

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
		})
	})

	test.describe('Connected and up to date', () => {
		test.beforeEach(async ({ page, siteBlockingPage }) => {
			await installFakeExtension(page)
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
		})

		test('shows neither the setup nor the update card', async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
			await expect(siteBlockingPage.updateCard).toHaveCount(0)
			await expect(siteBlockingPage.updateDot).toHaveCount(0)
		})

		test('never requests an extension token', async ({
			page,
			siteBlockingPage,
		}) => {
			let tokenRequests = 0
			await page.route(API_EXTENSION_TOKEN, (route) => {
				tokenRequests++
				return route.fallback()
			})
			await simulateTabRefocus(page)
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			expect(tokenRequests).toBe(0)
		})

		test('signing out in the extension brings the setup card back on refocus', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { authenticated: false })

			await simulateTabRefocus(page)

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notLinked)
			await expect(siteBlockingPage.connectBtn).toBeVisible()
		})

		test('removing the extension shows the install guide on refocus', async ({
			page,
			siteBlockingPage,
		}) => {
			await setFakeExtensionState(page, { installed: false })

			await simulateTabRefocus(page)

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.notInstalled)
			await expect(siteBlockingPage.downloadLink).toBeVisible()
		})

		test('a newer-than-latest build (dev) is not flagged as outdated', async ({
			page,
			siteBlockingPage,
		}) => {
			await announceFakeExtension(page, { version: NEWER_VERSION })

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
			await expect(siteBlockingPage.updateCard).toHaveCount(0)
		})
	})

	test.describe('Update available', () => {
		test('shows the update card with both versions', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: OLD_VERSION })
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.updateCard).toBeVisible()
			await expect(siteBlockingPage.updateDescription).toContainText(
				`Version ${EXTENSION_VERSION} is out — you have ${OLD_VERSION}.`,
			)
			await expect(siteBlockingPage.setupCard).toHaveCount(0)
		})

		test('an extension that reports no version counts as outdated', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: null })
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.update)
			await expect(siteBlockingPage.updateDescription).toContainText(
				'you have an older version.',
			)
		})

		test('offers the latest zip and the chrome://extensions chip', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: OLD_VERSION })
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.updateDownloadLink).toHaveText(
				`Download v${EXTENSION_VERSION}`,
			)
			await expect(siteBlockingPage.updateDownloadLink).toHaveAttribute(
				'href',
				new RegExp(`\\?v=${EXTENSION_VERSION.replaceAll('.', '\\.')}$`),
			)
			await expect(
				siteBlockingPage.copyableUrl(siteBlockingPage.updateCard),
			).toHaveText('chrome://extensions')
		})

		test('setup outranks the update when not connected', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, {
				authenticated: false,
				version: OLD_VERSION,
			})
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.setupCard).toBeVisible()
			await expect(siteBlockingPage.updateCard).toHaveCount(0)
		})

		test('the card disappears once the updated extension announces itself', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: OLD_VERSION })
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.updateCard).toBeVisible()

			await announceFakeExtension(page, { version: EXTENSION_VERSION })

			await expect(siteBlockingPage.updateCard).toHaveCount(0)
			await expect(siteBlockingPage.updateDot).toHaveCount(0)
			await expect(siteBlockingPage.statusBadge).toHaveText(BADGE.linked)
		})
	})

	test.describe('Sidebar update dot', () => {
		test('marks the Site Blocking nav item when outdated', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: OLD_VERSION })
			await siteBlockingPage.goto()

			await expect(
				siteBlockingPage
					.navLink('site-blocking')
					.locator(siteBlockingPage.updateDot),
			).toBeVisible()
		})

		test('shows on other dashboard tabs too', async ({
			page,
			siteBlockingPage,
		}) => {
			await installFakeExtension(page, { version: OLD_VERSION })
			await page.goto(SETTINGS_PATH)

			await expect(siteBlockingPage.updateDot).toBeVisible()
		})

		test('also shows when installed-but-not-connected and outdated (current behaviour)', async ({
			page,
			siteBlockingPage,
		}) => {
			// updateAvailable only requires "installed", not "linked" — pinned so a
			// refactor changes this on purpose.
			await installFakeExtension(page, {
				authenticated: false,
				version: OLD_VERSION,
			})
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.updateDot).toBeVisible()
		})
	})
})
