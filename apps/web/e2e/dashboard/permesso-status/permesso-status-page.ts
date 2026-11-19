import type { LinkProps } from '@tanstack/react-router'
import { PermessoStatusLocators } from './permesso-status.locators'
export const PERMESSO_PATH: LinkProps['to'] = '/dashboard/permesso-status'
export class PermessoStatusPage extends PermessoStatusLocators {
	async goto() {
		await this.page.goto(PERMESSO_PATH)
		await this.root.waitFor({ state: 'visible' })
	}
	async savePracticeNumber(value: string) {
		await this.practiceInput.fill(value)
		await this.practiceSave.click()
	}
	async openReset() {
		await this.resetButton.click()
		await this.confirmDialog.waitFor({ state: 'visible' })
	}
	async confirmReset() {
		await this.openReset()
		await this.confirmDialogConfirmBtn.click()
		await this.finalResetConfirm.click()
	}
}
