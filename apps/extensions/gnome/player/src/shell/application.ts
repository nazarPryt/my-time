import type { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import { PlayerController } from '@/bll/player-controller'
import { createMprisPlayerFactory } from '@/dal/mpris-player'
import { PlayerSettings } from '@/dal/settings-store'
import { PlayerPanel } from '@/shell/ui/player-panel'

function reportError(error: unknown): void {
	console.warn('[Player Controls]', error)
}

/** Composition root of the Shell process; everything created here is destroyed in disable(). */
export class PlayerApplication {
	private unsubscribe: (() => void) | null = null
	private controller: PlayerController | null = null
	private panel: PlayerPanel | null = null

	constructor(private readonly extension: Extension) {}

	enable(): void {
		const settings = new PlayerSettings(this.extension.getSettings())
		const panel = new PlayerPanel({
			playPause: () => this.controller?.playPause(),
			next: () => this.controller?.next(),
			previous: () => this.controller?.previous(),
			openPreferences: () => this.extension.openPreferences(),
		})
		Main.panel.addToStatusArea(this.extension.uuid, panel.indicator, 0, 'right')
		const controller = new PlayerController(
			createMprisPlayerFactory(reportError),
			(state) => panel.render(state),
			reportError,
		)
		this.panel = panel
		this.controller = controller
		this.unsubscribe = settings.subscribe(() =>
			controller.select(settings.read().id),
		)
		controller.select(settings.read().id)
	}

	disable(): void {
		this.unsubscribe?.()
		this.unsubscribe = null
		this.controller?.dispose()
		this.controller = null
		this.panel?.destroy()
		this.panel = null
	}
}
