import { expect, test } from '@playwright/test'
import { AUTH_ERRORS } from 'contracts'
import { AuthPage } from './pages/AuthPage'

test.describe('Login page', () => {
	let auth: AuthPage

	test.beforeEach(async ({ page }) => {
		auth = new AuthPage(page)
		await auth.gotoLogin()
	})

	test('shows login form', async () => {
		await expect(auth.loginForm).toBeVisible()
		await expect(auth.loginEmail).toBeVisible()
		await expect(auth.loginPassword).toBeVisible()
		await expect(auth.loginSubmit).toBeVisible()
	})

	test('shows validation errors on empty submit', async () => {
		await auth.loginSubmit.click()
		await expect(
			auth.loginEmailError.or(auth.loginPasswordError).first(),
		).toBeVisible()
	})

	test('shows error message on invalid credentials', async () => {
		await auth.mockLoginResponse(401, AUTH_ERRORS.INVALID_CREDENTIALS)
		await auth.fillLogin('wrong@example.com', 'wrongpassword')
		await auth.loginSubmit.click()
		await expect(auth.loginPasswordError).toHaveText(
			AUTH_ERRORS.INVALID_CREDENTIALS.message,
		)
	})

	test('shows fallback error on unexpected server error', async () => {
		await auth.mockLoginResponse(500, { message: 'Internal server error' })
		await auth.fillLogin('test@example.com', 'password123')
		await auth.loginSubmit.click()
		await expect(auth.loginPasswordError).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to register page', async ({ page }) => {
		await auth.loginRegisterLink.click()
		await expect(page).toHaveURL('/auth/register')
	})
})

test.describe('Register page', () => {
	let auth: AuthPage

	test.beforeEach(async ({ page }) => {
		auth = new AuthPage(page)
		await auth.gotoRegister()
	})

	test('shows register form', async () => {
		await expect(auth.registerForm).toBeVisible()
		await expect(auth.registerName).toBeVisible()
		await expect(auth.registerEmail).toBeVisible()
		await expect(auth.registerPassword).toBeVisible()
		await expect(auth.registerSubmit).toBeVisible()
	})

	test('shows validation errors on empty submit', async () => {
		await auth.registerSubmit.click()
		await expect(
			auth.registerNameError
				.or(auth.registerEmailError)
				.or(auth.registerPasswordError)
				.first(),
		).toBeVisible()
	})

	test('shows error message when email is already taken', async () => {
		await auth.mockRegisterResponse(409, AUTH_ERRORS.EMAIL_TAKEN)
		await auth.fillRegister('Test User', 'taken@example.com', 'password123')
		await auth.registerSubmit.click()
		await expect(auth.registerEmailError).toHaveText(
			AUTH_ERRORS.EMAIL_TAKEN.message,
		)
	})

	test('shows fallback error on unexpected server error', async () => {
		await auth.mockRegisterResponse(500, { message: 'Internal server error' })
		await auth.fillRegister('Test User', 'test@example.com', 'password123')
		await auth.registerSubmit.click()
		await expect(auth.registerEmailError).toHaveText(
			AUTH_ERRORS.FALLBACK_MESSAGE.message,
		)
	})

	test('has a link to login page', async ({ page }) => {
		await auth.registerLoginLink.click()
		await expect(page).toHaveURL('/auth/login')
	})
})
