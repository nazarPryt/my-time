import { AUTH_ERRORS } from 'contracts'
import { expect, test } from './register.fixtures'
import { mockRegisterResponse } from './register.mocks'

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
		await expect(page).toHaveURL('/auth/login')
	})
})
