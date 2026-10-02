import type { LinkProps } from '@tanstack/react-router'
import { SiteBlockingLocators } from './site-blocking.locators'

export const SITE_BLOCKING_PATH: LinkProps['to'] = '/dashboard/site-blocking'

export class SiteBlockingPage extends SiteBlockingLocators {
	/** Navigates and waits until the list has loaded (rows or empty state). */
	async goto() {
		await this.page.goto(SITE_BLOCKING_PATH)
		await this.siteList.or(this.listEmpty).waitFor({ state: 'visible' })
	}

	/** Types a domain and submits via the Block button. */
	async addSite(domain: string) {
		await this.domainInput.fill(domain)
		await this.addBtn.click()
	}

	/** Opens the "Remove blocked site" confirm dialog for a row (does not confirm). */
	async openRemoveDialog(index: number) {
		await this.siteRemoveTrigger(index).click()
		await this.confirmDialog.waitFor({ state: 'visible' })
	}

	async removeSite(index: number) {
		await this.openRemoveDialog(index)
		await this.confirmDialogConfirmBtn.click()
	}

	async connect() {
		await this.connectBtn.click()
	}
}
