import Adw from 'gi://Adw?version=1'
import Gtk from 'gi://Gtk?version=4.0'
import type { AccountState, SignInInput } from '@/bll/account-controller'

interface AccountActions {
	signIn(input: SignInInput): void
	signOut(): void
	close(): void
}

export function createAccountPage(
	window: Adw.PreferencesWindow,
	initial: AccountState,
	actions: AccountActions,
) {
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
		text: initial.apiUrl,
	})
	const webUrl = new Adw.EntryRow({
		title: 'Web application URL',
		text: initial.webUrl,
	})
	const email = new Adw.EntryRow({
		title: 'Email',
		text: initial.email,
	})
	const password = new Adw.PasswordEntryRow({ title: 'Password' })
	for (const row of [apiUrl, webUrl, email, password]) connection.add(row)
	const status = new Adw.ActionRow({
		title: 'Account',
		subtitle: 'Sign in to start tracking from the panel.',
	})
	connection.add(status)
	const buttons = new Gtk.Box({
		spacing: 12,
		margin_top: 12,
		halign: Gtk.Align.END,
	})
	const signIn = new Gtk.Button({
		label: 'Sign in',
		css_classes: ['suggested-action'],
	})
	const signOut = new Gtk.Button({ label: 'Sign out' })
	buttons.append(signOut)
	buttons.append(signIn)
	connection.add(buttons)

	const info = new Adw.PreferencesGroup({
		title: 'Track from your panel',
		description:
			'▶ starts work. ■ finishes and saves it. Click the timer for Settings or to open the web tracker. Both clients check for changes every five seconds.',
	})
	page.add(info)

	const submit = () => {
		if (!signIn.sensitive) return
		const input = {
			apiUrl: apiUrl.text,
			webUrl: webUrl.text,
			email: email.text,
			password: password.text,
		}
		password.text = ''
		actions.signIn(input)
	}
	signIn.connect('clicked', submit)
	password.connect('entry-activated', submit)
	signOut.connect('clicked', () => actions.signOut())
	window.connect('close-request', () => {
		actions.close()
		password.text = ''
		return false
	})
	let previous = initial
	return {
		render(state: AccountState): void {
			for (const row of [apiUrl, webUrl, email, password])
				row.sensitive = !state.busy && !state.connected
			signIn.sensitive = !state.busy && !state.connected
			signOut.sensitive = !state.busy
			status.subtitle = state.message
			// Preserve unsaved input while reflecting confirmed account changes.
			if (state.apiUrl !== previous.apiUrl) apiUrl.text = state.apiUrl
			if (state.webUrl !== previous.webUrl) webUrl.text = state.webUrl
			if (
				state.email !== previous.email ||
				(state.status === 'signed-out' && previous.status !== 'signed-out')
			)
				email.text = state.email
			previous = state
		},
	}
}
