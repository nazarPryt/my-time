import type { Locator, Page } from '@playwright/test'

export class RegisterLocators {
	readonly page: Page

	readonly registerForm: Locator
	readonly registerName: Locator
	readonly registerEmail: Locator
	readonly registerPassword: Locator
	readonly registerSubmit: Locator
	readonly registerNameError: Locator
	readonly registerEmailError: Locator
	readonly registerPasswordError: Locator
	readonly registerLoginLink: Locator

	constructor(page: Page) {
		this.page = page

		this.registerForm = page.getByTestId('register-form')
		this.registerName = this.registerForm.getByTestId('register-name')
		this.registerEmail = this.registerForm.getByTestId('register-email')
		this.registerPassword = this.registerForm.getByTestId('register-password')
		this.registerSubmit = this.registerForm.getByTestId('register-submit')
		this.registerNameError = this.registerForm.getByTestId(
			'register-name-error',
		)
		this.registerEmailError = this.registerForm.getByTestId(
			'register-email-error',
		)
		this.registerPasswordError = this.registerForm.getByTestId(
			'register-password-error',
		)
		this.registerLoginLink = page.getByTestId('register-login-link')
	}
}
