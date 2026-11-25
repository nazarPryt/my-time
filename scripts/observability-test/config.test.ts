import { describe, expect, test } from 'bun:test'
import { composeCommand, createConfig, parseArgs } from './config'

describe('parseArgs', () => {
	test('a terminal gets the live step list', () => {
		expect(parseArgs([], true)).toEqual({ plain: false, keep: false })
	})

	test('a pipe always streams', () => {
		expect(parseArgs([], false)?.plain).toBe(true)
	})

	test('accepts --plain and --keep', () => {
		expect(parseArgs(['--plain', '--keep'], true)).toEqual({
			plain: true,
			keep: true,
		})
	})

	test('rejects unknown flags', () => {
		expect(parseArgs(['--fast'], true)).toBeUndefined()
	})
})

describe('createConfig', () => {
	const config = createConfig(
		'/repo',
		{ plain: false, keep: false },
		{ XDG_CACHE_HOME: '/cache', JWT_SECRET: 'mine' },
	)

	test('keeps timings next to ci:local in the cache', () => {
		expect(config.timingsFile).toBe(
			'/cache/my-time-observability-test/timings.json',
		)
	})

	test('fills prod-only Compose variables without overriding real ones', () => {
		expect(config.env.POSTGRES_USER).toBe('unused')
		expect(config.env.JWT_SECRET).toBe('mine')
	})
})

test('composeCommand layers the test file over the local stack', () => {
	expect(composeCommand('down')).toEqual([
		'docker',
		'compose',
		'-p',
		'my-time-observability-test',
		'-f',
		'docker-compose.observability.yml',
		'-f',
		'docker-compose.observability-test.yml',
		'down',
	])
})
