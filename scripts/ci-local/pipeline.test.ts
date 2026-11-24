import { describe, expect, test } from 'bun:test'
import { createStates, reachedDatabaseStep, runPipeline } from './pipeline'
import type { Step } from './steps'

const step = (name: string, startsDatabase = false): Step => ({
	name,
	command: ['true'],
	cwd: '/wt',
	startsDatabase,
})
const steps = [step('Lint'), step('Start database', true), step('Tests')]

function run(codes: number[], isInterrupted = () => false) {
	const states = createStates(steps)
	const timings: Record<string, number> = {}
	const ran: string[] = []
	const outcome = runPipeline({
		steps,
		states,
		timings,
		isInterrupted,
		runStep: async (current, _state, index) => {
			ran.push(current.name)
			return codes[index] ?? 0
		},
	})
	return { outcome, states, timings, ran }
}

describe('runPipeline', () => {
	test('runs every step and records timings when all pass', async () => {
		const { outcome, states, timings } = run([0, 0, 0])
		expect(await outcome).toEqual({ status: 'passed' })
		expect(states.map(({ status }) => status)).toEqual([
			'passed',
			'passed',
			'passed',
		])
		expect(Object.keys(timings)).toEqual(['Lint', 'Start database', 'Tests'])
	})

	test('stops at the first failing step', async () => {
		const { outcome, states, ran, timings } = run([0, 2, 0])
		expect(await outcome).toEqual({ status: 'failed', index: 1 })
		expect(ran).toEqual(['Lint', 'Start database'])
		expect(states[1]).toMatchObject({ status: 'failed', exitCode: 2 })
		expect(states[2].status).toBe('pending')
		expect(timings['Start database']).toBeUndefined()
	})

	test('marks the running step interrupted and runs nothing after it', async () => {
		let interrupted = false
		const states = createStates(steps)
		const outcome = await runPipeline({
			steps,
			states,
			timings: {},
			isInterrupted: () => interrupted,
			runStep: async () => {
				interrupted = true
				return 130
			},
		})
		expect(outcome).toEqual({ status: 'interrupted' })
		expect(states.map(({ status }) => status)).toEqual([
			'interrupted',
			'pending',
			'pending',
		])
	})
})

describe('reachedDatabaseStep', () => {
	test('is true once the database step has started', async () => {
		const early = run([1])
		await early.outcome
		expect(reachedDatabaseStep(steps, early.states)).toBe(false)

		const later = run([0, 1])
		await later.outcome
		expect(reachedDatabaseStep(steps, later.states)).toBe(true)
	})
})
