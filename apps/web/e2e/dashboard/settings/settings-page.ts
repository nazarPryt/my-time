import type { LinkProps } from '@tanstack/react-router'
import { SettingsLocators } from './settings.locators'

export const SETTINGS_PATH: LinkProps['to'] = '/dashboard/settings'

export class SettingsPage extends SettingsLocators {
	async goto() {
		await this.page.goto(SETTINGS_PATH)
		await this.settings.waitFor({ state: 'visible' })
	}
}
