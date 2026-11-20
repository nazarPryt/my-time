import Adw from 'gi://Adw?version=1'
import Gtk from 'gi://Gtk?version=4.0'
import type { TimerMode } from '@/dal/settings-store'

/** Preferences forwards a choice; persistence belongs to the composition root. */
export function createTimerPage(
	initial: TimerMode,
	onChange: (mode: TimerMode) => void,
) {
	const page = new Adw.PreferencesPage({
		title: 'Timer',
		icon_name: 'preferences-system-time-symbolic',
	})
	const group = new Adw.PreferencesGroup({
		title: 'Panel timer',
		description:
			'Current session resets when stopped. Daily total keeps all work recorded today and resets at server midnight.',
	})
	const row = new Adw.ComboRow({
		title: 'Timer mode',
		model: Gtk.StringList.new(['Current session', 'Daily total']),
		selected: initial === 'daily' ? 1 : 0,
	})
	row.connect('notify::selected', () =>
		onChange(row.selected === 1 ? 'daily' : 'session'),
	)
	group.add(row)
	page.add(group)
	return {
		page,
		render(mode: TimerMode): void {
			const selected = mode === 'daily' ? 1 : 0
			if (row.selected !== selected) row.selected = selected
		},
	}
}
