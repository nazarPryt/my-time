import type { Locator, Page } from '@playwright/test'
import { SETTINGS_TEST_IDS } from '@/pages/settings/testIds'
import { DASHBOARD_TEST_IDS } from '@/shared/ui/testIds'
import { BaseLocators } from '../BaseLocators'

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
