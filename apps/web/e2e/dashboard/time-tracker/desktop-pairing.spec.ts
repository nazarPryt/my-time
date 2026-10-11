import { LoginPage } from '../../auth/login/LoginPage'
import { mockLoginResponse } from '../../auth/login/login.mocks'
import { API_ME, MOCK_USER } from '../../support/auth.mocks'
import {
	API_DESKTOP_APPROVE,
	DESKTOP_CONFIRMATION_CODE,
	DESKTOP_REQUEST_ID,
	mockDesktopApproval,
	mockDesktopRequest,
} from './desktop-pairing.mocks'
import { expect, test } from './time-tracker.fixtures'

test('uses the current web account only after explicit desktop approval', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page)
	await mockDesktopApproval(page)
	let approvalCount = 0
	page.on('request', (request) => {
		if (request.url().endsWith('/desktop-pairing/approve')) approvalCount++
	})
	await timeTrackerPage.connectDesktop(DESKTOP_REQUEST_ID)
	await expect(timeTrackerPage.desktopCode).toHaveText(
		DESKTOP_CONFIRMATION_CODE,
	)
	await expect(timeTrackerPage.desktopAccount).toContainText(MOCK_USER.email)
	expect(approvalCount).toBe(0)
	const approved = page.waitForRequest(API_DESKTOP_APPROVE)
	await timeTrackerPage.approveDesktop()
	expect((await approved).postDataJSON()).toEqual({
		requestId: DESKTOP_REQUEST_ID,
	})
	await expect(timeTrackerPage.desktopApproved).toBeVisible()
	await expect(timeTrackerPage.desktopConnect).toBeHidden()
	await expect(page).toHaveURL('/dashboard/time-tracker')
	await timeTrackerPage.desktopDismiss.click()
	await expect(timeTrackerPage.desktopCard).toBeHidden()
	await expect(timeTrackerPage.timer).toBeVisible()
})

test('expired requests cannot be approved', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page, 404)
	await timeTrackerPage.connectDesktop(DESKTOP_REQUEST_ID)
	await expect(timeTrackerPage.desktopError).toContainText('expired')
	await expect(timeTrackerPage.desktopConnect).toBeHidden()
})

test('failed approval shows a retry message', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page)
	await mockDesktopApproval(page, 404)
	await timeTrackerPage.connectDesktop(DESKTOP_REQUEST_ID)
	await timeTrackerPage.approveDesktop()
	await expect(timeTrackerPage.desktopError).toContainText('Unable to connect')
})

test('web login preserves the pending desktop request', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page)
	await mockDesktopApproval(page)
	let signedIn = false
	await page.route(API_ME, (route) =>
		route.fulfill({
			status: signedIn ? 200 : 401,
			contentType: 'application/json',
			body: JSON.stringify(signedIn ? MOCK_USER : { code: 'UNAUTHORIZED' }),
		}),
	)
	await mockLoginResponse(page, 200, {
		user: MOCK_USER,
		tokens: { accessToken: 'mock-access-token' },
	})
	await page.goto(
		`/dashboard/time-tracker?desktopRequest=${DESKTOP_REQUEST_ID}`,
	)
	const login = new LoginPage(page)
	await expect(login.loginForm).toBeVisible()
	await expect(page).toHaveURL(
		new RegExp(`/auth/login\\?desktopRequest=${DESKTOP_REQUEST_ID}`),
	)
	signedIn = true
	await login.fill(MOCK_USER.email, 'password123')
	await login.loginSubmit.click()
	await expect(timeTrackerPage.desktopCode).toHaveText(
		DESKTOP_CONFIRMATION_CODE,
	)
	await expect(page).toHaveURL(
		new RegExp(
			`/dashboard/time-tracker\\?desktopRequest=${DESKTOP_REQUEST_ID}`,
		),
	)
})

test('refresh after approval does not reload a consumed pairing request', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page)
	await mockDesktopApproval(page)
	await timeTrackerPage.connectDesktop(DESKTOP_REQUEST_ID)
	await timeTrackerPage.approveDesktop()
	await expect(timeTrackerPage.desktopApproved).toBeVisible()
	await expect(page).toHaveURL('/dashboard/time-tracker')
	await mockDesktopRequest(page, 404)
	await page.reload()
	await expect(timeTrackerPage.timer).toBeVisible()
	await expect(timeTrackerPage.desktopCard).toBeHidden()
})
test('dismisses an expired request and removes it from the URL', async ({
	page,
	timeTrackerPage,
}) => {
	await mockDesktopRequest(page, 404)
	await timeTrackerPage.connectDesktop(DESKTOP_REQUEST_ID)
	await expect(timeTrackerPage.desktopError).toContainText('expired')
	await timeTrackerPage.desktopDismiss.click()
	await expect(page).toHaveURL('/dashboard/time-tracker')
	await expect(timeTrackerPage.desktopCard).toBeHidden()
})
