import type { Locator, Page } from '@playwright/test'
import { AUTH_TEST_IDS } from '@/feature/auth/testIds'

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

		this.registerForm = page.getByTestId(AUTH_TEST_IDS.register.form)
		this.registerName = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.name,
		)
		this.registerEmail = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.email,
		)
		this.registerPassword = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.password,
		)
		this.registerSubmit = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.submit,
		)
		this.registerNameError = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.nameError,
		)
		this.registerEmailError = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.emailError,
		)
		this.registerPasswordError = this.registerForm.getByTestId(
			AUTH_TEST_IDS.register.passwordError,
		)
		this.registerLoginLink = page.getByTestId(AUTH_TEST_IDS.register.loginLink)
	}
}
