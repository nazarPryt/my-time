import type Adw from 'gi://Adw?version=1'
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js'
import { type AvailablePlayer, PlayerDiscovery } from '@/dal/player-discovery'
import { PlayerSettings } from '@/dal/settings-store'
import {
	createPlayerPage,
	type PlayerOption,
	type PlayerPageState,
} from '@/preferences/ui/player-page'

/** The saved player stays listed while closed so the choice never disappears. */
function toOptions(
	players: AvailablePlayer[],
	selected: { id: string; name: string },
): PlayerOption[] {
	const options = players.map((player) => ({ ...player, running: true }))
	if (selected.id && !options.some((option) => option.id === selected.id))
		options.unshift({
			id: selected.id,
			name: selected.name || selected.id,
			icon: null,
			running: false,
		})
	return options
}

export default class PlayerControlsPreferences extends ExtensionPreferences {
	fillPreferencesWindow(window: Adw.PreferencesWindow): void {
		const settings = new PlayerSettings(this.getSettings())
		const page = createPlayerPage((option) => {
			if (option.id !== settings.read().id)
				settings.select({ id: option.id, name: option.name })
		})
		window.add(page.page)

		let players: AvailablePlayer[] = []
		let state: PlayerPageState = {
			loading: true,
			error: '',
			options: [],
			selectedId: '',
		}
		const render = () => {
			const selected = settings.read()
			state = {
				...state,
				options: toOptions(players, selected),
				selectedId: selected.id,
			}
			page.render(state)
		}
		let revision = 0
		const refresh = () => {
			const current = ++revision
			discovery
				.list()
				.then((list) => {
					if (current !== revision) return
					players = list
					state = { ...state, loading: false, error: '' }
					render()
				})
				.catch(() => {
					if (current !== revision) return
					state = {
						...state,
						loading: false,
						error: 'Unable to list media players',
					}
					render()
				})
		}
		const discovery = new PlayerDiscovery(refresh)
		const unsubscribe = settings.subscribe(render)
		window.connect('close-request', () => {
			revision++
			unsubscribe()
			discovery.dispose()
			return false
		})
		render()
		refresh()
	}
}
