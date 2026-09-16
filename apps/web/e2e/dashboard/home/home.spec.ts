import { expect, test } from './home.fixtures'

test.describe('Dashboard home', () => {
	test.beforeEach(async ({ homePage }) => {
		await homePage.goto()
	})

	test('renders dashboard home', async ({ homePage }) => {
		await expect(homePage.dashboardHome).toBeVisible()
	})
})
