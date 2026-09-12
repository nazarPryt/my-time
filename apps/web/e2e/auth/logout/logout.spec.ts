import { expect, test } from './logout.fixtures'

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
		await logoutPage.signOutButton.click()
		await logoutPage.confirmDialogCancelBtn.click()

		await expect(logoutPage.confirmDialog).not.toBeVisible()
		await expect(page).toHaveURL(/\/dashboard\/?$/)
	})

	test('confirm signs out and redirects to login', async ({
		page,
		logoutPage,
	}) => {
		await logoutPage.signOutButton.click()
		await logoutPage.confirmDialogConfirmBtn.click()

		await expect(page).toHaveURL('/auth/login')
	})
})
