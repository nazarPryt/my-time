// Written by `bun run release`; edit the wording by hand before committing.
// Newest release first.
import type { ReleaseNote } from './release-note'

export const RELEASE_NOTES: ReleaseNote[] = [
	{
		version: '0.5.0',
		date: '2026-11-20',
		features: [
			'Practise English in the new English quiz tab on the dashboard',
			'Check your level with a multiple-choice quiz for A2, B1 and B2',
			'Translate Ukrainian sentences into English in 66 grammar topics, beginner to advanced',
			"Read each topic's grammar rule with examples, then practise it in short rounds",
			'Get credit for correct alternative translations and contractions in the sentence builder',
		],
		fixes: [],
	},
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
