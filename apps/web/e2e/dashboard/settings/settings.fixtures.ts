import { test as base } from '../../support/dashboard.fixtures'
import { mockSettingsNavigation } from './settings.mocks'
import { SettingsPage } from './settings-page'

export const test = base.extend<{ settingsPage: SettingsPage }>({
	settingsPage: async ({ page }, use) => {
		await mockSettingsNavigation(page)
		await use(new SettingsPage(page))
	},
})

export { expect } from '@playwright/test'
