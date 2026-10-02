import type { LinkProps } from '@tanstack/react-router'
import { SITE_BLOCKING_ERRORS } from 'contracts'
import { SITE_BLOCKING_PATH } from './SiteBlockingPage'
import { expect, linkedTest as test } from './site-blocking.fixtures'
import {
	MOCK_SITE_NEW,
	MOCK_SITE_REDDIT,
	MOCK_SITE_YOUTUBE,
	mockFavicons,
	mockSiteAdd,
	mockSiteDelete,
	mockSitesList,
} from './site-blocking.mocks'

// Every test here runs with a linked, up-to-date fake extension so the setup
// and update cards stay out of the way — those live in extension.spec.ts.

const SETTINGS_PATH: LinkProps['to'] = '/dashboard/settings'

const isPost = (url: string, method: string) =>
	method === 'POST' && new URL(url).pathname.endsWith('/site-blocking')

test.describe('Site Blocking — block list', () => {
	test.describe('Loading', () => {
		test('shows the loading placeholder until the list resolves', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSitesList(page, undefined, { delayMs: 400 })
			await page.goto(SITE_BLOCKING_PATH)

			await expect(siteBlockingPage.listLoading).toBeVisible()
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
			await expect(siteBlockingPage.listLoading).toBeHidden()
		})

		test('shows an error when the list fails to load', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSitesList(page, [], { status: 500 })
			await page.goto(SITE_BLOCKING_PATH)

			await expect(siteBlockingPage.error).toHaveText(
				'Failed to load blocked sites',
			)
			await expect(siteBlockingPage.listLoading).toBeHidden()
		})
	})

	test.describe('Populated list', () => {
		test.beforeEach(async ({ siteBlockingPage }) => {
			await siteBlockingPage.goto()
		})

		test('renders one row per blocked site, in API order', async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
			await expect(siteBlockingPage.siteDomain(0)).toHaveText('reddit.com')
			await expect(siteBlockingPage.siteDomain(1)).toHaveText('youtube.com')
		})

		test('shows when each site was added as "MMM d, yyyy"', async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.siteAddedAt(0)).toHaveText(
				'Added Sep 14, 2026',
			)
			await expect(siteBlockingPage.siteAddedAt(1)).toHaveText(
				'Added Sep 20, 2026',
			)
		})

		test("loads each site's favicon by domain", async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.siteFavicon(0)).toHaveAttribute(
				'src',
				/[?&]domain=reddit\.com(&|$)/,
			)
			await expect(siteBlockingPage.siteFavicon(1)).toHaveAttribute(
				'src',
				/[?&]domain=youtube\.com(&|$)/,
			)
		})

		test('does not show an error or the empty state', async ({
			siteBlockingPage,
		}) => {
			await expect(siteBlockingPage.error).toHaveCount(0)
			await expect(siteBlockingPage.listEmpty).toHaveCount(0)
		})
	})

	test.describe('Favicon fallback', () => {
		test('hides the favicon when it fails to load, keeping the row', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockFavicons(page, { ok: false })
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.siteFavicon(0)).toHaveCount(0)
			await expect(siteBlockingPage.siteDomain(0)).toHaveText('reddit.com')
		})
	})

	test.describe('Empty list', () => {
		test('shows the empty state and no rows', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSitesList(page, [])
			await siteBlockingPage.goto()

			await expect(siteBlockingPage.listEmpty).toBeVisible()
			await expect(siteBlockingPage.siteList).toHaveCount(0)
		})
	})

	test.describe('Adding a site', () => {
		test.beforeEach(async ({ siteBlockingPage }) => {
			await siteBlockingPage.goto()
		})

		test('POSTs the domain, appends the new row and clears the input', async ({
			page,
			siteBlockingPage,
		}) => {
			const request = page.waitForRequest((req) =>
				isPost(req.url(), req.method()),
			)

			await siteBlockingPage.addSite('twitter.com')

			expect((await request).postDataJSON()).toEqual({ domain: 'twitter.com' })
			await expect(siteBlockingPage.siteRows).toHaveCount(3)
			await expect(siteBlockingPage.siteDomain(2)).toHaveText(
				MOCK_SITE_NEW.domain,
			)
			await expect(siteBlockingPage.domainInput).toHaveValue('')
		})

		test('submits with the Enter key', async ({ page, siteBlockingPage }) => {
			const request = page.waitForRequest((req) =>
				isPost(req.url(), req.method()),
			)

			await siteBlockingPage.domainInput.fill('twitter.com')
			await siteBlockingPage.domainInput.press('Enter')

			await request
			await expect(siteBlockingPage.siteRows).toHaveCount(3)
		})

		test('adding to an empty list replaces the empty state', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSitesList(page, [])
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.listEmpty).toBeVisible()

			await siteBlockingPage.addSite('twitter.com')

			await expect(siteBlockingPage.siteRows).toHaveCount(1)
			await expect(siteBlockingPage.listEmpty).toHaveCount(0)
		})

		test('disables the input and button while the request is in flight', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSiteAdd(page, MOCK_SITE_NEW, { delayMs: 500 })

			await siteBlockingPage.addSite('twitter.com')

			await expect(siteBlockingPage.domainInput).toBeDisabled()
			await expect(siteBlockingPage.addBtn).toBeDisabled()
			await expect(siteBlockingPage.siteRows).toHaveCount(3)
			await expect(siteBlockingPage.domainInput).toBeEnabled()
			await expect(siteBlockingPage.addBtn).toBeEnabled()
		})

		test('does not send a request for an empty domain', async ({
			page,
			siteBlockingPage,
		}) => {
			let posts = 0
			page.on('request', (req) => {
				if (isPost(req.url(), req.method())) posts++
			})

			await siteBlockingPage.addBtn.click()

			// Give a would-be request time to fire before asserting it didn't.
			await expect(siteBlockingPage.addBtn).toBeEnabled()
			await page.waitForLoadState('networkidle')
			expect(posts).toBe(0)
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
		})

		for (const { name, status, body } of [
			{
				name: 'an already-blocked domain (409)',
				status: 409,
				body: SITE_BLOCKING_ERRORS.DOMAIN_ALREADY_BLOCKED,
			},
			{
				name: 'an invalid domain (400)',
				status: 400,
				body: SITE_BLOCKING_ERRORS.INVALID_DOMAIN,
			},
			{ name: 'a server error (500)', status: 500, body: {} },
		]) {
			test(`shows an error and keeps the list unchanged for ${name}`, async ({
				page,
				siteBlockingPage,
			}) => {
				await mockSiteAdd(page, body, { status })

				await siteBlockingPage.addSite('reddit.com')

				await expect(siteBlockingPage.error).toHaveText('Failed to block site')
				await expect(siteBlockingPage.siteRows).toHaveCount(2)
				await expect(siteBlockingPage.addBtn).toBeEnabled()
			})
		}

		test('clears the input even when the add fails (current behaviour)', async ({
			page,
			siteBlockingPage,
		}) => {
			// The page calls reset() after addSite() regardless of the outcome.
			// Pinned here so a refactor changes it deliberately, not by accident.
			await mockSiteAdd(page, {}, { status: 500 })

			await siteBlockingPage.addSite('reddit.com')

			await expect(siteBlockingPage.error).toBeVisible()
			await expect(siteBlockingPage.domainInput).toHaveValue('')
		})

		test('a successful add clears a previous error', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSiteAdd(page, {}, { status: 500 })
			await siteBlockingPage.addSite('reddit.com')
			await expect(siteBlockingPage.error).toBeVisible()

			await mockSiteAdd(page)
			await siteBlockingPage.addSite('twitter.com')

			await expect(siteBlockingPage.error).toHaveCount(0)
			await expect(siteBlockingPage.siteRows).toHaveCount(3)
		})
	})

	test.describe('Removing a site', () => {
		test.beforeEach(async ({ siteBlockingPage }) => {
			await siteBlockingPage.goto()
		})

		test('asks for confirmation, naming the domain', async ({
			siteBlockingPage,
		}) => {
			await siteBlockingPage.openRemoveDialog(0)

			await expect(siteBlockingPage.confirmDialog).toContainText(
				MOCK_SITE_REDDIT.domain,
			)
		})

		test('cancelling keeps the site and sends no request', async ({
			page,
			siteBlockingPage,
		}) => {
			let deletes = 0
			page.on('request', (req) => {
				if (req.method() === 'DELETE') deletes++
			})

			await siteBlockingPage.openRemoveDialog(0)
			await siteBlockingPage.confirmDialogCancelBtn.click()

			await expect(siteBlockingPage.confirmDialog).toHaveCount(0)
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
			expect(deletes).toBe(0)
		})

		test('confirming DELETEs that site by id and removes its row', async ({
			page,
			siteBlockingPage,
		}) => {
			const request = page.waitForRequest((req) => req.method() === 'DELETE')

			await siteBlockingPage.removeSite(1)

			expect(new URL((await request).url()).pathname).toMatch(
				new RegExp(`/site-blocking/${MOCK_SITE_YOUTUBE.id}$`),
			)
			await expect(siteBlockingPage.siteRows).toHaveCount(1)
			await expect(siteBlockingPage.siteDomain(0)).toHaveText('reddit.com')
		})

		test('removes the row optimistically, before the server answers', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSiteDelete(page, { delayMs: 2000 })

			await siteBlockingPage.removeSite(0)

			// Well inside the 2s delay — the row must already be gone.
			await expect(siteBlockingPage.siteRows).toHaveCount(1, { timeout: 1000 })
		})

		test('restores the row and shows an error when the DELETE fails', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSiteDelete(page, { status: 500, delayMs: 300 })

			await siteBlockingPage.removeSite(0)

			await expect(siteBlockingPage.siteRows).toHaveCount(1)
			await expect(siteBlockingPage.error).toHaveText('Failed to remove site')
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
			await expect(siteBlockingPage.siteDomain(0)).toHaveText('reddit.com')
		})

		test('removing the last site shows the empty state', async ({
			page,
			siteBlockingPage,
		}) => {
			await mockSitesList(page, [MOCK_SITE_REDDIT])
			await siteBlockingPage.goto()

			await siteBlockingPage.removeSite(0)

			await expect(siteBlockingPage.listEmpty).toBeVisible()
		})
	})

	test.describe('Navigation', () => {
		test('is reachable from the sidebar', async ({
			page,
			siteBlockingPage,
		}) => {
			await page.goto(SETTINGS_PATH)
			await siteBlockingPage.navLink('site-blocking').click()

			await expect(page).toHaveURL(SITE_BLOCKING_PATH)
			await expect(siteBlockingPage.siteRows).toHaveCount(2)
		})

		test('refetches the list when returning to the page', async ({
			page,
			siteBlockingPage,
		}) => {
			await siteBlockingPage.goto()
			await expect(siteBlockingPage.siteRows).toHaveCount(2)

			await siteBlockingPage.navLink('settings').click()
			await expect(siteBlockingPage.siteBlockingPage).toHaveCount(0)

			// The server's list changed while we were away.
			await mockSitesList(page, [MOCK_SITE_REDDIT])
			await siteBlockingPage.navLink('site-blocking').click()

			await expect(siteBlockingPage.siteRows).toHaveCount(1)
		})
	})
})
