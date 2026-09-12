import type { Locator, Page } from '@playwright/test'
import { AUTH_TEST_IDS } from '@/feature/auth/testIds'

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

		this.loginForm = page.getByTestId(AUTH_TEST_IDS.login.form)
		this.loginEmail = this.loginForm.getByTestId(AUTH_TEST_IDS.login.email)
		this.loginPassword = this.loginForm.getByTestId(
			AUTH_TEST_IDS.login.password,
		)
		this.loginSubmit = this.loginForm.getByTestId(AUTH_TEST_IDS.login.submit)
		this.loginEmailError = this.loginForm.getByTestId(
			AUTH_TEST_IDS.login.emailError,
		)
		this.loginPasswordError = this.loginForm.getByTestId(
			AUTH_TEST_IDS.login.passwordError,
		)
		this.loginRegisterLink = page.getByTestId(AUTH_TEST_IDS.login.registerLink)
	}
}
