import { describe, expect, it } from 'bun:test'
import {
	bumpFor,
	type Commit,
	draftNoteItems,
	nextVersion,
	parseConventional,
	renderMarkdown,
} from './release-lib'

function commit(subject: string, body = ''): Commit {
	return { subject, body, parents: ['p1'] }
}

function merge(subject: string, body = ''): Commit {
	return { subject, body, parents: ['p1', 'p2'] }
}

describe('parseConventional', () => {
	it('reads type, scope and breaking marker', () => {
		expect(parseConventional('feat(web)!: drop old login')).toEqual({
			type: 'feat',
			breaking: true,
			description: 'drop old login',
		})
		expect(parseConventional('Add a thing')).toBeNull()
	})
})

describe('bumpFor', () => {
	it('picks the largest bump requested', () => {
		expect(bumpFor([commit('fix: a'), commit('feat: b')])).toBe('minor')
		expect(bumpFor([commit('fix: a'), commit('refactor!: b')])).toBe('major')
		expect(bumpFor([commit('fix: a', 'BREAKING CHANGE: api')])).toBe('major')
		expect(bumpFor([commit('perf: a'), commit('chore: b')])).toBe('patch')
	})

	it('returns null when only chores changed', () => {
		expect(bumpFor([commit('chore: deps'), commit('ci: cache')])).toBeNull()
	})
})

describe('nextVersion', () => {
	it('resets lower parts', () => {
		expect(nextVersion('1.4.2', 'major')).toBe('2.0.0')
		expect(nextVersion('1.4.2', 'minor')).toBe('1.5.0')
		expect(nextVersion('1.4.2', 'patch')).toBe('1.4.3')
	})
})

describe('draftNoteItems', () => {
	const branches: Record<string, Commit[]> = {
		"Merge branch 'feature/player' into dev": [
			commit('feat(gnome): player controls in the top bar'),
			commit('fix(gnome): keep volume after restart'),
			commit('test: player'),
		],
		"Merge branch 'chore/deps' into dev": [commit('chore: bump deps')],
	}
	const mergedBy = (m: Commit) => branches[m.subject] ?? []

	it('expands default local merges into their feat/fix commits', () => {
		expect(
			draftNoteItems(
				[
					merge("Merge branch 'feature/player' into dev"),
					merge("Merge branch 'chore/deps' into dev"),
				],
				mergedBy,
			),
		).toEqual({
			features: ['Player controls in the top bar'],
			fixes: ['Keep volume after restart'],
		})
	})

	it('uses a conventional merge title as one item without expanding', () => {
		expect(
			draftNoteItems(
				[
					merge('feat: GNOME player controls'),
					merge(
						'Merge pull request #6 from me/x',
						'fix(api): retry login (#6)',
					),
				],
				() => [commit('feat: should not appear')],
			),
		).toEqual({ features: ['GNOME player controls'], fixes: ['Retry login'] })
	})

	it('takes direct commits one by one and skips chores and duplicates', () => {
		expect(
			draftNoteItems(
				[
					commit('feat(web): add loading skeletons'),
					commit('chore: bump deps'),
					commit('wip'),
					commit('feat(web): add loading skeletons'),
				],
				mergedBy,
			),
		).toEqual({ features: ['Add loading skeletons'], fixes: [] })
	})
})

describe('renderMarkdown', () => {
	it('renders sections that have items', () => {
		expect(
			renderMarkdown({
				version: '1.0.0',
				date: '2026-11-19',
				features: ['A'],
				fixes: [],
			}),
		).toBe('## New\n\n- A\n')
	})
})
