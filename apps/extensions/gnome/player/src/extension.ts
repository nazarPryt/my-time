import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import { PlayerApplication } from '@/shell/application'

export default class PlayerControlsExtension extends Extension {
	private application: PlayerApplication | null = null

	enable(): void {
		this.application = new PlayerApplication(this)
		this.application.enable()
	}

	disable(): void {
		this.application?.disable()
		this.application = null
	}
}
