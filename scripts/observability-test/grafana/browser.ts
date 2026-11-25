import { createRequire } from 'node:module'
import { join } from 'node:path'
import { GRAFANA_ADMIN, GRAFANA_URL } from '../config'
import type { Dashboard } from './dashboards'

// Playwright is a dependency of apps/web only; reuse it instead of adding it to the root.
const requireFromWeb = createRequire(
	join(import.meta.dir, '../../../apps/web/package.json'),
)
const { chromium } = requireFromWeb(
	'@playwright/test',
) as typeof import('@playwright/test')

/**
 * Opens every dashboard in a real browser, saves a screenshot and returns the
 * panels that render an error (a query the API check could miss, e.g. a
 * broken transformation or visualization option).
 */
export async function screenshotDashboards(
	dashboards: Dashboard[],
	outDir: string,
	log: (line: string) => void,
): Promise<string[]> {
	const problems: string[] = []
	const browser = await chromium.launch()
	try {
		const page = await browser.newPage({
			viewport: { width: 1600, height: 3200 },
		})
		await page.goto(`${GRAFANA_URL}/login`)
		await page.getByPlaceholder('email or username').fill(GRAFANA_ADMIN.user)
		await page.getByPlaceholder('password').fill(GRAFANA_ADMIN.password)
		await page.getByRole('button', { name: 'Log in' }).click()
		// First login with the default password offers a change; skip it.
		const skip = page.getByRole('button', { name: 'Skip' })
		await skip.click({ timeout: 5000 }).catch(() => {})

		for (const dashboard of dashboards) {
			await page.goto(
				`${GRAFANA_URL}/d/${dashboard.uid}?orgId=1&from=now-1h&to=now&kiosk`,
			)
			await page.waitForLoadState('networkidle')
			await page.waitForTimeout(2000)
			const errors = await page
				.locator('[data-testid="data-testid Panel status error"]')
				.count()
			if (errors > 0)
				problems.push(`${dashboard.title}: ${errors} panel(s) show an error`)
			log(`${dashboard.title}: ${errors ? `${errors} panel error(s)` : 'ok'}`)
			await page.screenshot({
				path: join(outDir, `${dashboard.uid}.png`),
				fullPage: true,
			})
		}
	} finally {
		await browser.close()
	}
	return problems
}
