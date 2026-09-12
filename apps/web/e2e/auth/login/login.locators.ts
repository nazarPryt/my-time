import type { Locator, Page } from '@playwright/test'

export class LoginLocators {
	readonly page: Page

	readonly loginForm: Locator
	readonly loginEmail: Locator
	readonly loginPassword: Locator
	readonly loginSubmit: Locator
	readonly loginEmailError: Locator
	readonly loginPasswordError: Locator
	readonly loginRegisterLink: Locator

	constructor(page: Page) {
		this.page = page

		this.loginForm = page.getByTestId('login-form')
		this.loginEmail = this.loginForm.getByTestId('login-email')
		this.loginPassword = this.loginForm.getByTestId('login-password')
		this.loginSubmit = this.loginForm.getByTestId('login-submit')
		this.loginEmailError = this.loginForm.getByTestId('login-email-error')
		this.loginPasswordError = this.loginForm.getByTestId('login-password-error')
		this.loginRegisterLink = page.getByTestId('login-register-link')
	}
}
