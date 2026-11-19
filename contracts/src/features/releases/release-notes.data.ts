// Written by `bun run release`; edit the wording by hand before committing.
// Newest release first.
import type { ReleaseNote } from './release-note'

export const RELEASE_NOTES: ReleaseNote[] = [
	{
		version: '0.4.0',
		date: '2026-11-19',
		features: [
			"See what's new: click the version in the sidebar, a dot shows unread updates",
			'Dashboard tabs show a preview of their layout while loading, not a blank box',
		],
		fixes: [],
	},
	{
		version: '0.3.0',
		date: '2026-10-22',
		features: [
			'Track time from the GNOME desktop extension, synced live with the web app',
			'Site-blocking browser extension with guided setup',
		],
		fixes: [],
	},
]
