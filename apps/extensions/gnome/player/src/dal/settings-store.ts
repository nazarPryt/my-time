import type Gio from 'gi://Gio'

export interface SelectedPlayer {
	/** Stable MPRIS id such as `rhythmbox`; empty until the user chooses. */
	id: string
	name: string
}

/** The only place that knows the GSettings keys. */
export class PlayerSettings {
	constructor(private readonly settings: Gio.Settings) {}

	read(): SelectedPlayer {
		return {
			id: this.settings.get_string('selected-player'),
			name: this.settings.get_string('selected-player-name'),
		}
	}

	select(player: SelectedPlayer): void {
		this.settings.delay()
		this.settings.set_string('selected-player-name', player.name)
		this.settings.set_string('selected-player', player.id)
		this.settings.apply()
	}

	subscribe(onChange: () => void): () => void {
		const id = this.settings.connect('changed', (_settings, key: string) => {
			if (key === 'selected-player' || key === 'selected-player-name')
				onChange()
		})
		return () => this.settings.disconnect(id)
	}
}
