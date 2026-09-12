import type { Page } from '@playwright/test'
import { SHARED_TEST_IDS } from '@/components/testIds'
import { AUTH_TEST_IDS } from '@/feature/auth/testIds'
import { DASHBOARD_TEST_IDS, type NavKey } from '@/routes/dashboard/testIds'

export type { NavKey }

/** Shell locators shared by every dashboard tab (sidebar nav, sign-out). */
export class BaseLocators {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	navLink(key: NavKey) {
		return this.page.getByTestId(DASHBOARD_TEST_IDS.navLink(key))
	}

	get signOutButton() {
		return this.page.getByTestId(AUTH_TEST_IDS.signOutTrigger)
	}

	/** The shared shadcn ConfirmDialog — only one is ever open at a time, so this is unscoped. */
	get confirmDialog() {
		return this.page.getByTestId(SHARED_TEST_IDS.confirmDialog.root)
	}

	get confirmDialogCancelBtn() {
		return this.confirmDialog.getByTestId(SHARED_TEST_IDS.confirmDialog.cancel)
	}

	get confirmDialogConfirmBtn() {
		return this.confirmDialog.getByTestId(SHARED_TEST_IDS.confirmDialog.confirm)
	}
}
