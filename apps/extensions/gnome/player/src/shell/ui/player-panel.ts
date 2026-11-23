import Clutter from 'gi://Clutter'
import St from 'gi://St'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js'
import type { PlayerState } from '@/bll/player-controller'
import { trackLabel } from '@/shared/mpris'

export interface PanelActions {
	playPause(): void
	next(): void
	previous(): void
	openPreferences(): void
}

interface PanelControls {
	indicator: PanelMenu.Button
	choose: St.Button
	previous: St.Button
	playPause: St.Button
	playPauseIcon: St.Icon
	next: St.Button
	tooltip: St.Label
}

const TOOLTIP_GAP = 6
const CHANGE_PLAYER_HINT = 'Right-click to change player'

/** Renders controller state; owns every actor it creates. */
export class PlayerPanel {
	private controls: PanelControls | null = null
	private trackText = ''

	constructor(actions: PanelActions) {
		// No popup menu: a dummy menu keeps the indicator light.
		const indicator = new PanelMenu.Button(0.0, 'Player Controls', true)
		const box = new St.BoxLayout({
			style_class: 'player-controls-panel',
			y_align: Clutter.ActorAlign.CENTER,
		})
		const choose = makeButton(
			'audio-x-generic-symbolic',
			'Choose a player to control',
		).button
		const previous = makeButton(
			'media-skip-backward-symbolic',
			'Previous track',
		).button
		const playPause = makeButton('media-playback-start-symbolic', 'Play')
		const next = makeButton('media-skip-forward-symbolic', 'Next track').button
		for (const button of [choose, previous, playPause.button, next])
			box.add_child(button)
		indicator.add_child(box)
		const tooltip = new St.Label({
			style_class: 'player-controls-tooltip',
			visible: false,
		})
		Main.uiGroup.add_child(tooltip)

		choose.connect('clicked', () => actions.openPreferences())
		previous.connect('clicked', () => actions.previous())
		playPause.button.connect('clicked', () => actions.playPause())
		next.connect('clicked', () => actions.next())
		indicator.connect('notify::hover', () => this.syncTooltip())
		// St.Button ignores secondary clicks, so they bubble up to the indicator.
		indicator.connect('button-press-event', (_actor, event: Clutter.Event) => {
			if (event.get_button() !== Clutter.BUTTON_SECONDARY)
				return Clutter.EVENT_PROPAGATE
			actions.openPreferences()
			return Clutter.EVENT_STOP
		})

		this.controls = {
			indicator,
			choose,
			previous,
			playPause: playPause.button,
			playPauseIcon: playPause.icon,
			next,
			tooltip,
		}
		this.render({ status: 'unconfigured' })
	}

	get indicator(): PanelMenu.Button {
		if (!this.controls) throw new Error('Panel destroyed')
		return this.controls.indicator
	}

	render(state: PlayerState): void {
		if (!this.controls) return
		const { indicator, choose, previous, playPause, playPauseIcon, next } =
			this.controls
		// Hiding the container removes the panel slot entirely, not just its content.
		indicator.container.visible = state.status !== 'not-running'
		choose.visible = state.status === 'unconfigured'
		const running = state.status === 'running'
		for (const button of [previous, playPause, next]) button.visible = running
		if (state.status === 'running') {
			const { playback } = state
			const playing = playback.status === 'playing'
			playPauseIcon.icon_name = playing
				? 'media-playback-pause-symbolic'
				: 'media-playback-start-symbolic'
			playPause.accessible_name = playing ? 'Pause' : 'Play'
			setEnabled(playPause, playback.canPlayPause)
			setEnabled(previous, playback.canGoPrevious)
			setEnabled(next, playback.canGoNext)
			this.trackText = trackLabel(playback)
		} else {
			this.trackText =
				state.status === 'unconfigured' ? 'Choose a player to control' : ''
		}
		indicator.accessible_name = this.trackText
			? `Player Controls: ${this.trackText}`
			: 'Player Controls'
		this.syncTooltip()
	}

	destroy(): void {
		if (!this.controls) return
		this.controls.tooltip.destroy()
		this.controls.indicator.destroy()
		this.controls = null
	}

	private syncTooltip(): void {
		if (!this.controls) return
		const { indicator, tooltip } = this.controls
		if (!indicator.hover || !indicator.container.visible) {
			tooltip.hide()
			return
		}
		tooltip.text = this.trackText
			? `${this.trackText}\n${CHANGE_PLAYER_HINT}`
			: CHANGE_PLAYER_HINT
		const [x, y] = indicator.get_transformed_position()
		const [width, height] = indicator.get_transformed_size()
		const [, tooltipWidth] = tooltip.get_preferred_width(-1)
		const monitor = Main.layoutManager.findMonitorForActor(indicator)
		const left = monitor?.x ?? 0
		const right = left + (monitor?.width ?? global.stage.width)
		tooltip.set_position(
			Math.round(
				Math.min(
					Math.max(x + width / 2 - tooltipWidth / 2, left),
					right - tooltipWidth,
				),
			),
			Math.round(y + height + TOOLTIP_GAP),
		)
		tooltip.show()
	}
}

function makeButton(iconName: string, label: string) {
	const icon = new St.Icon({
		icon_name: iconName,
		style_class: 'system-status-icon',
	})
	const button = new St.Button({
		style_class: 'player-controls-button',
		accessible_name: label,
		can_focus: true,
		reactive: true,
		track_hover: true,
		child: icon,
	})
	return { button, icon }
}

function setEnabled(button: St.Button, enabled: boolean): void {
	button.reactive = button.can_focus = enabled
	if (enabled) button.remove_style_pseudo_class('disabled')
	else button.add_style_pseudo_class('disabled')
}
