import { describe, expect, test } from 'bun:test'
import { createConfig, parseArgs } from './config'

describe('parseArgs', () => {
	test('uses the live step list only in a terminal', () => {
		expect(parseArgs([], true)).toEqual({
			plain: false,
			dryRun: false,
			allowDirty: false,
		})
		expect(parseArgs([], false)).toEqual({
			plain: true,
			dryRun: false,
			allowDirty: false,
		})
		expect(parseArgs(['--plain'], true)).toMatchObject({ plain: true })
	})

	test('reads --dry-run', () => {
		expect(parseArgs(['--dry-run'], true)).toEqual({
			plain: false,
			dryRun: true,
			allowDirty: false,
		})
		expect(parseArgs(['--allow-dirty'], true)).toMatchObject({
			allowDirty: true,
		})
	})

	test('rejects unknown arguments', () => {
		expect(parseArgs(['--fast'], true)).toBeUndefined()
	})
})

describe('createConfig', () => {
	test('points tests at the disposable CI database', () => {
		const { env } = createConfig(
			'/repo',
			{ plain: true, dryRun: false, allowDirty: false },
			{ HOME: '/h' },
		)
		expect(env.CI).toBe('true')
		expect(env.HOME).toBe('/h')
		expect(env.DATABASE_URL).toContain(`:${env.TEST_DB_PORT}/my_time_ci`)
	})

	test('gives a dry run its own worktree and logs', () => {
		const real = createConfig(
			'/repo',
			{ plain: true, dryRun: false, allowDirty: false },
			{},
		)
		const dry = createConfig(
			'/repo',
			{ plain: true, dryRun: true, allowDirty: false },
			{},
		)
		expect(dry.worktree).not.toBe(real.worktree)
		expect(dry.logDir).not.toBe(real.logDir)
	})

	test('keeps timings in XDG_CACHE_HOME when set', () => {
		const config = createConfig(
			'/repo',
			{ plain: true, dryRun: false, allowDirty: false },
			{ XDG_CACHE_HOME: '/c' },
		)
		expect(config.timingsFile).toBe('/c/my-time-ci/timings.json')
	})
})
