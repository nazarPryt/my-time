import type { Page } from '@playwright/test'

export class RuntimeLocators {
	readonly page: Page
	constructor(page: Page) {
		this.page = page
	}
	get email() {
		return this.page.getByTestId('extension-email')
	}
	get password() {
		return this.page.getByTestId('extension-password')
	}
	get loginButton() {
		return this.page.getByTestId('extension-login')
	}
	get signout() {
		return this.page.getByTestId('extension-signout')
	}
	get blockedCount() {
		return this.page.getByTestId('extension-blocked-count')
	}
	get runtimeContent() {
		return this.page.getByTestId('runtime-page')
	}
	get blockedDomain() {
		return this.page.getByTestId('blocked-domain')
	}
	get blockedReturn() {
		return this.page.getByTestId('blocked-return')
	}
}
