export const RELEASES_TEST_IDS = {
	versionTrigger: 'releases-version-trigger',
	unseenDot: 'releases-unseen-dot',
	dialog: 'releases-dialog',
	dialogClose: 'releases-dialog-close',
	note: (version: string) => `releases-note-${version}`,
	newBadge: 'releases-new-badge',
} as const
