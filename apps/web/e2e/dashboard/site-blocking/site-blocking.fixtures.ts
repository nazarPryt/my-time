import { test as base } from '../../support/dashboard.fixtures'
import { installFakeExtension } from './fake-extension'
import { SiteBlockingPage } from './SiteBlockingPage'
import {
	mockExtensionToken,
	mockFavicons,
	mockSiteAdd,
	mockSiteDelete,
	mockSitesList,
} from './site-blocking.mocks'

export const test = base.extend<{ siteBlockingPage: SiteBlockingPage }>({
	siteBlockingPage: async ({ page }, use) => {
		// Default state: two blocked sites. Every endpoint the page can call is
		// stubbed, so no test reaches the real API or Google's favicon service.
		await mockSitesList(page)
		await mockSiteAdd(page)
		await mockSiteDelete(page)
		await mockExtensionToken(page)
		await mockFavicons(page)
		await use(new SiteBlockingPage(page))
	},
})

/**
 * Same page, plus a fake extension that is installed, connected and up to
 * date — the "everything works" state. Specs about the extension itself use
 * the plain `test` and call `installFakeExtension` with the state they need.
 */
export const linkedTest = test.extend({
	page: async ({ page }, use) => {
		await installFakeExtension(page)
		await use(page)
	},
})

export { expect } from '@playwright/test'
