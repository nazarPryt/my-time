import { HomeLocators } from './home.locators'

// The dashboard index route's actual full path (with trailing slash) — not a
// LinkProps['to']: TanStack normalizes navigating an index route to the
// parent path (`/dashboard`, no slash), so `/dashboard/` itself isn't a
// valid `to` value even though it's the real rendered URL.
export const DASHBOARD_PATH = '/dashboard/'

export class HomePage extends HomeLocators {
	async goto() {
		await this.page.goto(DASHBOARD_PATH)
		await this.dashboardHome.waitFor({ state: 'visible' })
	}
}
