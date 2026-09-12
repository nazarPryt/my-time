import { HomeLocators } from './home.locators'

export const DASHBOARD_PATH = '/dashboard/'

export class HomePage extends HomeLocators {
	async goto() {
		await this.page.goto(DASHBOARD_PATH)
		await this.dashboardHome.waitFor({ state: 'visible' })
	}
}
