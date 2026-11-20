import {
	compareVersions,
	RELEASE_NOTES,
	type SeenReleaseResponse,
	type Version,
} from '@my-time/contracts'
import { releasesRepository } from './repository'

export const releasesService = {
	getSeen: async (userId: string): Promise<SeenReleaseResponse> => ({
		lastSeenVersion: await releasesRepository.getLastSeenVersion(userId),
	}),

	/** Returns null when the version has no release notes. */
	markSeen: async (
		userId: string,
		version: Version,
	): Promise<SeenReleaseResponse | null> => {
		if (!RELEASE_NOTES.some((note) => note.version === version)) return null
		const current = await releasesRepository.getLastSeenVersion(userId)
		// A tab still running an older build must not move the marker backwards.
		if (current && compareVersions(version, current) <= 0) {
			return { lastSeenVersion: current }
		}
		await releasesRepository.setLastSeenVersion(userId, version)
		return { lastSeenVersion: version }
	},
}
