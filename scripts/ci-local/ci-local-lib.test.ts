import { describe, expect, test } from 'bun:test'
import {
	listUncommittedChanges,
	REQUIRED_PORTS,
	readBunVersion,
} from './ci-local-lib'

describe('readBunVersion', () => {
	test('reads the workflow-level env value', () => {
		const workflow = 'name: CI\nenv:\n  BUN_VERSION: 1.4.2\n  OTHER: x\n'
		expect(readBunVersion(workflow)).toBe('1.4.2')
	})

	test('accepts quotes and trailing comments', () => {
		expect(readBunVersion(`env:\n  BUN_VERSION: "1.3.0" # pinned\n`)).toBe(
			'1.3.0',
		)
		expect(readBunVersion(`env:\n  BUN_VERSION: '1.3.1'\n`)).toBe('1.3.1')
	})

	test('ignores expressions that read env.BUN_VERSION', () => {
		const usage = ['bun-version: $', '{{ env.BUN_VERSION }}\n'].join('')
		expect(readBunVersion(usage)).toBeUndefined()
	})

	test('matches the real workflow', async () => {
		const workflow = await Bun.file(
			new URL('../../.github/workflows/ci.yml', import.meta.url),
		).text()
		expect(readBunVersion(workflow)).toMatch(/^\d+\.\d+\.\d+/)
	})
})

describe('listUncommittedChanges', () => {
	test('returns one entry per changed path', () => {
		expect(listUncommittedChanges(' M a.ts\n?? b.ts\n')).toEqual([
			' M a.ts',
			'?? b.ts',
		])
	})

	test('is empty for a clean tree', () => {
		expect(listUncommittedChanges('')).toEqual([])
	})
})

describe('REQUIRED_PORTS', () => {
	test('covers every server and database the run starts', () => {
		expect(REQUIRED_PORTS.map(({ port }) => port).sort()).toEqual([
			3000, 3101, 3102, 5173, 5174, 5434, 5435,
		])
	})
})
