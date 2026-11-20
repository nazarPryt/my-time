import GLib from 'gi://GLib'
import type { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import { createClockCheck } from '@my-time/session-sync'
import { OfflineTracker } from '@/bll/offline-tracker'
import { TrackerController } from '@/bll/tracker-controller'
import { readAccountId } from '@/dal/account-identity'
import type { ApiClient } from '@/dal/api-client'
import { RetryDelay } from '@/dal/retry-delay'
import { createApiClient } from '@/dal/services'
import { GSettingsStore } from '@/dal/settings-store'
import { TrackerPanel } from '@/shell/ui/tracker-panel'
import { openWebTracker } from './browser-launch.js'

export class DesktopApplication {
	private settings: GSettingsStore | null = null
	private unsubscribe: (() => void) | null = null
	private unsubscribeTimer: (() => void) | null = null
	private tickSource = 0
	private tracker: TrackerController | null = null
	private panel: TrackerPanel | null = null
	private connectionRevision = 0
	private connectingApi: ApiClient | null = null
	constructor(private extension: Extension) {}
	enable(): void {
		this.settings = new GSettingsStore(this.extension.getSettings())
		this.panel = new TrackerPanel({
			refresh: () => {
				void this.tracker?.refresh()
			},
			start: () => {
				void this.tracker?.start()
			},
			stop: () => {
				void this.tracker?.stop()
			},
			openWebTracker: () => {
				if (this.settings) openWebTracker(this.settings.read().webUrl)
			},
			openPreferences: () => this.extension.openPreferences(),
		})
		Main.panel.addToStatusArea(
			this.extension.uuid,
			this.panel.indicator,
			0,
			'right',
		)
		this.unsubscribe = this.settings.subscribe(() => this.connectTracker())
		this.unsubscribeTimer = this.settings.subscribeTimerMode(() =>
			this.render(),
		)
		this.connectTracker()
		const checkClock = createClockCheck(
			() => GLib.get_monotonic_time() / 1000,
			() => {
				void this.tracker?.refresh()
			},
		)
		this.tickSource = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
			checkClock()
			this.render()
			return GLib.SOURCE_CONTINUE
		})
	}
	disable(): void {
		this.connectionRevision++
		this.connectingApi?.dispose()
		this.connectingApi = null
		if (this.tickSource) GLib.Source.remove(this.tickSource)
		this.tickSource = 0
		this.unsubscribe?.()
		this.unsubscribe = null
		this.unsubscribeTimer?.()
		this.unsubscribeTimer = null
		this.tracker?.dispose()
		this.tracker = null
		this.settings = null
		this.panel?.destroy()
		this.panel = null
	}
	private connectTracker(): void {
		const revision = ++this.connectionRevision
		this.connectingApi?.dispose()
		this.connectingApi = null
		this.tracker?.dispose()
		this.tracker = null
		const connection = this.settings?.read()
		if (connection?.connected) {
			try {
				const api = createApiClient(connection.apiUrl)
				this.connectingApi = api
				void readAccountId(api)
					.then((ownerId) => {
						if (revision !== this.connectionRevision || !this.settings) {
							api.dispose()
							return
						}
						const offline = new OfflineTracker(
							this.settings.createOfflineStore(connection.apiUrl, ownerId),
							ownerId,
							() => GLib.uuid_string_random(),
						)
						this.connectingApi = null
						this.tracker = new TrackerController(
							api,
							() => {
								if (this.tracker?.state.status === 'signed-out')
									this.settings?.disconnectAccount()
								this.render()
							},
							offline,
							new RetryDelay(),
						)
						void this.tracker.connect(new RetryDelay())
						this.render()
					})
					.catch((error: unknown) => {
						api.dispose()
						if (this.connectingApi === api) this.connectingApi = null
						if (revision === this.connectionRevision)
							Main.notify(
								'my-time',
								error instanceof Error
									? error.message
									: 'Unable to restore offline work.',
							)
					})
			} catch {
				this.settings?.disconnectAccount()
			}
		}
		this.render()
	}
	private render(): void {
		// Daily accounting needs the API; keep the provisional session timer
		// visible offline without changing the user's saved display preference.
		const mode =
			this.tracker?.state.status === 'offline'
				? 'session'
				: (this.settings?.readTimerMode() ?? 'session')
		const seconds = this.tracker ? this.tracker.displayedSeconds(mode) : 0
		this.panel?.render(this.tracker?.state, seconds)
	}
}
