import Adw from 'gi://Adw?version=1'
import Gtk from 'gi://Gtk?version=4.0'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import { LoginRequestSchema } from 'contracts'
import { ApiClient } from './api/client.js'
import { normalizeApiUrl, normalizeUrl } from './model/config.js'
import { SoupTransport } from './platform/http.js'
import { KeyringTokenStore } from './platform/token-store.js'

export default class MyTimePreferences extends ExtensionPreferences {
	fillPreferencesWindow(window: Adw.PreferencesWindow): void {
		const settings = this.getSettings()
		window.set_default_size(520, 640)
		const page = new Adw.PreferencesPage({
			title: 'my·time',
			icon_name: 'preferences-system-time-symbolic',
		})
		window.add(page)
		const connection = new Adw.PreferencesGroup({
			title: 'Connect your account',
			description:
				'Use the same account as your web tracker. Sign-in tokens are saved in the Linux keyring.',
		})
		page.add(connection)
		const apiUrl = new Adw.EntryRow({
			title: 'API server URL',
			text: settings.get_string('api-url'),
		})
		const webUrl = new Adw.EntryRow({
			title: 'Web application URL',
			text: settings.get_string('web-url'),
		})
		const email = new Adw.EntryRow({
			title: 'Email',
			text: settings.get_string('account-email'),
		})
		const password = new Adw.PasswordEntryRow({ title: 'Password' })
		for (const row of [apiUrl, webUrl, email, password]) connection.add(row)
		const status = new Adw.ActionRow({
			title: 'Account',
			subtitle: 'Sign in to start tracking from the panel.',
		})
		connection.add(status)
		const actions = new Gtk.Box({
			spacing: 12,
			margin_top: 12,
			halign: Gtk.Align.END,
		})
		const signIn = new Gtk.Button({
			label: 'Sign in',
			css_classes: ['suggested-action'],
		})
		const signOut = new Gtk.Button({ label: 'Sign out' })
		actions.append(signOut)
		actions.append(signIn)
		connection.add(actions)

		const info = new Adw.PreferencesGroup({
			title: 'Track from your panel',
			description:
				'▶ starts work. ■ finishes and saves it. Click the timer for Settings or to open the web tracker. Both clients check for changes every five seconds.',
		})
		page.add(info)
		let busy = false
		let closed = false
		let activeClient: ApiClient | null = null
		let activeStorage: KeyringTokenStore | null = null
		const update = () => {
			if (closed) return
			const connected = settings.get_boolean('connected')
			for (const row of [apiUrl, webUrl, email, password])
				row.sensitive = !busy && !connected
			signIn.sensitive = !busy && !connected
			signOut.sensitive = !busy
			if (!busy) {
				status.subtitle = connected
					? `Connected as ${settings.get_string('account-email')}`
					: 'Sign in to start tracking from the panel.'
			}
		}
		const changedId = settings.connect('changed::connected', update)
		update()

		const connect = async () => {
			if (busy || closed) return
			busy = true
			update()
			status.subtitle = 'Signing in…'
			try {
				const server = normalizeApiUrl(apiUrl.text)
				const website = normalizeUrl(webUrl.text)
				const parsed = LoginRequestSchema.safeParse({
					email: email.text.trim(),
					password: password.text,
				})
				if (!parsed.success)
					throw new Error('Enter a valid email address and your password.')
				activeClient = new ApiClient(
					new SoupTransport(server),
					new KeyringTokenStore(server),
				)
				password.text = ''
				await activeClient.login(parsed.data)
				if (closed) return
				settings.delay()
				settings.set_string('api-url', server)
				settings.set_string('web-url', website)
				settings.set_string('account-email', parsed.data.email)
				settings.set_int(
					'account-revision',
					settings.get_int('account-revision') + 1,
				)
				settings.set_boolean('connected', true)
				settings.apply()
				apiUrl.text = server
			} catch (error) {
				if (!closed)
					status.subtitle =
						error instanceof Error
							? error.message
							: 'Unable to sign in. Try again.'
			} finally {
				activeClient?.dispose()
				activeClient = null
				busy = false
				// Preserve the error message until the next action.
				const message = status.subtitle
				update()
				if (!closed && !settings.get_boolean('connected'))
					status.subtitle = message
			}
		}
		const disconnect = async () => {
			if (busy || closed) return
			busy = true
			// Notify the panel before clearing so a pending refresh cannot restore tokens.
			settings.set_boolean('connected', false)
			settings.apply()
			update()
			status.subtitle = 'Signing out…'
			try {
				activeStorage = new KeyringTokenStore(settings.get_string('api-url'))
				await activeStorage.clear()
				if (closed) return
				settings.set_string('account-email', '')
				settings.apply()
				email.text = ''
				password.text = ''
			} catch (error) {
				if (!closed)
					status.subtitle =
						error instanceof Error
							? error.message
							: 'Unable to clear sign-in. Try again.'
			} finally {
				activeStorage?.dispose()
				activeStorage = null
				busy = false
				const message = status.subtitle
				update()
				if (!closed && message !== 'Signing out…') status.subtitle = message
			}
		}
		signIn.connect('clicked', () => {
			void connect()
		})
		password.connect('entry-activated', () => {
			void connect()
		})
		signOut.connect('clicked', () => {
			void disconnect()
		})
		window.connect('close-request', () => {
			closed = true
			activeClient?.dispose()
			activeStorage?.dispose()
			settings.disconnect(changedId)
			password.text = ''
			return false
		})
	}
}
