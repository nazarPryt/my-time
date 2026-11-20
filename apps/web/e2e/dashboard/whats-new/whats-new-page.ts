import { SETTINGS_PATH } from '../settings/settings-page'
import { WhatsNewLocators } from './whats-new.locators'

export class WhatsNewPage extends WhatsNewLocators {
	async goto() {
		await this.page.goto(SETTINGS_PATH)
		await this.versionTrigger.waitFor({ state: 'visible' })
	}

	async openReleaseNotes() {
		await this.versionTrigger.click()
		await this.dialog.waitFor({ state: 'visible' })
	}

	async closeReleaseNotes() {
		await this.dialogClose.click()
		await this.dialog.waitFor({ state: 'hidden' })
	}
}
