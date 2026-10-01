import type { LinkProps } from '@tanstack/react-router'
import { TimeTrackerLocators } from './time-tracker.locators'

export const TIME_TRACKER_PATH: LinkProps['to'] = '/dashboard/time-tracker'

export class TimeTrackerPage extends TimeTrackerLocators {
	async goto() {
		await this.page.goto(TIME_TRACKER_PATH)
		// Wait past the loading placeholder — the status badge only renders once
		// the active/today requests have resolved.
		await this.statusBadge.waitFor({ state: 'visible' })
	}

	async start() {
		await this.startBtn.click()
	}

	async stop() {
		await this.stopBtn.click()
	}

	/** Opens the "Delete session?" confirm dialog (does not confirm). */
	async openDeleteDialog() {
		await this.deleteTrigger.click()
		await this.confirmDialog.waitFor({ state: 'visible' })
	}

	async confirmDelete() {
		await this.openDeleteDialog()
		await this.confirmDialogConfirmBtn.click()
	}
}
