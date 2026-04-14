import type { Locator, Page } from '@playwright/test'
import { API_PREFIX, AUTH_ROUTES } from 'contracts'

const base = `**${API_PREFIX}${AUTH_ROUTES.prefix}`
export const API_LOGIN = `${base}${AUTH_ROUTES.login}`
export const API_REGISTER = `${base}${AUTH_ROUTES.register}`

export const LOGIN_PATH = '/auth/login'
export const REGISTER_PATH = '/auth/register'

export class AuthPage {
	readonly page: Page

	// Login form (all field locators scoped to the form element)
	readonly loginForm: Locator
	readonly loginEmail: Locator
	readonly loginPassword: Locator
	readonly loginSubmit: Locator
	readonly loginEmailError: Locator
	readonly loginPasswordError: Locator
	readonly loginRegisterLink: Locator // footer — outside the form

	// Register form (all field locators scoped to the form element)
	readonly registerForm: Locator
	readonly registerName: Locator
	readonly registerEmail: Locator
	readonly registerPassword: Locator
	readonly registerSubmit: Locator
	readonly registerNameError: Locator
	readonly registerEmailError: Locator
	readonly registerPasswordError: Locator
	readonly registerLoginLink: Locator // footer — outside the form

	constructor(page: Page) {
		this.page = page

		this.loginForm = page.getByTestId('login-form')
		this.loginEmail = this.loginForm.getByTestId('login-email')
		this.loginPassword = this.loginForm.getByTestId('login-password')
		this.loginSubmit = this.loginForm.getByTestId('login-submit')
		this.loginEmailError = this.loginForm.getByTestId('login-email-error')
		this.loginPasswordError = this.loginForm.getByTestId('login-password-error')
		this.loginRegisterLink = page.getByTestId('login-register-link')

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

	async gotoLogin() {
		await this.page.goto(LOGIN_PATH)
		await this.loginForm.waitFor({ state: 'visible' })
	}

	async gotoRegister() {
		await this.page.goto(REGISTER_PATH)
		await this.registerForm.waitFor({ state: 'visible' })
	}

	async fillLogin(email: string, password: string) {
		await this.loginEmail.fill(email)
		await this.loginPassword.fill(password)
	}

	async fillRegister(name: string, email: string, password: string) {
		await this.registerName.fill(name)
		await this.registerEmail.fill(email)
		await this.registerPassword.fill(password)
	}

	async mockLoginResponse(status: number, body: object) {
		await this.page.route(API_LOGIN, (route) =>
			route.fulfill({
				status,
				contentType: 'application/json',
				body: JSON.stringify(body),
			}),
		)
	}

	async mockRegisterResponse(status: number, body: object) {
		await this.page.route(API_REGISTER, (route) =>
			route.fulfill({
				status,
				contentType: 'application/json',
				body: JSON.stringify(body),
			}),
		)
	}
}
