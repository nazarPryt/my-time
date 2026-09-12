import { AUTH_ERRORS } from 'contracts'
import { expect, test } from './login.fixtures'
import { mockLoginResponse } from './login.mocks'

test.describe('Login page', () => {
	test.beforeEach(async ({ loginPage }) => {
		await loginPage.goto()
	})

	test('shows login form', async ({ loginPage }) => {
		await expect(loginPage.loginForm).toBeVisible()
		await expect(loginPage.loginEmail).toBeVisible()
		await expect(loginPage.loginPassword).toBeVisible()
		await expect(loginPage.loginSubmit).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ loginPage }) => {
		await loginPage.loginSubmit.click()
		await expect(
			loginPage.loginEmailError.or(loginPage.loginPasswordError).first(),
		).toBeVisible()
	})

	test('shows error message on invalid credentials', async ({
		page,
		loginPage,
	}) => {
		await mockLoginResponse(page, 401, AUTH_ERRORS.INVALID_CREDENTIALS)
		await loginPage.fill('wrong@example.com', 'wrongpassword')
		await loginPage.loginSubmit.click()
		await expect(loginPage.loginPasswordError).toHaveText(
			AUTH_ERRORS.INVALID_CREDENTIALS.message,
		)
	})

	test('shows fallback error on unexpected server error', async ({
		page,
		loginPage,
	}) => {
		await mockLoginResponse(page, 500, { message: 'Internal server error' })
		await loginPage.fill('test@example.com', 'password123')
		await loginPage.loginSubmit.click()
		await expect(loginPage.loginPasswordError).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to register page', async ({ page, loginPage }) => {
		await loginPage.loginRegisterLink.click()
		await expect(page).toHaveURL('/auth/register')
	})
})
