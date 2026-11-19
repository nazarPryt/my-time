import { afterEach, beforeAll, describe, expect, it, spyOn } from 'bun:test'
import { RELEASE_NOTES } from 'contracts'
import { releasesRepository } from '../repository'
import { releasesService } from '../service'

const LATEST = RELEASE_NOTES[0]?.version ?? '0.0.0'

let stored: string | null = null

beforeAll(() => {
	spyOn(releasesRepository, 'getLastSeenVersion').mockImplementation(
		async () => stored,
	)
	spyOn(releasesRepository, 'setLastSeenVersion').mockImplementation(
		async (_userId, version) => {
			stored = version
		},
	)
})

afterEach(() => {
	stored = null
})

describe('releasesService.markSeen', () => {
	it('does not move the marker back to an older version', async () => {
		stored = '999.0.0'
		const result = await releasesService.markSeen('user-1', LATEST)
		expect(result).toEqual({ lastSeenVersion: '999.0.0' })
		expect(stored).toBe('999.0.0')
	})

	it('returns null for an unknown version without writing', async () => {
		const result = await releasesService.markSeen('user-1', '999.0.0')
		expect(result).toBeNull()
		expect(stored).toBeNull()
	})
})
