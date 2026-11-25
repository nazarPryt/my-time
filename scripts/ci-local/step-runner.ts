import {
	lastLine,
	type OutputStream,
	type ProcessRunner,
	type StepState,
} from '../shared/step-runner'
import type { Step } from './steps'

export type RunStep = (
	step: Step,
	state: StepState,
	index: number,
) => Promise<number>

// Plain mode streams to the terminal; otherwise output goes to a log file
// and the latest line feeds the live step list.
export function createStepRunner({
	runner,
	plain,
	logPath,
}: {
	runner: ProcessRunner
	plain: boolean
	logPath: (index: number) => string
}): RunStep {
	if (plain) {
		return (step) => {
			console.info(`\n> ${step.name}: ${step.command.join(' ')}`)
			return runner.run(step.command, step.cwd, 'inherit')
		}
	}
	return async (step, state, index) => {
		const log = Bun.file(logPath(index)).writer()
		log.write(`$ ${step.command.join(' ')}\n`)
		// One decoder per stream so a multi-byte character split across chunks survives.
		const decoders: Record<OutputStream, TextDecoder> = {
			stdout: new TextDecoder(),
			stderr: new TextDecoder(),
		}
		try {
			return await runner.run(step.command, step.cwd, (chunk, stream) => {
				log.write(chunk)
				const text = decoders[stream].decode(chunk, { stream: true })
				state.lastLine = lastLine(text) ?? state.lastLine
			})
		} finally {
			await log.end()
		}
	}
}
