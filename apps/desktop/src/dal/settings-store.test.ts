import type Gio from 'gi://Gio'
import { expect, test } from 'bun:test'
import { GSettingsStore } from './settings-store.js'

function fixture() {
	const values: Record<string, string | boolean | number> = {
		'api-url': 'http://localhost:3000/api/v1',
		'web-url': 'http://localhost:5173',
		'account-email': '',
		'account-revision': 4,
		connected: false,
	}
	const events: string[] = []
	let listener: ((_settings: unknown, key: string) => void) | undefined
	const native = {
		get_string: (key: string) => String(values[key]),
		get_boolean: (key: string) => Boolean(values[key]),
		get_int: (key: string) => Number(values[key]),
		set_string(key: string, value: string) {
			values[key] = value
			events.push(key)
		},
		set_boolean(key: string, value: boolean) {
			values[key] = value
			events.push(key)
		},
		set_int(key: string, value: number) {
			values[key] = value
			events.push(key)
		},
		delay() {
			events.push('delay')
		},
		apply() {
			events.push('apply')
		},
		connect(_signal: string, callback: typeof listener) {
			listener = callback
			return 17
		},
		disconnect(id: number) {
			events.push(`disconnect:${id}`)
			listener = undefined
		},
	}
	return {
		store: new GSettingsStore(native as unknown as Gio.Settings),
		values,
		events,
		change: (key: string) => listener?.(native, key),
	}
}

test('settings adapter publishes connection settings in a batch and increments account revision', () => {
	const f = fixture()
	f.store.connectAccount({
		apiUrl: 'https://api.example.com/api/v1',
		webUrl: 'https://example.com',
		email: 'user@example.com',
	})
	expect(f.events).toEqual([
		'delay',
		'api-url',
		'web-url',
		'account-email',
		'account-revision',
		'connected',
		'apply',
	])
	expect(f.values['account-revision']).toBe(5)
	expect(f.store.read().connected).toBe(true)
	f.store.disconnectAccount()
	expect(f.store.read().connected).toBe(false)
	expect(f.store.read().email).toBe('user@example.com')
	f.store.clearAccount()
	expect(f.store.read().email).toBe('')
})

test('settings subscription filters unrelated signals and disconnects its owned handler', () => {
	const f = fixture()
	let count = 0
	const unsubscribe = f.store.subscribe(() => {
		count++
	})
	f.change('unrelated')
	expect(count).toBe(0)
	f.change('connected')
	f.change('account-revision')
	expect(count).toBe(2)
	unsubscribe()
	f.change('connected')
	expect(count).toBe(2)
	expect(f.events).toContain('disconnect:17')
})
