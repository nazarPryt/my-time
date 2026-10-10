import { expect, test } from 'bun:test'
import type { ConnectionSettings, SettingsStore } from '@/dal/settings-store'
import {
	AccountController,
	type AccountState,
	type SignInInput,
} from './account-controller.js'

const input: SignInInput = {
	apiUrl: 'http://localhost:3000',
	webUrl: 'http://localhost:5173',
	email: 'user@example.com',
	password: 'password123',
}
function fixture(
	login: () => Promise<void> = async () => {},
	clear: () => Promise<void> = async () => {},
) {
	let connection: ConnectionSettings = { ...input, email: '', connected: false }
	const events: string[] = []
	const states: AccountState[] = []
	let listener: (() => void) | undefined
	const settings: SettingsStore = {
		read: () => ({ ...connection }),
		connectAccount(value) {
			connection = { ...value, connected: true }
			events.push('connect')
			listener?.()
		},
		disconnectAccount() {
			connection.connected = false
			events.push('disconnect-account')
			listener?.()
		},
		clearAccount() {
			connection.email = ''
			events.push('clear-account')
			listener?.()
		},
		subscribe(callback) {
			listener = callback
			return () => {
				listener = undefined
				events.push('unsubscribe')
			}
		},
	}
	const controller = new AccountController(
		settings,
		{
			createClient: () => ({
				login,
				dispose() {
					events.push('dispose-client')
				},
			}),
			createStorage: () => ({
				load: async () => null,
				save: async () => {},
				clear: async () => {
					events.push('clear-tokens')
					await clear()
				},
				dispose() {
					events.push('dispose-storage')
				},
			}),
		},
		(state) => states.push(state),
	)
	return { controller, settings, events, states }
}

test('sign-in publishes normalized settings only after confirmation', async () => {
	let confirm: (() => void) | undefined
	const f = fixture(
		() =>
			new Promise<void>((resolve) => {
				confirm = resolve
			}),
	)
	const pending = f.controller.signIn(input)
	expect(f.settings.read().connected).toBe(false)
	expect(f.controller.state.busy).toBe(true)
	confirm?.()
	await pending
	expect(f.settings.read()).toEqual({
		apiUrl: 'http://localhost:3000/api/v1',
		webUrl: input.webUrl,
		email: input.email,
		connected: true,
	})
	expect(f.controller.state.busy).toBe(false)
	expect(f.controller.state.message).toBe(`Connected as ${input.email}`)
})

test('sign-out disconnects the panel before clearing credentials', async () => {
	const f = fixture()
	await f.controller.signIn(input)
	f.events.length = 0
	await f.controller.signOut()
	expect(f.events.slice(0, 2)).toEqual(['disconnect-account', 'clear-tokens'])
	expect(f.controller.state.email).toBe('')
	expect(f.controller.state.connected).toBe(false)
})

test('closing preferences cancels the client and ignores late login success', async () => {
	let confirm: (() => void) | undefined
	const f = fixture(
		() =>
			new Promise<void>((resolve) => {
				confirm = resolve
			}),
	)
	const pending = f.controller.signIn(input)
	f.controller.dispose()
	const count = f.states.length
	confirm?.()
	await pending
	expect(f.settings.read().connected).toBe(false)
	expect(f.states).toHaveLength(count)
	expect(f.events.filter((event) => event === 'dispose-client')).toHaveLength(1)
	expect(f.events).toContain('unsubscribe')
})

test('failed sign-in preserves its error and allows retry', async () => {
	let fail = true
	const f = fixture(async () => {
		if (fail) throw new Error('Invalid credentials')
	})
	await f.controller.signIn(input)
	expect(f.controller.state.message).toBe('Invalid credentials')
	expect(f.controller.state.busy).toBe(false)
	expect(f.settings.read().connected).toBe(false)
	fail = false
	await f.controller.signIn(input)
	expect(f.controller.state.connected).toBe(true)
})

test('invalid input never creates a client or publishes connected settings', async () => {
	const f = fixture()
	await f.controller.signIn({ ...input, apiUrl: 'http://remote.example.com' })
	expect(f.events).not.toContain('dispose-client')
	expect(f.settings.read().connected).toBe(false)
	expect(f.controller.state.message).toContain('HTTPS')
})

test('sign-out failure leaves panel disconnected and preserves error for retry', async () => {
	let fail = true
	const f = fixture(undefined, async () => {
		if (fail) throw new Error('Keyring unavailable')
	})
	await f.controller.signIn(input)
	await f.controller.signOut()
	expect(f.controller.state.connected).toBe(false)
	expect(f.controller.state.email).toBe(input.email)
	expect(f.controller.state.message).toBe('Keyring unavailable')
	fail = false
	await f.controller.signOut()
	expect(f.controller.state.email).toBe('')
})

test('closing during sign-out ignores late completion', async () => {
	let confirm: (() => void) | undefined
	const f = fixture(
		undefined,
		() =>
			new Promise<void>((resolve) => {
				confirm = resolve
			}),
	)
	await f.controller.signIn(input)
	const pending = f.controller.signOut()
	f.controller.dispose()
	const count = f.states.length
	confirm?.()
	await pending
	expect(f.states).toHaveLength(count)
	expect(f.events).not.toContain('clear-account')
	expect(f.events.filter((event) => event === 'dispose-storage')).toHaveLength(
		1,
	)
})
