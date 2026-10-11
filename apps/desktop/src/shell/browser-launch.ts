import Gio from 'gi://Gio'
import * as Main from 'resource:///org/gnome/shell/ui/main.js'
import { normalizeUrl } from '@/shared/urls'

export function openWebTracker(webUrl: string): void {
	try {
		const url = `${normalizeUrl(webUrl)}/dashboard/time-tracker`
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
						'Unable to open the web tracker. Check your browser and try again.',
					)
				}
			},
		)
	} catch {
		Main.notify(
			'my·time',
			'Unable to open the web tracker. Reinstall the latest extension and try again.',
		)
	}
}
