import type Gio from 'gi://Gio'
import { normalizeApiUrl } from '@/shared/urls'
import {
	emptyOfflineJournal,
	OfflineJournalSchema,
	type OfflineStore,
} from './offline-store'

export type TimerMode = 'session' | 'daily'

export interface ConnectionSettings {
	apiUrl: string
	webUrl: string
	email: string
	connected: boolean
}

export interface SettingsStore {
	read(): ConnectionSettings
	connectAccount(connection: Omit<ConnectionSettings, 'connected'>): void
	disconnectAccount(): void
	clearAccount(): void
	subscribe(onChange: () => void): () => void
}

/** Owns persistence and translates GSettings keys into application values. */
export class GSettingsStore implements SettingsStore {
	constructor(private settings: Gio.Settings) {}
	createOfflineStore(apiUrl: string, ownerId: string): OfflineStore {
		const key = JSON.stringify([normalizeApiUrl(apiUrl), ownerId])
		const read = (): Record<string, unknown> => {
			const value: unknown = JSON.parse(
				this.settings.get_string('offline-work'),
			)
			if (!value || typeof value !== 'object' || Array.isArray(value))
				throw new Error(
					'Offline work could not be read. Your saved data has been preserved.',
				)
			return value as Record<string, unknown>
		}
		return {
			load: () => {
				const value = read()[key]
				return value === undefined
					? emptyOfflineJournal()
					: OfflineJournalSchema.parse(value)
			},
			save: (journal) => {
				const records = read()
				records[key] = journal
				if (!this.settings.set_string('offline-work', JSON.stringify(records)))
					throw new Error('Unable to save offline work.')
				this.settings.apply()
			},
		}
	}
	readTimerMode(): TimerMode {
		return this.settings.get_string('timer-mode') === 'daily'
			? 'daily'
			: 'session'
	}
	setTimerMode(mode: TimerMode): void {
		this.settings.set_string('timer-mode', mode)
		this.settings.apply()
	}
	subscribeTimerMode(onChange: () => void): () => void {
		const id = this.settings.connect('changed::timer-mode', onChange)
		return () => this.settings.disconnect(id)
	}
	read(): ConnectionSettings {
		return {
			apiUrl: this.settings.get_string('api-url'),
			webUrl: this.settings.get_string('web-url'),
			email: this.settings.get_string('account-email'),
			connected: this.settings.get_boolean('connected'),
		}
	}
	connectAccount(connection: Omit<ConnectionSettings, 'connected'>): void {
		this.settings.delay()
		this.settings.set_string('api-url', connection.apiUrl)
		this.settings.set_string('web-url', connection.webUrl)
		this.settings.set_string('account-email', connection.email)
		this.settings.set_int(
			'account-revision',
			this.settings.get_int('account-revision') + 1,
		)
		this.settings.set_boolean('connected', true)
		this.settings.apply()
	}
	disconnectAccount(): void {
		this.settings.set_boolean('connected', false)
		this.settings.apply()
	}
	clearAccount(): void {
		this.settings.set_string('account-email', '')
		this.settings.apply()
	}
	subscribe(onChange: () => void): () => void {
		const id = this.settings.connect('changed', (_settings, key: string) => {
			if (
				[
					'api-url',
					'web-url',
					'account-email',
					'connected',
					'account-revision',
				].includes(key)
			)
				onChange()
		})
		return () => this.settings.disconnect(id)
	}
}
