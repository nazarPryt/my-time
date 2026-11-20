import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js'
import { DesktopApplication } from '@/shell/application'

export default class MyTimeExtension extends Extension {
	private application: DesktopApplication | null = null
	enable(): void {
		this.application = new DesktopApplication(this)
		this.application.enable()
	}
	disable(): void {
		this.application?.disable()
		this.application = null
	}
}
