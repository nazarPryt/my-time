import GLib from 'gi://GLib'
import type { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import { TrackerController } from '@/bll/tracker-controller'
import { createApiClient } from '@/dal/services'
import { GSettingsStore } from '@/dal/settings-store'
import { TrackerPanel } from '@/shell/ui/tracker-panel'
import { openWebTracker } from './browser-launch.js'

export class DesktopApplication {
	private settings: GSettingsStore | null = null
	private unsubscribe: (() => void) | null = null
	private tickSource = 0
	private syncSource = 0
	private tracker: TrackerController | null = null
	private panel: TrackerPanel | null = null
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
		this.connectTracker()
		this.tickSource = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => {
			this.render()
			return GLib.SOURCE_CONTINUE
		})
		this.syncSource = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
			void this.tracker?.refresh()
			return GLib.SOURCE_CONTINUE
		})
	}
	disable(): void {
		for (const source of [this.tickSource, this.syncSource]) {
			if (source) GLib.Source.remove(source)
		}
		this.tickSource = 0
		this.syncSource = 0
		this.unsubscribe?.()
		this.unsubscribe = null
		this.tracker?.dispose()
		this.tracker = null
		this.settings = null
		this.panel?.destroy()
		this.panel = null
	}
	private connectTracker(): void {
		this.tracker?.dispose()
		this.tracker = null
		const connection = this.settings?.read()
		if (connection?.connected) {
			try {
				this.tracker = new TrackerController(
					createApiClient(connection.apiUrl),
					() => {
						if (this.tracker?.state.status === 'signed-out')
							this.settings?.disconnectAccount()
						this.render()
					},
				)
				void this.tracker.refresh()
			} catch {
				this.settings?.disconnectAccount()
			}
		}
		this.render()
	}
	private render(): void {
		this.panel?.render(this.tracker?.state)
	}
}
