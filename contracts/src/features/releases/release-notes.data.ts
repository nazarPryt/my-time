// Written by `bun run release`; edit the wording by hand before committing.
// Newest release first.
import type { ReleaseNote } from './release-note'

export const RELEASE_NOTES: ReleaseNote[] = [
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
