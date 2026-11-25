import { readAccessToken } from '../../support/access-token'
import { MOCK_ACCESS_TOKEN } from '../login/login.mocks'
import { LOGIN_PATH } from '../login/login-page'
import { expect, test } from './logout.fixtures'
import { API_LOGOUT, LOGOUT_API_PATH, mockLogoutResponse } from './logout.mocks'

test.describe('Sign out', () => {
	test.beforeEach(async ({ logoutPage }) => {
		await logoutPage.goto()
	})

	test('shows confirm dialog when sign out is clicked', async ({
		logoutPage,
	}) => {
		await logoutPage.signOutButton.click()

		await expect(logoutPage.confirmDialog).toBeVisible()
		await expect(logoutPage.confirmDialog).toContainText('Sign out?')
	})

	test('cancel closes dialog without signing out', async ({
		page,
		logoutPage,
	}) => {
		let logouts = 0
		page.on('request', (request) => {
			if (new URL(request.url()).pathname === LOGOUT_API_PATH) logouts++
		})
		await logoutPage.signOutButton.click()
		await logoutPage.confirmDialogCancelBtn.click()

		await expect(logoutPage.confirmDialog).toBeHidden()
		await expect(page).toHaveURL(/\/dashboard\/?$/)
		expect(await readAccessToken(page)).toBe(MOCK_ACCESS_TOKEN)
		expect(logouts).toBe(0)
	})

	test('confirm revokes the session, clears the token and redirects to login', async ({
		page,
		logoutPage,
	}) => {
		const requested = page.waitForRequest(API_LOGOUT)
		await logoutPage.signOut()
		const request = await requested

		expect(request.method()).toBe('POST')
		expect(request.headers().authorization).toBe(`Bearer ${MOCK_ACCESS_TOKEN}`)
		await expect(page).toHaveURL(LOGIN_PATH)
		expect(await readAccessToken(page)).toBeNull()
	})

	test('signs out locally when the server rejects the logout', async ({
		page,
		logoutPage,
	}) => {
		await mockLogoutResponse(page, 500, { message: 'Internal server error' })
		await logoutPage.signOut()

		await expect(page).toHaveURL(LOGIN_PATH)
		expect(await readAccessToken(page)).toBeNull()
	})

	test('signs out locally when the logout request fails', async ({
		page,
		logoutPage,
	}) => {
		await page.route(API_LOGOUT, (route) => route.abort('internetdisconnected'))
		await logoutPage.signOut()

		await expect(page).toHaveURL(LOGIN_PATH)
		expect(await readAccessToken(page)).toBeNull()
	})
})
