import Adw from 'gi://Adw?version=1'
import Gtk from 'gi://Gtk?version=4.0'
import type { AccountState, SignInInput } from '@/bll/account-controller'

interface AccountActions {
	signInWithBrowser(): void
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
			'Use your signed-in browser account, or enter your email and password. Tokens are saved in the Linux keyring.',
	})
	page.add(connection)
	const browserSignIn = new Gtk.Button({
		label: 'Sign in with browser',
		css_classes: ['suggested-action'],
		margin_top: 12,
		margin_bottom: 12,
	})
	browserSignIn.connect('clicked', () => actions.signInWithBrowser())
	connection.add(browserSignIn)
	const email = new Adw.EntryRow({
		title: 'Email',
		text: initial.email,
	})
	const password = new Adw.PasswordEntryRow({ title: 'Password' })
	for (const row of [email, password]) connection.add(row)
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
			'▶ starts work. ■ finishes and saves it. Click the timer for Settings or to open the web tracker. Changes sync automatically between desktop and web.',
	})
	page.add(info)

	const confirmationPage = new Adw.PreferencesPage({
		title: 'Connect your desktop',
	})
	const confirmationGroup = new Adw.PreferencesGroup()
	confirmationPage.add(confirmationGroup)
	const confirmation = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		spacing: 24,
		margin_top: 48,
		margin_bottom: 24,
	})
	confirmationGroup.add(confirmation)
	confirmation.append(
		new Gtk.Image({
			icon_name: 'computer-symbolic',
			pixel_size: 64,
			css_classes: ['dim-label'],
		}),
	)
	confirmation.append(
		new Gtk.Label({
			label: 'Confirm in your browser',
			css_classes: ['title-1'],
			wrap: true,
			justify: Gtk.Justification.CENTER,
		}),
	)
	confirmation.append(
		new Gtk.Label({
			label:
				'Check that this code matches the code shown in your browser, then click “Connect desktop”.',
			wrap: true,
			justify: Gtk.Justification.CENTER,
			css_classes: ['dim-label'],
		}),
	)
	const confirmationCode = new Gtk.Label({
		selectable: true,
		margin_top: 12,
		margin_bottom: 12,
	})
	confirmation.append(confirmationCode)
	const waiting = new Gtk.Label({
		label: 'Opening browser sign-in…',
		wrap: true,
		justify: Gtk.Justification.CENTER,
	})
	confirmation.append(waiting)
	confirmation.append(
		new Gtk.Label({
			label:
				'Keep Settings open until connected.\nClose this window to cancel.',
			wrap: true,
			justify: Gtk.Justification.CENTER,
			css_classes: ['dim-label'],
		}),
	)
	let showingConfirmation = false

	let previous = initial
	const submit = () => {
		if (!signIn.sensitive) return
		const input = {
			apiUrl: previous.apiUrl,
			webUrl: previous.webUrl,
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
	return {
		render(state: AccountState): void {
			const showConfirmation = state.browserConfirmationCode !== null
			if (showConfirmation !== showingConfirmation) {
				window.remove(showingConfirmation ? confirmationPage : page)
				window.add(showConfirmation ? confirmationPage : page)
				showingConfirmation = showConfirmation
			}
			const code = state.browserConfirmationCode
			confirmationCode.visible = Boolean(code)
			if (code) {
				// Only schema-validated hexadecimal codes enter this markup.
				confirmationCode.set_markup(
					`<span font_family="monospace" size="32768" weight="bold">${code}</span>`,
				)
			}
			waiting.label = code
				? 'Waiting for browser confirmation…'
				: 'Opening browser sign-in…'

			for (const row of [email, password])
				row.sensitive = !state.busy && !state.connected
			browserSignIn.sensitive = !state.busy && !state.connected
			signIn.sensitive = !state.busy && !state.connected
			signOut.sensitive = !state.busy
			status.subtitle = state.message
			// Preserve unsaved input while reflecting confirmed account changes.
			if (
				state.email !== previous.email ||
				(state.status === 'signed-out' && previous.status !== 'signed-out')
			)
				email.text = state.email
			previous = state
		},
	}
}
