import { AUTH_ERRORS } from 'contracts'
import { ACCESS_TOKEN_KEY } from '@/shared/lib/token-storage'
import { DASHBOARD_PATH } from '../../dashboard/home/HomePage'
import { MOCK_USER } from '../../support/auth.mocks'
import { REGISTER_PATH } from '../register/RegisterPage'
import { LOGIN_PATH } from './LoginPage'
import { expect, test } from './login.fixtures'
import {
	API_LOGIN,
	API_REFRESH,
	holdLoginResponse,
	LOGIN_API_PATH,
	MOCK_ACCESS_TOKEN,
	MOCK_LOGIN_SUCCESS,
	MOCK_REFRESHED_ACCESS_TOKEN,
	MOCK_UNAVAILABLE_ACCESS_TOKEN,
	mockAuthenticatedAccount,
	mockLoginResponse,
	mockRefreshResponse,
	REFRESH_API_PATH,
} from './login.mocks'

const DASHBOARD_URL = new RegExp(`${DASHBOARD_PATH}?$`)

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
		await expect(page).toHaveURL(REGISTER_PATH)
	})

	for (const invalid of [
		{ name: 'malformed email', email: 'not-an-email', password: 'password123' },
		{ name: 'missing password', email: MOCK_USER.email, password: '' },
	]) {
		test(`does not send credentials with ${invalid.name}`, async ({
			page,
			loginPage,
		}) => {
			let requests = 0
			page.on('request', (request) => {
				if (
					request.method() === 'POST' &&
					new URL(request.url()).pathname === LOGIN_API_PATH
				)
					requests++
			})
			await loginPage.fill(invalid.email, invalid.password)
			await loginPage.submit()
			if (!invalid.password)
				await expect(loginPage.loginPasswordError).toBeVisible()
			else
				expect(
					await loginPage.loginEmail.evaluate(
						(input: HTMLInputElement) => input.validity.typeMismatch,
					),
				).toBe(true)
			await expect(loginPage.loginForm).toBeVisible()
			expect(requests).toBe(0)
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBeNull()
		})
	}

	test.describe('Successful login lifecycle', () => {
		test('submits credentials, stores the token and authenticates the dashboard', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			const requested = page.waitForRequest(API_LOGIN)
			await loginPage.submit()
			const request = await requested
			expect(request.method()).toBe('POST')
			expect(request.postDataJSON()).toEqual({
				email: MOCK_USER.email,
				password: 'password123',
			})
			await expect(homePage.dashboardHome).toBeVisible()
			await expect(page).toHaveURL(DASHBOARD_URL)
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBe(MOCK_ACCESS_TOKEN)
		})

		test('submits using Enter', async ({ loginPage, homePage }) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submitWithEnter()
			await expect(homePage.dashboardHome).toBeVisible()
		})

		test('persists authentication across reload and redirects away from login', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(homePage.dashboardHome).toBeVisible()
			await page.reload()
			await expect(homePage.dashboardHome).toBeVisible()
			await page.goto(LOGIN_PATH)
			await expect(page).toHaveURL(DASHBOARD_URL)
			await expect(homePage.dashboardHome).toBeVisible()
			await expect(loginPage.loginForm).toHaveCount(0)
		})

		test('disables submission while the request is pending', async ({
			page,
			loginPage,
			homePage,
		}) => {
			const pending = await holdLoginResponse(page)
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(loginPage.loginSubmit).toBeDisabled()
			await expect.poll(pending.requests).toBe(1)
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBeNull()
			pending.release()
			await expect(homePage.dashboardHome).toBeVisible()
		})

		test('allows retry after rejected credentials without refreshing or storing a token', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await mockLoginResponse(page, 401, AUTH_ERRORS.INVALID_CREDENTIALS)
			let refreshes = 0
			page.on('request', (request) => {
				if (new URL(request.url()).pathname === REFRESH_API_PATH) refreshes++
			})
			await loginPage.fill(MOCK_USER.email, 'wrong-password')
			await loginPage.submit()
			await expect(loginPage.loginPasswordError).toHaveText(
				AUTH_ERRORS.INVALID_CREDENTIALS.message,
			)
			await expect(loginPage.loginSubmit).toBeEnabled()
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBeNull()
			expect(refreshes).toBe(0)
			await mockLoginResponse(page, 200, MOCK_LOGIN_SUCCESS)
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(homePage.dashboardHome).toBeVisible()
		})

		test('signs out after login, clears the token and protects the dashboard', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(homePage.dashboardHome).toBeVisible()
			await homePage.signOutButton.click()
			await homePage.confirmDialogConfirmBtn.click()
			await expect(page).toHaveURL(LOGIN_PATH)
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBeNull()
			await page.goto(DASHBOARD_PATH)
			await expect(loginPage.loginForm).toBeVisible()
			await expect(page).toHaveURL(LOGIN_PATH)
		})

		test('refreshes an expired access token on reload and retries the guard', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(homePage.dashboardHome).toBeVisible()
			await mockAuthenticatedAccount(page, MOCK_REFRESHED_ACCESS_TOKEN)
			await mockRefreshResponse(page, 200, MOCK_REFRESHED_ACCESS_TOKEN)
			const refreshed = page.waitForRequest(API_REFRESH)
			await page.reload()
			expect((await refreshed).method()).toBe('POST')
			await expect(homePage.dashboardHome).toBeVisible()
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBe(MOCK_REFRESHED_ACCESS_TOKEN)
		})

		test('returns to login and clears credentials when refresh is rejected', async ({
			page,
			loginPage,
			homePage,
		}) => {
			await loginPage.fill(MOCK_USER.email, 'password123')
			await loginPage.submit()
			await expect(homePage.dashboardHome).toBeVisible()
			await mockAuthenticatedAccount(page, MOCK_UNAVAILABLE_ACCESS_TOKEN)
			await mockRefreshResponse(page, 401)
			await page.reload()
			await expect(loginPage.loginForm).toBeVisible()
			await expect(page).toHaveURL(LOGIN_PATH)
			expect(
				await page.evaluate(
					(key) => localStorage.getItem(key),
					ACCESS_TOKEN_KEY,
				),
			).toBeNull()
		})
	})
})
