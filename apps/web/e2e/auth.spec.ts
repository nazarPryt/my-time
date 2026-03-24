import { expect, test } from '@playwright/test'
import { AUTH_ERRORS } from 'contracts'

const API_LOGIN = '**/api/v1/auth/login'
const API_REGISTER = '**/api/v1/auth/register'

test.describe('Login page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/auth/login')
	})

	test('shows login form', async ({ page }) => {
		await expect(page.getByTestId('login-form')).toBeVisible()
		await expect(page.getByTestId('login-email')).toBeVisible()
		await expect(page.getByTestId('login-password')).toBeVisible()
		await expect(page.getByTestId('login-submit')).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ page }) => {
		await page.getByTestId('login-submit').click()
		await expect(
			page
				.getByTestId('login-email-error')
				.or(page.getByTestId('login-password-error'))
				.first(),
		).toBeVisible()
	})

	test('shows error message on invalid credentials', async ({ page }) => {
		await page.route(API_LOGIN, (route) =>
			route.fulfill({
				status: 401,
				contentType: 'application/json',
				body: JSON.stringify(AUTH_ERRORS.INVALID_CREDENTIALS),
			}),
		)

		await page.getByTestId('login-email').fill('wrong@example.com')
		await page.getByTestId('login-password').fill('wrongpassword')
		await page.getByTestId('login-submit').click()

		await expect(page.getByTestId('login-password-error')).toBeVisible()
		await expect(page.getByTestId('login-password-error')).toHaveText(
			AUTH_ERRORS.INVALID_CREDENTIALS.message,
		)
	})

	test('shows fallback error on unexpected server error', async ({ page }) => {
		await page.route(API_LOGIN, (route) =>
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Internal server error' }),
			}),
		)

		await page.getByTestId('login-email').fill('test@example.com')
		await page.getByTestId('login-password').fill('password123')
		await page.getByTestId('login-submit').click()

		await expect(page.getByTestId('login-password-error')).toBeVisible()
		await expect(page.getByTestId('login-password-error')).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to register page', async ({ page }) => {
		await page.getByTestId('login-register-link').click()
		await expect(page).toHaveURL('/auth/register')
	})
})

test.describe('Register page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/auth/register')
	})

	test('shows register form', async ({ page }) => {
		await expect(page.getByTestId('register-form')).toBeVisible()
		await expect(page.getByTestId('register-name')).toBeVisible()
		await expect(page.getByTestId('register-email')).toBeVisible()
		await expect(page.getByTestId('register-password')).toBeVisible()
		await expect(page.getByTestId('register-submit')).toBeVisible()
	})

	test('shows validation errors on empty submit', async ({ page }) => {
		await page.getByTestId('register-submit').click()
		await expect(
			page
				.getByTestId('register-name-error')
				.or(page.getByTestId('register-email-error'))
				.or(page.getByTestId('register-password-error'))
				.first(),
		).toBeVisible()
	})

	test('shows error message when email is already taken', async ({ page }) => {
		await page.route(API_REGISTER, (route) =>
			route.fulfill({
				status: 409,
				contentType: 'application/json',
				body: JSON.stringify(AUTH_ERRORS.EMAIL_TAKEN),
			}),
		)

		await page.getByTestId('register-name').fill('Test User')
		await page.getByTestId('register-email').fill('taken@example.com')
		await page.getByTestId('register-password').fill('password123')
		await page.getByTestId('register-submit').click()

		await expect(page.getByTestId('register-email-error')).toBeVisible()
		await expect(page.getByTestId('register-email-error')).toHaveText(
			AUTH_ERRORS.EMAIL_TAKEN.message,
		)
	})

	test('shows fallback error on unexpected server error', async ({ page }) => {
		await page.route(API_REGISTER, (route) =>
			route.fulfill({
				status: 500,
				contentType: 'application/json',
				body: JSON.stringify({ message: 'Internal server error' }),
			}),
		)

		await page.getByTestId('register-name').fill('Test User')
		await page.getByTestId('register-email').fill('test@example.com')
		await page.getByTestId('register-password').fill('password123')
		await page.getByTestId('register-submit').click()

		await expect(page.getByTestId('register-email-error')).toBeVisible()
		await expect(page.getByTestId('register-email-error')).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to login page', async ({ page }) => {
		await page.getByTestId('register-login-link').click()
		await expect(page).toHaveURL('/auth/login')
	})
})
