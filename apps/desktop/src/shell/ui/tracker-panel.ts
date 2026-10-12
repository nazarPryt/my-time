import Clutter from 'gi://Clutter'
import GObject from 'gi://GObject'
import St from 'gi://St'
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js'
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'
import type { TrackerState } from '@/bll/tracker-controller'
import { formatElapsed } from '@/shared/elapsed'

// Let the native play/stop buttons handle their own events without opening the menu.
const Indicator = GObject.registerClass(
	class MyTimeIndicator extends PanelMenu.Button {
		vfunc_event(event: Clutter.Event): boolean {
			for (
				let source: Clutter.Actor | null = event.get_source();
				source && source !== this;
				source = source.get_parent()
			) {
				if (source instanceof St.Button) return Clutter.EVENT_PROPAGATE
			}
			return super.vfunc_event(event)
		}
	},
)

interface PanelControls {
	indicator: PanelMenu.Button
	timer: St.Label
	play: St.Button
	stop: St.Button
	status: PopupMenu.PopupMenuItem
	sync: PopupMenu.PopupMenuItem
}

export interface PanelActions {
	refresh(): void
	start(): void
	stop(): void
	openWebTracker(): void
	openPreferences(): void
}

export class TrackerPanel {
	private controls: PanelControls | null = null
	constructor(actions: PanelActions) {
		const indicator = new Indicator(0.0, 'my-time work timer')
		const box = new St.BoxLayout({
			style_class: 'my-time-panel',
			y_align: Clutter.ActorAlign.CENTER,
		})
		const play = this.makeButton('media-playback-start-symbolic', 'Start work')
		const stop = this.makeButton(
			'media-playback-stop-symbolic',
			'Stop and save work',
		)
		const timer = new St.Label({
			text: '00:00:00',
			style_class: 'my-time-timer',
			y_align: Clutter.ActorAlign.CENTER,
		})
		stop.hide()
		box.add_child(play)
		box.add_child(stop)
		box.add_child(timer)
		indicator.add_child(box)
		const menu = indicator.menu as PopupMenu.PopupMenu
		const status = new PopupMenu.PopupMenuItem('Open Settings to connect', {
			reactive: false,
		})
		menu.addMenuItem(status)
		menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem())
		const sync = new PopupMenu.PopupMenuItem('Refresh now')
		sync.connect('activate', () => {
			void actions.refresh()
		})
		menu.addMenuItem(sync)
		menu.addAction('Open web tracker', () => actions.openWebTracker())
		menu.addAction('Settings', () => actions.openPreferences())
		this.controls = { indicator, timer, play, stop, status, sync }
		play.connect('clicked', () => {
			void actions.start()
		})
		stop.connect('clicked', () => {
			void actions.stop()
		})
	}
	get indicator(): PanelMenu.Button {
		if (!this.controls) throw new Error('Panel destroyed')
		return this.controls.indicator
	}
	destroy(): void {
		this.controls?.indicator.destroy()
		this.controls = null
	}
	private makeButton(iconName: string, label: string): St.Button {
		const button = new St.Button({
			style_class: 'my-time-control',
			accessible_name: label,
			can_focus: true,
			reactive: true,
			track_hover: true,
		})
		button.set_child(
			new St.Icon({ icon_name: iconName, style_class: 'system-status-icon' }),
		)
		return button
	}

	render(state: TrackerState | undefined, seconds: number | null): void {
		if (!this.controls) return
		const { indicator, timer, play, stop, status, sync } = this.controls
		const available =
			state &&
			(!state.busy || state.syncingOffline) &&
			['ready', 'working', 'offline'].includes(state.status)
		play.visible = !state?.activeSession
		stop.visible = Boolean(state?.activeSession)
		play.reactive = play.can_focus = Boolean(available && !state?.activeSession)
		stop.reactive = stop.can_focus = Boolean(available && state?.activeSession)
		for (const button of [play, stop]) {
			if (button.reactive) button.remove_style_pseudo_class('disabled')
			else button.add_style_pseudo_class('disabled')
		}
		timer.text =
			state?.status === 'offline'
				? state.activeSession && seconds !== null
					? formatElapsed(seconds)
					: 'Offline'
				: seconds === null
					? 'Loading…'
					: formatElapsed(seconds)
		status.label.text =
			state?.message ?? 'Open Settings to connect your account'
		sync.setSensitive(Boolean(state && !state.busy))
		indicator.accessible_name = `my-time: ${status.label.text}, ${timer.text}`
		if (state?.status === 'working')
			timer.add_style_class_name('my-time-working')
		else timer.remove_style_class_name('my-time-working')
		if (state?.status === 'offline')
			timer.add_style_class_name('my-time-offline')
		else timer.remove_style_class_name('my-time-offline')
	}
}
