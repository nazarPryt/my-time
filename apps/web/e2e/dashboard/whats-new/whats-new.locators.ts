import type { Locator, Page } from '@playwright/test'
import { RELEASES_TEST_IDS } from '@/features/releases/test-ids'
import { BaseLocators } from '../base-locators'

export class WhatsNewLocators extends BaseLocators {
	readonly versionTrigger: Locator
	readonly unseenDot: Locator
	readonly dialog: Locator
	readonly dialogClose: Locator
	readonly newBadges: Locator

	constructor(page: Page) {
		super(page)
		this.versionTrigger = page.getByTestId(RELEASES_TEST_IDS.versionTrigger)
		this.unseenDot = page.getByTestId(RELEASES_TEST_IDS.unseenDot)
		this.dialog = page.getByTestId(RELEASES_TEST_IDS.dialog)
		this.dialogClose = this.dialog.getByTestId(RELEASES_TEST_IDS.dialogClose)
		this.newBadges = this.dialog.getByTestId(RELEASES_TEST_IDS.newBadge)
	}

	note(version: string) {
		return this.dialog.getByTestId(RELEASES_TEST_IDS.note(version))
	}
}
