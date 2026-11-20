import Adw from 'gi://Adw?version=1'
import type Gio from 'gi://Gio'
import Gtk from 'gi://Gtk?version=4.0'

export interface PlayerOption {
	id: string
	name: string
	icon: Gio.Icon | null
	running: boolean
}

export interface PlayerPageState {
	loading: boolean
	error: string
	options: PlayerOption[]
	selectedId: string
}

/** Renders the player list and forwards the user's choice. */
export function createPlayerPage(onSelect: (option: PlayerOption) => void) {
	const page = new Adw.PreferencesPage({
		title: 'Player',
		icon_name: 'audio-x-generic-symbolic',
	})
	const group = new Adw.PreferencesGroup({
		title: 'Controlled player',
		description:
			'The panel buttons control only this player. They are hidden while it is not running. Only running players can be listed, so start your player to see it here.',
	})
	page.add(group)
	let rows: Adw.ActionRow[] = []
	let rendering = false

	function clear(): void {
		for (const row of rows) group.remove(row)
		rows = []
	}

	function addMessage(title: string): void {
		const row = new Adw.ActionRow({ title })
		group.add(row)
		rows.push(row)
	}

	return {
		page,
		render(state: PlayerPageState): void {
			rendering = true
			clear()
			if (state.error) addMessage(state.error)
			else if (state.loading && !state.options.length)
				addMessage('Looking for players…')
			else if (!state.options.length) addMessage('No media players are running')
			let first: Gtk.CheckButton | null = null
			for (const option of state.options) {
				const check = new Gtk.CheckButton({
					active: option.id === state.selectedId,
					valign: Gtk.Align.CENTER,
				})
				if (first) check.set_group(first)
				else first = check
				const row = new Adw.ActionRow({
					title: option.name,
					subtitle: option.running ? option.id : `${option.id} · not running`,
					activatable_widget: check,
				})
				row.add_prefix(check)
				const image = option.icon
					? Gtk.Image.new_from_gicon(option.icon)
					: Gtk.Image.new_from_icon_name('audio-x-generic-symbolic')
				image.pixel_size = 32
				row.add_suffix(image)
				check.connect('toggled', () => {
					if (!rendering && check.active) onSelect(option)
				})
				group.add(row)
				rows.push(row)
			}
			rendering = false
		},
	}
}
