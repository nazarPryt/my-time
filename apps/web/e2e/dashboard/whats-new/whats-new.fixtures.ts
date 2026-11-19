import { test as base } from '../../support/dashboard.fixtures'
import { WhatsNewPage } from './whats-new-page'

export const test = base.extend<{ whatsNewPage: WhatsNewPage }>({
	whatsNewPage: async ({ page }, use) => {
		await use(new WhatsNewPage(page))
	},
})

export { expect } from '@playwright/test'
