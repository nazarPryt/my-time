import { compareVersions, type ReleaseNote } from 'contracts'

/** Notes for this build and older, newest first. */
export function releasedNotes(
	notes: ReleaseNote[],
	currentVersion: string,
): ReleaseNote[] {
	return notes
		.filter((note) => compareVersions(note.version, currentVersion) <= 0)
		.sort((a, b) => compareVersions(b.version, a.version))
}

/**
 * Versions the user hasn't opened yet. Someone who never opened the notes
 * only gets the latest release, not the whole history.
 */
export function unseenVersions(
	notes: ReleaseNote[],
	currentVersion: string,
	lastSeenVersion: string | null,
): Set<string> {
	const released = releasedNotes(notes, currentVersion)
	const unseen =
		lastSeenVersion === null
			? released.slice(0, 1)
			: released.filter(
					(note) => compareVersions(note.version, lastSeenVersion) > 0,
				)
	return new Set(unseen.map((note) => note.version))
}
