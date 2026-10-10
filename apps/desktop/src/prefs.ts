import type Adw from 'gi://Adw?version=1'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import { AccountController } from '@/bll/account-controller'
import { createApiClient, createTokenStore } from '@/dal/services'
import { GSettingsStore } from '@/dal/settings-store'
import { createAccountPage } from '@/preferences/ui/account-page'

export default class MyTimePreferences extends ExtensionPreferences {
	fillPreferencesWindow(window: Adw.PreferencesWindow): void {
		const settings = new GSettingsStore(this.getSettings())
		let controller: AccountController
		const page = createAccountPage(
			window,
			{ ...settings.read(), busy: false, status: 'idle', message: '' },
			{
				signIn: (input) => {
					void controller.signIn(input)
				},
				signOut: () => {
					void controller.signOut()
				},
				close: () => controller.dispose(),
			},
		)
		controller = new AccountController(
			settings,
			{
				createClient: createApiClient,
				createStorage: createTokenStore,
			},
			(state) => page.render(state),
		)
	}
}
