import { AUTH_ERRORS } from 'contracts'
import { ACCESS_TOKEN_KEY } from '@/shared/lib/token-storage'
import { DASHBOARD_PATH } from '../../dashboard/home/HomePage'
import { MOCK_USER } from '../../support/auth.mocks'
import { LOGIN_PATH } from '../login/LoginPage'
import { MOCK_ACCESS_TOKEN, MOCK_LOGIN_SUCCESS } from '../login/login.mocks'
import { expect, test } from './register.fixtures'
import { API_REGISTER, mockRegisterResponse } from './register.mocks'

test.describe('Register page', () => {
	test.beforeEach(async ({ registerPage }) => {
		await registerPage.goto()
	})

	test('shows register form', async ({ registerPage }) => {
		await expect(registerPage.registerForm).toBeVisible()
		await expect(registerPage.registerName).toBeVisible()
		await expect(registerPage.registerEmail).toBeVisible()
		await expect(registerPage.registerPassword).toBeVisible()
		await expect(registerPage.registerSubmit).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ registerPage }) => {
		await registerPage.registerSubmit.click()
		await expect(
			registerPage.registerNameError
				.or(registerPage.registerEmailError)
				.or(registerPage.registerPasswordError)
				.first(),
		).toBeVisible()
	})

	test('shows error message when email is already taken', async ({
		page,
		registerPage,
	}) => {
		await mockRegisterResponse(page, 409, AUTH_ERRORS.EMAIL_TAKEN)
		await registerPage.fill('Test User', 'taken@example.com', 'password123')
		await registerPage.registerSubmit.click()
		await expect(registerPage.registerEmailError).toHaveText(
			AUTH_ERRORS.EMAIL_TAKEN.message,
		)
	})

	test('shows fallback error on unexpected server error', async ({
		page,
		registerPage,
	}) => {
		await mockRegisterResponse(page, 500, { message: 'Internal server error' })
		await registerPage.fill('Test User', 'test@example.com', 'password123')
		await registerPage.registerSubmit.click()
		await expect(registerPage.registerEmailError).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to login page', async ({ page, registerPage }) => {
		await registerPage.registerLoginLink.click()
		await expect(page).toHaveURL(LOGIN_PATH)
	})

	test('registers, authenticates the dashboard and preserves the token on reload', async ({
		page,
		registerPage,
		homePage,
	}) => {
		await registerPage.fill(MOCK_USER.name, MOCK_USER.email, 'password123')
		const submitted = page.waitForRequest(API_REGISTER)
		await registerPage.submit()
		const request = await submitted
		expect(request.method()).toBe('POST')
		expect(request.postDataJSON()).toEqual({
			name: MOCK_USER.name,
			email: MOCK_USER.email,
			password: 'password123',
		})
		await expect(homePage.dashboardHome).toBeVisible()
		await expect(page).toHaveURL(new RegExp(`${DASHBOARD_PATH}?$`))
		expect(
			await page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY),
		).toBe(MOCK_ACCESS_TOKEN)
		await page.reload()
		await expect(homePage.dashboardHome).toBeVisible()
		expect(
			await page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY),
		).toBe(MOCK_ACCESS_TOKEN)
	})

	test('failed registration stores no token and can be retried', async ({
		page,
		registerPage,
		homePage,
	}) => {
		await mockRegisterResponse(page, 409, AUTH_ERRORS.EMAIL_TAKEN)
		await registerPage.fill(MOCK_USER.name, MOCK_USER.email, 'password123')
		await registerPage.submit()
		await expect(registerPage.registerEmailError).toHaveText(
			AUTH_ERRORS.EMAIL_TAKEN.message,
		)
		expect(
			await page.evaluate((key) => localStorage.getItem(key), ACCESS_TOKEN_KEY),
		).toBeNull()
		await expect(registerPage.registerSubmit).toBeEnabled()
		await mockRegisterResponse(page, 200, MOCK_LOGIN_SUCCESS)
		await registerPage.registerEmail.fill('new-user@example.com')
		await registerPage.submit()
		await expect(homePage.dashboardHome).toBeVisible()
	})
})
