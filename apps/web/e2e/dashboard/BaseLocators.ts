import type { Page } from '@playwright/test'

export type NavKey =
	| 'home'
	| 'workout'
	| 'time-tracker'
	| 'site-blocking'
	| 'permesso-status'
	| 'settings'

/** Shell locators shared by every dashboard tab (sidebar nav, sign-out). */
export class BaseLocators {
	readonly page: Page

	constructor(page: Page) {
		this.page = page
	}

	navLink(key: NavKey) {
		return this.page.getByTestId(`nav-${key}`)
	}

	get signOutButton() {
		return this.page.getByTestId('sign-out-trigger')
	}
}
