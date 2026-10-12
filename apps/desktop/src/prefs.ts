import type Adw from 'gi://Adw?version=1'
import Gio from 'gi://Gio'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import { AccountController } from '@/bll/account-controller'
import {
	createApiClient,
	createBrowserLogin,
	createTokenStore,
} from '@/dal/services'
import { GSettingsStore } from '@/dal/settings-store'
import { createAccountPage } from '@/preferences/ui/account-page'
import { createTimerPage } from '@/preferences/ui/timer-page'

export default class MyTimePreferences extends ExtensionPreferences {
	fillPreferencesWindow(window: Adw.PreferencesWindow): void {
		const settings = new GSettingsStore(this.getSettings())
		let controller: AccountController
		const page = createAccountPage(
			window,
			{
				...settings.read(),
				busy: false,
				browserConfirmationCode: null,
				status: 'idle',
				message: '',
			},
			{
				signInWithBrowser: () => {
					void controller.signInWithBrowser()
				},
				signIn: (input) => {
					void controller.signIn(input)
				},
				signOut: () => {
					void controller.signOut()
				},
				close: () => controller.dispose(),
			},
		)
		this.addTimerPage(window, settings)
		controller = new AccountController(
			settings,
			{
				createClient: createApiClient,
				createBrowserLogin,
				openBrowser: (url) =>
					new Promise<void>((resolve, reject) => {
						Gio.AppInfo.launch_default_for_uri_async(
							url,
							null,
							null,
							(_source, result) => {
								try {
									Gio.AppInfo.launch_default_for_uri_finish(result)
									resolve()
								} catch {
									reject(
										new Error(
											'Unable to open your browser. Try email and password instead.',
										),
									)
								}
							},
						)
					}),
				createStorage: createTokenStore,
			},
			(state) => page.render(state),
		)
	}

	private addTimerPage(
		window: Adw.PreferencesWindow,
		settings: GSettingsStore,
	): void {
		const timer = createTimerPage(settings.readTimerMode(), (mode) => {
			if (mode !== settings.readTimerMode()) settings.setTimerMode(mode)
		})
		window.add(timer.page)
		const unsubscribe = settings.subscribeTimerMode(() =>
			timer.render(settings.readTimerMode()),
		)
		window.connect('close-request', () => {
			unsubscribe()
			return false
		})
	}
}
