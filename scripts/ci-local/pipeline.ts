import type { StepState } from './progress'
import type { RunStep } from './step-runner'
import type { Step } from './steps'
import type { Timings } from './timings'

export type PipelineOutcome =
	| { status: 'passed' }
	| { status: 'failed'; index: number }
	| { status: 'interrupted' }

export function createStates(steps: Step[]): StepState[] {
	return steps.map(({ name }) => ({ name, status: 'pending' }))
}

// Runs steps in order and stops at the first failure or interrupt.
export async function runPipeline({
	steps,
	states,
	timings,
	runStep,
	isInterrupted,
}: {
	steps: Step[]
	states: StepState[]
	timings: Timings
	runStep: RunStep
	isInterrupted: () => boolean
}): Promise<PipelineOutcome> {
	for (const [index, step] of steps.entries()) {
		if (isInterrupted()) return { status: 'interrupted' }
		const state = states[index]
		const startedAt = Date.now()
		Object.assign(state, { status: 'running', startedAt })

		const exitCode = await runStep(step, state, index)
		state.endedAt = Date.now()
		state.exitCode = exitCode

		if (isInterrupted()) {
			state.status = 'interrupted'
			return { status: 'interrupted' }
		}
		if (exitCode !== 0) {
			state.status = 'failed'
			return { status: 'failed', index }
		}
		state.status = 'passed'
		timings[step.name] = state.endedAt - startedAt
	}
	return { status: 'passed' }
}

export function reachedDatabaseStep(steps: Step[], states: StepState[]) {
	return steps.some(
		(step, index) => step.startsDatabase && states[index].status !== 'pending',
	)
}
