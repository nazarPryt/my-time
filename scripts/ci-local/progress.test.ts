import { describe, expect, test } from 'bun:test'
import {
	estimateRemaining,
	fit,
	formatDuration,
	lastLine,
	progressBar,
	renderLines,
	type StepState,
	stripAnsi,
	type View,
} from './progress'

test('formatDuration switches units as runs get longer', () => {
	expect(formatDuration(3_240)).toBe('3.2s')
	expect(formatDuration(42_400)).toBe('42s')
	expect(formatDuration(185_000)).toBe('3m 05s')
})

test('progressBar clamps the ratio', () => {
	expect(progressBar(0.5, 4)).toBe('██░░')
	expect(progressBar(2, 3)).toBe('███')
	expect(progressBar(-1, 2)).toBe('░░')
})

test('fit truncates with an ellipsis', () => {
	expect(fit('abcdef', 4)).toBe('abc…')
	expect(fit('abc', 4)).toBe('abc')
})

test('lastLine returns the newest non-empty line without colours', () => {
	expect(lastLine('one\n\x1b[32mtwo\x1b[0m\n\n')).toBe('two')
	expect(lastLine('progress 10%\rprogress 20%')).toBe('progress 20%')
	expect(lastLine('\n  \n')).toBeUndefined()
})

describe('estimateRemaining', () => {
	const states: StepState[] = [
		{ name: 'a', status: 'passed' },
		{ name: 'b', status: 'running', startedAt: 1_000 },
		{ name: 'c', status: 'pending' },
	]

	test('adds what is left of the running step to the pending ones', () => {
		expect(
			estimateRemaining({
				states,
				timings: { b: 5_000, c: 2_000 },
				now: 3_000,
			}),
		).toBe(5_000)
	})

	test('never counts an overrunning step as negative', () => {
		expect(
			estimateRemaining({
				states,
				timings: { b: 1_000, c: 2_000 },
				now: 9_000,
			}),
		).toBe(2_000)
	})

	test('is unknown while a remaining step has no timing', () => {
		expect(
			estimateRemaining({ states, timings: { b: 5_000 }, now: 3_000 }),
		).toBeUndefined()
	})
})

describe('renderLines', () => {
	const view = (overrides: Partial<View> = {}): View => ({
		title: 'my-time local CI',
		states: [
			{ name: 'Lint', status: 'passed', startedAt: 0, endedAt: 2_000 },
			{
				name: 'API tests',
				status: 'running',
				startedAt: 2_000,
				lastLine: '(pass) health',
			},
			{ name: 'Build web', status: 'pending' },
		],
		timings: { 'API tests': 8_000, 'Build web': 4_000 },
		startedAt: 0,
		now: 6_000,
		columns: 100,
		rows: 40,
		...overrides,
	})

	test('shows every step, the running step progress and its latest output', () => {
		const lines = renderLines(view()).map(stripAnsi)
		expect(lines[1]).toContain('1/3 steps · 6.0s elapsed · ~8.0s left')
		expect(lines).toContainEqual(expect.stringMatching(/^✓ Lint +2\.0s$/))
		expect(lines).toContainEqual(
			expect.stringMatching(/API tests .* 50% {2}4\.0s \/ ~8\.0s$/),
		)
		expect(lines).toContain('  └ (pass) health')
		expect(lines).toContainEqual(expect.stringMatching(/^○ Build web +~4\.0s$/))
	})

	test('never draws a line wider than the terminal', () => {
		for (const line of renderLines(view({ columns: 30 }))) {
			expect(stripAnsi(line).length).toBeLessThanOrEqual(29)
		}
	})

	test('scrolls a long list to keep the running step visible', () => {
		const states: StepState[] = Array.from({ length: 30 }, (_, index) => ({
			name: `Step ${index}`,
			status: index < 20 ? 'passed' : index === 20 ? 'running' : 'pending',
			startedAt: 0,
		}))
		const lines = renderLines(view({ states, rows: 12 })).map(stripAnsi)
		expect(lines.length).toBeLessThanOrEqual(12)
		expect(lines.some((line) => line.includes('Step 20'))).toBe(true)
		expect(lines.some((line) => line.includes('Step 0 '))).toBe(false)
	})
})
