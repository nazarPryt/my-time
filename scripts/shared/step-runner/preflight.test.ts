import { expect, test } from 'bun:test'
import { findBusyPorts, formatFailures } from './preflight'

const PORTS = [
	{ port: 3000, use: 'API' },
	{ port: 5173, use: 'web' },
]

test('findBusyPorts keeps only the ports the probe reports busy', async () => {
	const busy = await findBusyPorts(PORTS, async (port) => port === 5173)
	expect(busy.map(({ port }) => port)).toEqual([5173])
})

test('formatFailures lists every problem with its fix under the title', () => {
	const text = formatFailures(
		[
			{ problem: 'Port 5173 is in use', fix: 'Stop the dev server' },
			{ problem: 'Docker is not running', fix: 'Start Docker' },
		],
		'Prerequisites not met',
	)
	expect(text.startsWith('Prerequisites not met:\n\n')).toBe(true)
	expect(text).toContain('✗ Port 5173 is in use\n    fix: Stop the dev server')
	expect(text).toContain('✗ Docker is not running\n    fix: Start Docker')
})
