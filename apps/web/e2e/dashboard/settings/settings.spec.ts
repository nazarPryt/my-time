import { DASHBOARD_PATH } from '../home/HomePage'
import { SETTINGS_PATH } from './SettingsPage'
import { expect, test } from './settings.fixtures'

test.describe('Settings placeholder', () => {
	test('renders all planned sections through direct navigation and reload', async ({
		page,
		settingsPage,
	}) => {
		await settingsPage.goto()
		await expect(settingsPage.sections).toHaveCount(3)
		await expect(settingsPage.sections.nth(0)).toContainText('Profile')
		await expect(settingsPage.sections.nth(1)).toContainText('Preferences')
		await expect(settingsPage.sections.nth(2)).toContainText('Appearance')
		await expect(settingsPage.placeholders).toHaveCount(5)
		await page.reload()
		await expect(settingsPage.settings).toBeVisible()
		await expect(page).toHaveURL(SETTINGS_PATH)
	})

	test('supports navigation to home and back through the dashboard shell', async ({
		page,
		settingsPage,
	}) => {
		await settingsPage.goto()
		await settingsPage.navLink('home').click()
		await expect(settingsPage.dashboardHome).toBeVisible()
		await expect(page).toHaveURL(
			(url) => url.pathname === DASHBOARD_PATH.replace(/\/$/, ''),
		)
		await settingsPage.navLink('settings').click()
		await expect(settingsPage.settings).toBeVisible()
		await expect(page).toHaveURL(SETTINGS_PATH)
	})
})
