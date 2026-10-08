import Clutter from 'gi://Clutter'
import Gio from 'gi://Gio'
import GLib from 'gi://GLib'
import GObject from 'gi://GObject'
import St from 'gi://St'
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js'
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js'
import { ApiClient } from './api/client.js'
import { normalizeUrl } from './model/config.js'
import { elapsedSeconds, formatElapsed } from './model/elapsed.js'
import { TrackerController } from './model/tracker.js'
import { SoupTransport } from './platform/http.js'
import { KeyringTokenStore } from './platform/token-store.js'

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

export default class MyTimeExtension extends Extension {
	private settings: Gio.Settings | null = null
	private settingsSignal = 0
	private tickSource = 0
	private syncSource = 0
	private tracker: TrackerController | null = null
	private controls: PanelControls | null = null

	enable(): void {
		this.settings = this.getSettings()
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
			void this.tracker?.refresh()
		})
		menu.addMenuItem(sync)
		menu.addAction('Open web tracker', () => this.openWebTracker())
		menu.addAction('Settings', () => this.openPreferences())
		this.controls = { indicator, timer, play, stop, status, sync }
		play.connect('clicked', () => {
			void this.tracker?.start()
		})
		stop.connect('clicked', () => {
			void this.tracker?.stop()
		})
		Main.panel.addToStatusArea(this.uuid, indicator, 0, 'right')
		this.settingsSignal = this.settings.connect(
			'changed',
			(_settings, key: string) => {
				if (['api-url', 'connected', 'account-revision'].includes(key))
					this.connectTracker()
			},
		)
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
		this.tracker?.dispose()
		this.tracker = null
		for (const source of [this.tickSource, this.syncSource]) {
			if (source) GLib.Source.remove(source)
		}
		this.tickSource = 0
		this.syncSource = 0
		if (this.settings && this.settingsSignal)
			this.settings.disconnect(this.settingsSignal)
		this.settingsSignal = 0
		this.settings = null
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

	private connectTracker(): void {
		this.tracker?.dispose()
		this.tracker = null
		if (this.settings?.get_boolean('connected')) {
			try {
				const server = this.settings.get_string('api-url')
				this.tracker = new TrackerController(
					new ApiClient(
						new SoupTransport(server),
						new KeyringTokenStore(server),
					),
					() => {
						if (this.tracker?.state.status === 'signed-out')
							this.settings?.set_boolean('connected', false)
						this.render()
					},
				)
				void this.tracker.refresh()
			} catch {
				this.settings.set_boolean('connected', false)
			}
		}
		this.render()
	}

	private render(): void {
		if (!this.controls) return
		const { indicator, timer, play, stop, status, sync } = this.controls
		const state = this.tracker?.state
		const available =
			state && !state.busy && ['ready', 'working'].includes(state.status)
		play.reactive = play.can_focus = Boolean(available && !state?.activeSession)
		stop.reactive = stop.can_focus = Boolean(available && state?.activeSession)
		for (const button of [play, stop]) {
			if (button.reactive) button.remove_style_pseudo_class('disabled')
			else button.add_style_pseudo_class('disabled')
		}
		timer.text = formatElapsed(elapsedSeconds(state?.activeSession ?? null))
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

	private openWebTracker(): void {
		if (!this.settings) return
		try {
			const url = `${normalizeUrl(this.settings.get_string('web-url'))}/dashboard/time-tracker`
			Gio.AppInfo.launch_default_for_uri_async(
				url,
				null,
				null,
				(_source, result) => {
					try {
						Gio.AppInfo.launch_default_for_uri_finish(result)
					} catch {
						Main.notify(
							'my·time',
							'Unable to open the web tracker. Check your browser and web URL.',
						)
					}
				},
			)
		} catch {
			Main.notify('my·time', 'Set your web application URL in Settings.')
		}
	}
}
