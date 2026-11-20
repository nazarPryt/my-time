import { describe, expect, it } from 'bun:test'
import { ReleaseNoteSchema } from './release-note'
import { RELEASE_NOTES } from './release-notes.data'
import { compareVersions } from './version'

describe('compareVersions', () => {
	it('orders by major, then minor, then patch', () => {
		expect(compareVersions('1.0.0', '0.9.9')).toBeGreaterThan(0)
		expect(compareVersions('0.4.0', '0.10.0')).toBeLessThan(0)
		expect(compareVersions('0.4.2', '0.4.10')).toBeLessThan(0)
		expect(compareVersions('2.3.4', '2.3.4')).toBe(0)
	})
})

describe('RELEASE_NOTES', () => {
	it('contains valid entries, newest first, without duplicates', () => {
		for (const note of RELEASE_NOTES) ReleaseNoteSchema.parse(note)
		for (let i = 1; i < RELEASE_NOTES.length; i++) {
			const newer = RELEASE_NOTES[i - 1]
			const older = RELEASE_NOTES[i]
			if (!newer || !older) continue
			expect(compareVersions(newer.version, older.version)).toBeGreaterThan(0)
		}
	})
})
