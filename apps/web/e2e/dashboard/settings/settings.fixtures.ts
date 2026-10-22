import { test as base } from '../../support/dashboard.fixtures'
import { SettingsPage } from './SettingsPage'
import { mockSettingsNavigation } from './settings.mocks'

export const test = base.extend<{ settingsPage: SettingsPage }>({
	settingsPage: async ({ page }, use) => {
		await mockSettingsNavigation(page)
		await use(new SettingsPage(page))
	},
})

export { expect } from '@playwright/test'
