import { describe, expect, test } from 'bun:test'
import { buildSteps, toDryRun } from './steps'

const paths = { root: '/repo', worktree: '/tmp/wt' }

describe('buildSteps', () => {
	test('starts in the repo and then runs everything in the worktree', () => {
		const [create, ...rest] = buildSteps({ ...paths, branch: 'feature' })
		expect(create.cwd).toBe('/repo')
		expect(create.command).toEqual([
			'git',
			'worktree',
			'add',
			'--detach',
			'/tmp/wt',
			'HEAD',
		])
		for (const step of rest) expect(step.cwd.startsWith('/tmp/wt')).toBe(true)
	})

	test('builds the extension from its own folder', () => {
		const step = buildSteps({ ...paths, branch: 'feature' }).find(
			({ name }) => name === 'Build extension',
		)
		expect(step?.cwd).toBe('/tmp/wt/apps/extensions/browser')
	})

	test('starts the database right before the API tests', () => {
		const steps = buildSteps({ ...paths, branch: 'feature' })
		const database = steps.findIndex(({ startsDatabase }) => startsDatabase)
		expect(steps[database + 1].name).toBe('API tests')
	})

	test('checks the release version only on dev', () => {
		const names = (branch: string) =>
			buildSteps({ ...paths, branch }).map(({ name }) => name)
		expect(names('dev')).toContain('Release version check')
		expect(names('feature')).not.toContain('Release version check')
	})

	test('step names are unique, since timings are keyed by name', () => {
		const names = buildSteps({ ...paths, branch: 'dev' }).map(
			({ name }) => name,
		)
		expect(new Set(names).size).toBe(names.length)
	})
})

describe('toDryRun', () => {
	test('keeps every step name but runs nothing and starts no database', () => {
		const steps = buildSteps({ ...paths, branch: 'feature' })
		const dry = toDryRun(steps, '/repo')
		expect(dry.map(({ name }) => name)).toEqual(steps.map(({ name }) => name))
		for (const step of dry) {
			expect(step).toEqual({ name: step.name, command: ['true'], cwd: '/repo' })
		}
	})
})
