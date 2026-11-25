import { mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { OutputStream, ProcessRunner } from './process-runner'
import { lastLine, type StepState } from './progress'
import type { Step } from './steps'

export type RunStep = (
	step: Step,
	state: StepState,
	index: number,
) => Promise<number>

export function stepLogPath(logDir: string, index: number, name: string) {
	const number = String(index + 1).padStart(2, '0')
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
	return resolve(logDir, `${number}-${slug}.log`)
}

export async function resetLogDir(logDir: string) {
	await rm(logDir, { recursive: true, force: true })
	await mkdir(logDir, { recursive: true })
}

export async function readLogTail(file: string, maxLines: number) {
	const lines = (await Bun.file(file).text()).trimEnd().split('\n')
	return lines.slice(-maxLines)
}

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
