import { describe, expect, it } from 'bun:test'
import type { ReleaseNote } from '@my-time/contracts'
import { releasedNotes, unseenVersions } from './unseen-releases'

function note(version: string): ReleaseNote {
	return { version, date: '2026-11-19', features: ['x'], fixes: [] }
}

const NOTES = [note('0.3.0'), note('0.5.0'), note('0.4.0')]

describe('releasedNotes', () => {
	it('sorts newest first and hides notes newer than the running build', () => {
		expect(releasedNotes(NOTES, '0.4.0').map((n) => n.version)).toEqual([
			'0.4.0',
			'0.3.0',
		])
	})
})

describe('unseenVersions', () => {
	it('returns only the latest release when nothing was seen yet', () => {
		expect([...unseenVersions(NOTES, '0.5.0', null)]).toEqual(['0.5.0'])
	})

	it('returns every release newer than the last seen one', () => {
		expect([...unseenVersions(NOTES, '0.5.0', '0.3.0')]).toEqual([
			'0.5.0',
			'0.4.0',
		])
	})

	it('returns nothing when the current release was already seen', () => {
		expect(unseenVersions(NOTES, '0.5.0', '0.5.0').size).toBe(0)
	})

	it('ignores a last-seen version newer than this build', () => {
		expect(unseenVersions(NOTES, '0.4.0', '0.5.0').size).toBe(0)
	})
})
