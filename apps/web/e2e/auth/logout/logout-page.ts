import { BaseLocators } from '../../dashboard/base-locators'
import { DASHBOARD_PATH } from '../../dashboard/home/home-page'

/** Sign-out has no locators of its own — it's a shell action reachable from any dashboard page. */
export class LogoutPage extends BaseLocators {
	async goto() {
		await this.page.goto(DASHBOARD_PATH)
		await this.signOutButton.waitFor({ state: 'visible' })
	}
}
