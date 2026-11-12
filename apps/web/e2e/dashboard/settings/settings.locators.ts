import type { Locator, Page } from '@playwright/test'
import { SETTINGS_TEST_IDS } from '@/pages/settings/test-ids'
import { DASHBOARD_TEST_IDS } from '@/shared/ui/test-ids'
import { BaseLocators } from '../base-locators'

export class SettingsLocators extends BaseLocators {
	readonly settings: Locator
	readonly sections: Locator
	readonly placeholders: Locator
	readonly dashboardHome: Locator

	constructor(page: Page) {
		super(page)
		this.settings = page.getByTestId(SETTINGS_TEST_IDS.page)
		this.sections = this.settings.getByTestId(SETTINGS_TEST_IDS.section)
		this.placeholders = this.settings.getByTestId(SETTINGS_TEST_IDS.placeholder)
		this.dashboardHome = page.getByTestId(DASHBOARD_TEST_IDS.home)
	}
}
